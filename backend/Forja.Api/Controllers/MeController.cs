using Forja.Api.Auth;
using Forja.Api.Data;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Controllers;

/// <summary>Autoatendimento do aluno (carteirinha e financeiro próprio — ALU-01/ALU-02).</summary>
[ApiController]
[Route("api/me")]
[Authorize(Roles = "Student")]
public class MeController(ForjaDbContext db) : ControllerBase
{
    /// <summary>Carteirinha digital do aluno (ALU-01).</summary>
    [HttpGet("student")]
    public async Task<ActionResult<StudentDto>> MyProfile()
    {
        var id = User.GetUserId();
        var s = await db.Students.Include(s => s.Profile).Include(s => s.Team)
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw DomainException.NotFound("Perfil de aluno não encontrado.");

        return Ok(new StudentDto(s.Id, s.Profile.FullName, s.Profile.Email, s.Profile.Phone,
            s.Profile.AvatarUrl, s.AcademyId, s.TeamId, s.Team.Name, s.Belt, s.Degrees, s.DueDay, s.Status));
    }

    /// <summary>Histórico financeiro do próprio aluno (ALU-02).</summary>
    [HttpGet("payments")]
    public async Task<ActionResult<IEnumerable<PaymentDto>>> MyPayments([FromQuery] int? year)
    {
        var id = User.GetUserId();
        var query = db.Payments.Where(p => p.StudentId == id);
        if (year is not null) query = query.Where(p => p.Year == year);

        var payments = await query
            .OrderByDescending(p => p.Year).ThenByDescending(p => p.Month)
            .Select(p => new PaymentDto(p.Id, p.StudentId, p.Month, p.Year, p.Amount,
                p.DueDate, p.PaidAt, p.Method, p.Status, p.Notes))
            .ToListAsync();

        return Ok(payments);
    }
}
