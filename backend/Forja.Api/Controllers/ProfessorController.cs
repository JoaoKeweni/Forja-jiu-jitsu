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
}
