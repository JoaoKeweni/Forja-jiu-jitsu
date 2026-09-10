using Forja.Api.Auth;
using Forja.Api.Data;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "Professor")]
public class PaymentsController(ForjaDbContext db, ITeamScopeService scope) : ControllerBase
{
    /// <summary>
    /// Planilha financeira (ADM-04): alunos x pagamentos do ano, filtrados por equipe.
    /// Escopo por equipe do professor (RN-02/RN-03).
    /// </summary>
    [HttpGet("grid")]
    public async Task<ActionResult<IEnumerable<FinanceRowDto>>> Grid(
        [FromQuery] Guid? teamId, [FromQuery] int? year)
    {
        var professorId = User.GetUserId();
        var teamIds = await scope.GetProfessorTeamIdsAsync(professorId);
        if (teamId is not null)
        {
            await scope.EnsureProfessorOwnsTeamAsync(professorId, teamId.Value);
            teamIds = [teamId.Value];
        }

        var targetYear = year ?? DateTime.UtcNow.Year;

        var rows = await db.Students
            .Include(s => s.Profile)
            .Where(s => teamIds.Contains(s.TeamId) && s.Status == StudentStatus.Active)
            .Select(s => new FinanceRowDto(
                s.Id, s.Profile.FullName, s.Profile.Phone, s.DueDay,
                s.Payments.Where(p => p.Year == targetYear)
                    .OrderBy(p => p.Month)
                    .Select(p => ToDto(p))))
            .ToListAsync();

        return Ok(rows);
    }

    /// <summary>Dá baixa em um pagamento (marca como Pago) — RN-04.</summary>
    [HttpPost("{id:guid}/settle")]
    public async Task<IActionResult> Settle(Guid id, SettlePaymentRequest req)
    {
        var payment = await LoadOwnedPaymentAsync(id);
        payment.Status = PaymentStatus.Paid;
        payment.PaidAt = DateTime.UtcNow;
        payment.Method = req.Method;
        if (req.Amount is not null) payment.Amount = req.Amount.Value;
        payment.Notes = req.Notes;
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Altera manualmente o status de um pagamento (Pago/Pendente/Atrasado/Isento) — RN-04.</summary>
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, UpdatePaymentStatusRequest req)
    {
        var payment = await LoadOwnedPaymentAsync(id);
        payment.Status = req.Status;
        if (req.Status == PaymentStatus.Paid && payment.PaidAt is null)
            payment.PaidAt = DateTime.UtcNow;
        if (req.Status != PaymentStatus.Paid)
        {
            payment.PaidAt = null;
            payment.Method = null;
        }
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Garante que o pagamento pertence a um aluno de uma equipe do professor.</summary>
    private async Task<Payment> LoadOwnedPaymentAsync(Guid paymentId)
    {
        var payment = await db.Payments.Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.Id == paymentId)
            ?? throw DomainException.NotFound("Pagamento não encontrado.");
        await scope.EnsureProfessorOwnsTeamAsync(User.GetUserId(), payment.Student.TeamId);
        return payment;
    }

    private static PaymentDto ToDto(Payment p) => new(
        p.Id, p.StudentId, p.Month, p.Year, p.Amount, p.DueDate,
        p.PaidAt, p.Method, p.Status, p.Notes);
}
