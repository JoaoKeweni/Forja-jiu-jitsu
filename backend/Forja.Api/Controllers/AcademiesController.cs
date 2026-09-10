using Forja.Api.Data;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Controllers;

[ApiController]
[Route("api")]
public class AcademiesController(ForjaDbContext db) : ControllerBase
{
    /// <summary>Dados públicos da academia por slug (para telas de login/cadastro — RN-06).</summary>
    [HttpGet("academies/{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<PublicAcademyDto>> GetBySlug(string slug)
    {
        var academy = await db.Academies
            .Include(a => a.Teams)
            .FirstOrDefaultAsync(a => a.Slug == slug)
            ?? throw DomainException.NotFound("Academia não encontrada.");

        var teams = academy.Teams
            .OrderBy(t => t.Name)
            .Select(t => new TeamDto(t.Id, t.AcademyId, t.Name, t.Schedule, 0));

        return Ok(new PublicAcademyDto(academy.Id, academy.Name, academy.Slug, teams));
    }

    // ── Gestão (Super Admin) ──

    [HttpGet("admin/academies")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<IEnumerable<AcademyDto>>> List()
    {
        var list = await db.Academies
            .Select(a => new AcademyDto(a.Id, a.Name, a.Slug, a.Address, a.Phone,
                a.Teams.Count, a.Students.Count))
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost("admin/academies")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<ActionResult<AcademyDto>> Create(CreateAcademyRequest req)
    {
        var slug = req.Slug.Trim().ToLowerInvariant();
        if (await db.Academies.AnyAsync(a => a.Slug == slug))
            throw DomainException.Conflict("Já existe uma academia com este slug.");

        var academy = new Academy
        {
            Id = Guid.NewGuid(),
            Name = req.Name.Trim(),
            Slug = slug,
            Address = req.Address,
            Phone = req.Phone
        };
        db.Academies.Add(academy);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetBySlug), new { slug = academy.Slug },
            new AcademyDto(academy.Id, academy.Name, academy.Slug, academy.Address, academy.Phone, 0, 0));
    }

    [HttpPut("admin/academies/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Update(Guid id, UpdateAcademyRequest req)
    {
        var academy = await db.Academies.FindAsync(id)
            ?? throw DomainException.NotFound("Academia não encontrada.");
        academy.Name = req.Name.Trim();
        academy.Address = req.Address;
        academy.Phone = req.Phone;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("admin/academies/{id:guid}")]
    [Authorize(Roles = "SuperAdmin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var academy = await db.Academies.FindAsync(id)
            ?? throw DomainException.NotFound("Academia não encontrada.");
        db.Academies.Remove(academy);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
