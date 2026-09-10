using Forja.Api.Data;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Controllers;

[ApiController]
[Route("api/admin/academies/{academyId:guid}/teams")]
[Authorize(Roles = "SuperAdmin")]
public class TeamsController(ForjaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamDto>>> List(Guid academyId)
    {
        var teams = await db.Teams
            .Where(t => t.AcademyId == academyId)
            .Select(t => new TeamDto(t.Id, t.AcademyId, t.Name, t.Schedule, t.Students.Count))
            .ToListAsync();
        return Ok(teams);
    }

    [HttpPost]
    public async Task<ActionResult<TeamDto>> Create(Guid academyId, CreateTeamRequest req)
    {
        if (!await db.Academies.AnyAsync(a => a.Id == academyId))
            throw DomainException.NotFound("Academia não encontrada.");

        var team = new Team
        {
            Id = Guid.NewGuid(),
            AcademyId = academyId,
            Name = req.Name.Trim(),
            Schedule = req.Schedule
        };
        db.Teams.Add(team);
        await db.SaveChangesAsync();
        return Ok(new TeamDto(team.Id, team.AcademyId, team.Name, team.Schedule, 0));
    }

    [HttpPut("{teamId:guid}")]
    public async Task<IActionResult> Update(Guid academyId, Guid teamId, UpdateTeamRequest req)
    {
        var team = await db.Teams.FirstOrDefaultAsync(t => t.Id == teamId && t.AcademyId == academyId)
            ?? throw DomainException.NotFound("Equipe não encontrada.");
        team.Name = req.Name.Trim();
        team.Schedule = req.Schedule;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{teamId:guid}")]
    public async Task<IActionResult> Delete(Guid academyId, Guid teamId)
    {
        var team = await db.Teams.FirstOrDefaultAsync(t => t.Id == teamId && t.AcademyId == academyId)
            ?? throw DomainException.NotFound("Equipe não encontrada.");
        db.Teams.Remove(team);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
