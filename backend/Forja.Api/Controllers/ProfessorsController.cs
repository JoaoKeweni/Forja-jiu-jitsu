using Forja.Api.Data;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Controllers;

[ApiController]
[Route("api/admin/professors")]
[Authorize(Roles = "SuperAdmin")]
public class ProfessorsController(ForjaDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProfessorDto>>> List()
    {
        var professors = await db.Profiles
            .Where(p => p.Role == UserRole.Professor)
            .Select(p => new ProfessorDto(p.Id, p.FullName, p.Email, p.Phone,
                p.ProfessorTeams.Select(pt => pt.TeamId)))
            .ToListAsync();
        return Ok(professors);
    }

    [HttpPost]
    public async Task<ActionResult<ProfessorDto>> Create(CreateProfessorRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        if (await db.Profiles.AnyAsync(p => p.Email == email))
            throw DomainException.Conflict("Já existe uma conta com este e-mail.");

        var professor = new Profile
        {
            Id = Guid.NewGuid(),
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = UserRole.Professor,
            FullName = req.FullName.Trim(),
            Phone = req.Phone
        };
        db.Profiles.Add(professor);

        var teamIds = req.TeamIds.Distinct().ToList();
        await LinkTeamsAsync(professor.Id, teamIds);

        await db.SaveChangesAsync();
        return Ok(new ProfessorDto(professor.Id, professor.FullName, professor.Email, professor.Phone, teamIds));
    }

    /// <summary>Atualiza os vínculos de equipe do professor (SA-03).</summary>
    [HttpPut("{id:guid}/teams")]
    public async Task<IActionResult> UpdateTeams(Guid id, UpdateProfessorTeamsRequest req)
    {
        var professor = await db.Profiles
            .Include(p => p.ProfessorTeams)
            .FirstOrDefaultAsync(p => p.Id == id && p.Role == UserRole.Professor)
            ?? throw DomainException.NotFound("Professor não encontrado.");

        db.ProfessorTeams.RemoveRange(professor.ProfessorTeams);
        await LinkTeamsAsync(id, req.TeamIds.Distinct().ToList());
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var professor = await db.Profiles.FirstOrDefaultAsync(p => p.Id == id && p.Role == UserRole.Professor)
            ?? throw DomainException.NotFound("Professor não encontrado.");
        db.Profiles.Remove(professor);
        await db.SaveChangesAsync();
        return NoContent();
    }

    private async Task LinkTeamsAsync(Guid professorId, List<Guid> teamIds)
    {
        if (teamIds.Count == 0) return;
        var validTeamCount = await db.Teams.CountAsync(t => teamIds.Contains(t.Id));
        if (validTeamCount != teamIds.Count)
            throw DomainException.NotFound("Uma ou mais equipes não foram encontradas.");

        foreach (var teamId in teamIds)
            db.ProfessorTeams.Add(new ProfessorTeam { ProfessorId = professorId, TeamId = teamId });
    }
}
