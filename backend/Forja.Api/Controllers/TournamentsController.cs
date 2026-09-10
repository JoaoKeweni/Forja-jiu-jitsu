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
[Route("api/tournaments")]
[Authorize(Roles = "Professor")]
public class TournamentsController(ForjaDbContext db, ITournamentService tournaments) : ControllerBase
{
    // ── Campeonatos ──

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TournamentDto>>> List()
    {
        var academyId = User.GetAcademyId()
            ?? throw DomainException.Forbidden("Contexto de academia ausente no token.");
        var list = await db.Tournaments
            .Where(t => t.AcademyId == academyId)
            .OrderByDescending(t => t.EventDate)
            .Select(t => new TournamentDto(t.Id, t.AcademyId, t.Title, t.EventDate, t.StartTime,
                t.Location, t.Rules, t.Status, t.Categories.Count))
            .ToListAsync();
        return Ok(list);
    }

    [HttpPost]
    public async Task<ActionResult<TournamentDto>> Create(CreateTournamentRequest req)
    {
        var academyId = User.GetAcademyId()
            ?? throw DomainException.Forbidden("Contexto de academia ausente no token.");
        var t = new Tournament
        {
            Id = Guid.NewGuid(),
            AcademyId = academyId,
            Title = req.Title.Trim(),
            EventDate = req.EventDate,
            StartTime = req.StartTime,
            Location = req.Location,
            Rules = req.Rules,
            Status = TournamentStatus.Draft
        };
        db.Tournaments.Add(t);
        await db.SaveChangesAsync();
        return Ok(new TournamentDto(t.Id, t.AcademyId, t.Title, t.EventDate, t.StartTime,
            t.Location, t.Rules, t.Status, 0));
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateTournamentRequest req)
    {
        var t = await LoadOwnedTournamentAsync(id);
        t.Title = req.Title.Trim();
        t.EventDate = req.EventDate;
        t.StartTime = req.StartTime;
        t.Location = req.Location;
        t.Rules = req.Rules;
        t.Status = req.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var t = await LoadOwnedTournamentAsync(id);
        db.Tournaments.Remove(t);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── Categorias ──

    [HttpGet("{id:guid}/categories")]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> Categories(Guid id)
    {
        await LoadOwnedTournamentAsync(id);
        var cats = await db.TournamentCategories
            .Where(c => c.TournamentId == id)
            .Select(c => new CategoryDto(c.Id, c.TournamentId, c.Title, c.Belt, c.AgeGroup,
                c.Gender, c.MaxWeight, c.Enrollments.Count))
            .ToListAsync();
        return Ok(cats);
    }

    [HttpPost("{id:guid}/categories")]
    public async Task<ActionResult<CategoryDto>> CreateCategory(Guid id, CreateCategoryRequest req)
    {
        await LoadOwnedTournamentAsync(id);
        var c = new TournamentCategory
        {
            Id = Guid.NewGuid(),
            TournamentId = id,
            Title = req.Title.Trim(),
            Belt = req.Belt,
            AgeGroup = req.AgeGroup,
            Gender = req.Gender,
            MaxWeight = req.MaxWeight
        };
        db.TournamentCategories.Add(c);
        await db.SaveChangesAsync();
        return Ok(new CategoryDto(c.Id, c.TournamentId, c.Title, c.Belt, c.AgeGroup, c.Gender, c.MaxWeight, 0));
    }

    // ── Inscrições (RN-05: apenas alunos ativos da academia) ──

    [HttpPost("categories/{categoryId:guid}/enroll")]
    public async Task<IActionResult> Enroll(Guid categoryId, EnrollStudentRequest req)
    {
        var (category, academyId) = await LoadOwnedCategoryAsync(categoryId);

        var student = await db.Students.FirstOrDefaultAsync(s => s.Id == req.StudentId)
            ?? throw DomainException.NotFound("Aluno não encontrado.");

        // RN-05: aluno deve pertencer à academia do campeonato e estar ativo.
        if (student.AcademyId != academyId)
            throw DomainException.Forbidden("Aluno não pertence à academia deste campeonato.");
        if (student.Status != StudentStatus.Active)
            throw new DomainException("Somente alunos ativos podem ser inscritos.");

        var already = await db.CategoryEnrollments
            .AnyAsync(e => e.CategoryId == categoryId && e.StudentId == req.StudentId);
        if (already) throw DomainException.Conflict("Aluno já inscrito nesta categoria.");

        db.CategoryEnrollments.Add(new CategoryEnrollment
        {
            CategoryId = categoryId,
            StudentId = req.StudentId
        });
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("categories/{categoryId:guid}/enroll/{studentId:guid}")]
    public async Task<IActionResult> Unenroll(Guid categoryId, Guid studentId)
    {
        await LoadOwnedCategoryAsync(categoryId);
        var enrollment = await db.CategoryEnrollments
            .FirstOrDefaultAsync(e => e.CategoryId == categoryId && e.StudentId == studentId)
            ?? throw DomainException.NotFound("Inscrição não encontrada.");
        db.CategoryEnrollments.Remove(enrollment);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // ── Chaveamento e súmula ──

    [HttpPost("categories/{categoryId:guid}/bracket")]
    public async Task<IActionResult> GenerateBracket(Guid categoryId)
    {
        await LoadOwnedCategoryAsync(categoryId);
        await tournaments.GenerateBracketAsync(categoryId);
        return NoContent();
    }

    [HttpGet("categories/{categoryId:guid}/matches")]
    public async Task<ActionResult<IEnumerable<MatchDto>>> Matches(Guid categoryId)
    {
        await LoadOwnedCategoryAsync(categoryId);
        var matches = await db.Matches
            .Include(m => m.Fighter1).ThenInclude(f => f!.Profile)
            .Include(m => m.Fighter2).ThenInclude(f => f!.Profile)
            .Where(m => m.CategoryId == categoryId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        return Ok(matches.Select(m => new MatchDto(
            m.Id, m.CategoryId, m.RoundName,
            m.Fighter1Id, m.Fighter1?.Profile.FullName,
            m.Fighter2Id, m.Fighter2?.Profile.FullName,
            m.WinnerId, m.Score, m.VictoryType, m.Status)));
    }

    [HttpPost("matches/{matchId:guid}/result")]
    public async Task<IActionResult> RecordResult(Guid matchId, RecordMatchResultRequest req)
    {
        // Valida propriedade via categoria->torneio->academia.
        var match = await db.Matches.FirstOrDefaultAsync(m => m.Id == matchId)
            ?? throw DomainException.NotFound("Luta não encontrada.");
        await LoadOwnedCategoryAsync(match.CategoryId);

        await tournaments.RecordResultAsync(matchId, req.WinnerId, req.Score, req.VictoryType);
        return NoContent();
    }

    // ── Helpers de escopo (campeonato pertence à academia do professor) ──

    private async Task<Tournament> LoadOwnedTournamentAsync(Guid tournamentId)
    {
        var academyId = User.GetAcademyId()
            ?? throw DomainException.Forbidden("Contexto de academia ausente no token.");
        var t = await db.Tournaments.FirstOrDefaultAsync(t => t.Id == tournamentId)
            ?? throw DomainException.NotFound("Campeonato não encontrado.");
        if (t.AcademyId != academyId)
            throw DomainException.Forbidden("Campeonato não pertence à sua academia.");
        return t;
    }

    private async Task<(TournamentCategory category, Guid academyId)> LoadOwnedCategoryAsync(Guid categoryId)
    {
        var category = await db.TournamentCategories
            .Include(c => c.Tournament)
            .FirstOrDefaultAsync(c => c.Id == categoryId)
            ?? throw DomainException.NotFound("Categoria não encontrada.");
        var academyId = User.GetAcademyId()
            ?? throw DomainException.Forbidden("Contexto de academia ausente no token.");
        if (category.Tournament.AcademyId != academyId)
            throw DomainException.Forbidden("Categoria não pertence à sua academia.");
        return (category, academyId);
    }
}
