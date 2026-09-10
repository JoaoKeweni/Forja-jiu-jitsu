using Forja.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Services;

/// <summary>
/// Valida o escopo de equipes de um professor (RN-02, RN-03):
/// um professor só acessa alunos/dados das equipes onde tem vínculo.
/// </summary>
public interface ITeamScopeService
{
    Task<IReadOnlyList<Guid>> GetProfessorTeamIdsAsync(Guid professorId);
    Task EnsureProfessorOwnsTeamAsync(Guid professorId, Guid teamId);
    Task EnsureProfessorOwnsStudentAsync(Guid professorId, Guid studentId);
}

public class TeamScopeService(ForjaDbContext db) : ITeamScopeService
{
    public async Task<IReadOnlyList<Guid>> GetProfessorTeamIdsAsync(Guid professorId)
        => await db.ProfessorTeams
            .Where(pt => pt.ProfessorId == professorId)
            .Select(pt => pt.TeamId)
            .ToListAsync();

    public async Task EnsureProfessorOwnsTeamAsync(Guid professorId, Guid teamId)
    {
        var owns = await db.ProfessorTeams.AnyAsync(pt => pt.ProfessorId == professorId && pt.TeamId == teamId);
        if (!owns)
            throw DomainException.Forbidden("Você não tem vínculo com esta equipe.");
    }

    public async Task EnsureProfessorOwnsStudentAsync(Guid professorId, Guid studentId)
    {
        var student = await db.Students.FirstOrDefaultAsync(s => s.Id == studentId)
            ?? throw DomainException.NotFound("Aluno não encontrado.");
        await EnsureProfessorOwnsTeamAsync(professorId, student.TeamId);
    }
}
