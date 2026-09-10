using Forja.Api.Auth;
using Forja.Api.Data;
using Forja.Api.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Controllers;

[ApiController]
[Route("api/professor")]
[Authorize(Roles = "Professor")]
public class ProfessorController(ForjaDbContext db) : ControllerBase
{
    /// <summary>Equipes vinculadas ao professor autenticado (para o seletor de equipe — ADM-01/RN-02).</summary>
    [HttpGet("teams")]
    public async Task<ActionResult<IEnumerable<TeamDto>>> MyTeams()
    {
        var professorId = User.GetUserId();
        var teams = await db.ProfessorTeams
            .Where(pt => pt.ProfessorId == professorId)
            .Select(pt => pt.Team)
            .OrderBy(t => t.Name)
            .Select(t => new TeamDto(t.Id, t.AcademyId, t.Name, t.Schedule, t.Students.Count))
            .ToListAsync();
        return Ok(teams);
    }

    /// <summary>KPIs do dashboard do professor no escopo das suas equipes (ADM-01).</summary>
    [HttpGet("dashboard")]
    public async Task<ActionResult<ProfessorDashboardDto>> Dashboard()
    {
        var professorId = User.GetUserId();
        var academyId = User.GetAcademyId();

        var teamIds = await db.ProfessorTeams
            .Where(pt => pt.ProfessorId == professorId)
            .Select(pt => pt.TeamId)
            .ToListAsync();

        var students = db.Students.Where(s => teamIds.Contains(s.TeamId));

        var activeStudents = await students.CountAsync(s => s.Status == Domain.StudentStatus.Active);
        var pendingApprovals = await students.CountAsync(s => s.Status == Domain.StudentStatus.Pending);

        var activeStudentIds = await students
            .Where(s => s.Status == Domain.StudentStatus.Active)
            .Select(s => s.Id).ToListAsync();

        var now = DateTime.UtcNow;
        var currentMonthPayments = db.Payments
            .Where(p => activeStudentIds.Contains(p.StudentId) && p.Year == now.Year && p.Month == now.Month);

        var overduePayments = await currentMonthPayments.CountAsync(p => p.Status == Domain.PaymentStatus.Overdue);
        var totalCurrent = await currentMonthPayments.CountAsync();
        var paidCurrent = await currentMonthPayments.CountAsync(p => p.Status == Domain.PaymentStatus.Paid);
        var adimplencia = totalCurrent == 0 ? 100.0 : Math.Round(paidCurrent * 100.0 / totalCurrent, 1);

        var upcoming = academyId is null ? 0 : await db.Tournaments
            .CountAsync(t => t.AcademyId == academyId && t.EventDate >= DateOnly.FromDateTime(now));

        return Ok(new ProfessorDashboardDto(
            activeStudents, pendingApprovals, overduePayments, adimplencia, upcoming));
    }
}
