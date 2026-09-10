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
[Route("api/students")]
[Authorize(Roles = "Professor")]
public class StudentsController(ForjaDbContext db, ITeamScopeService scope) : ControllerBase
{
    /// <summary>
    /// Lista alunos das equipes do professor (RN-02/RN-03).
    /// Filtros opcionais: teamId (uma equipe), status.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentDto>>> List(
        [FromQuery] Guid? teamId, [FromQuery] StudentStatus? status)
    {
        var professorId = User.GetUserId();
        var teamIds = await scope.GetProfessorTeamIdsAsync(professorId);

        if (teamId is not null)
        {
            await scope.EnsureProfessorOwnsTeamAsync(professorId, teamId.Value);
            teamIds = [teamId.Value];
        }

        var query = db.Students
            .Include(s => s.Profile)
            .Include(s => s.Team)
            .Where(s => teamIds.Contains(s.TeamId));

        if (status is not null)
            query = query.Where(s => s.Status == status);

        var students = await query
            .OrderBy(s => s.Profile.FullName)
            .Select(s => ToDto(s))
            .ToListAsync();

        return Ok(students);
    }

    /// <summary>Fila de aprovação: alunos pendentes das equipes do professor (ADM-08, RN-01).</summary>
    [HttpGet("pending")]
    public async Task<ActionResult<IEnumerable<StudentDto>>> Pending()
    {
        var teamIds = await scope.GetProfessorTeamIdsAsync(User.GetUserId());
        var students = await db.Students
            .Include(s => s.Profile).Include(s => s.Team)
            .Where(s => teamIds.Contains(s.TeamId) && s.Status == StudentStatus.Pending)
            .OrderBy(s => s.CreatedAt)
            .Select(s => ToDto(s))
            .ToListAsync();
        return Ok(students);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentDto>> Get(Guid id)
    {
        await scope.EnsureProfessorOwnsStudentAsync(User.GetUserId(), id);
        var student = await db.Students.Include(s => s.Profile).Include(s => s.Team)
            .FirstAsync(s => s.Id == id);
        return Ok(ToDto(student));
    }

    /// <summary>Aprova um aluno pendente definindo faixa, graus e vencimento (RN-01).</summary>
    [HttpPost("{id:guid}/approve")]
    public async Task<IActionResult> Approve(Guid id, ApproveStudentRequest req)
    {
        await scope.EnsureProfessorOwnsStudentAsync(User.GetUserId(), id);
        ValidateGraduation(req.Belt, req.Degrees, req.DueDay);

        var student = await db.Students.FirstAsync(s => s.Id == id);
        if (student.Status == StudentStatus.Active)
            throw DomainException.Conflict("Aluno já está ativo.");

        student.Status = StudentStatus.Active;
        student.Belt = req.Belt;
        student.Degrees = req.Degrees;
        student.DueDay = req.DueDay;
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Recusa a solicitação de um aluno (ADM-08).</summary>
    [HttpPost("{id:guid}/reject")]
    public async Task<IActionResult> Reject(Guid id)
    {
        await scope.EnsureProfessorOwnsStudentAsync(User.GetUserId(), id);
        var student = await db.Students.FirstAsync(s => s.Id == id);
        student.Status = StudentStatus.Rejected;
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>Edita graduação/equipe do aluno (ADM-03).</summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateStudentRequest req)
    {
        var professorId = User.GetUserId();
        await scope.EnsureProfessorOwnsStudentAsync(professorId, id);
        // Se mudar de equipe, a nova também deve ser do professor.
        await scope.EnsureProfessorOwnsTeamAsync(professorId, req.TeamId);
        ValidateGraduation(req.Belt, req.Degrees, req.DueDay);

        var student = await db.Students.FirstAsync(s => s.Id == id);
        student.Belt = req.Belt;
        student.Degrees = req.Degrees;
        student.DueDay = req.DueDay;
        student.TeamId = req.TeamId;
        await db.SaveChangesAsync();
        return NoContent();
    }

    private static void ValidateGraduation(BeltType belt, int degrees, int dueDay)
    {
        if (degrees is < 0 or > 4)
            throw new DomainException("Graus devem estar entre 0 e 4.");
        if (dueDay is < 1 or > 31)
            throw new DomainException("Dia de vencimento deve estar entre 1 e 31.");
    }

    private static StudentDto ToDto(Student s) => new(
        s.Id, s.Profile.FullName, s.Profile.Email, s.Profile.Phone, s.Profile.AvatarUrl,
        s.AcademyId, s.TeamId, s.Team.Name, s.Belt, s.Degrees, s.DueDay, s.Status);
}
