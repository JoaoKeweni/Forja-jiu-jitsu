using Forja.Api.Data;
using Forja.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Services;

public interface ITournamentService
{
    Task GenerateBracketAsync(Guid categoryId);
    Task RecordResultAsync(Guid matchId, Guid winnerId, string? score, string? victoryType);
}

/// <summary>
/// Lógica de chaveamento mata-mata simples (single-elimination) para campeonatos internos.
/// Gera as lutas da primeira fase a partir dos alunos inscritos e, ao registrar
/// resultados, avança o vencedor para a próxima fase.
/// </summary>
public class TournamentService(ForjaDbContext db) : ITournamentService
{
    public async Task GenerateBracketAsync(Guid categoryId)
    {
        var category = await db.TournamentCategories
            .Include(c => c.Enrollments)
            .Include(c => c.Matches)
            .FirstOrDefaultAsync(c => c.Id == categoryId)
            ?? throw DomainException.NotFound("Categoria não encontrada.");

        if (category.Matches.Count > 0)
            throw DomainException.Conflict("O chaveamento desta categoria já foi gerado.");

        var fighters = category.Enrollments.Select(e => e.StudentId).ToList();
        if (fighters.Count < 2)
            throw new DomainException("São necessários ao menos 2 alunos inscritos para gerar o chaveamento.");

        // Embaralha os inscritos.
        var rng = new Random();
        fighters = [.. fighters.OrderBy(_ => rng.Next())];

        // Número de vagas = próxima potência de 2 (byes ficam sem fighter2).
        var slots = 1;
        while (slots < fighters.Count) slots *= 2;

        var firstRoundName = RoundNameForSlots(slots);
        var matches = new List<Match>();
        for (var i = 0; i < slots / 2; i++)
        {
            var f1Index = i * 2;
            var f2Index = i * 2 + 1;
            matches.Add(new Match
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                RoundName = firstRoundName,
                Fighter1Id = f1Index < fighters.Count ? fighters[f1Index] : null,
                Fighter2Id = f2Index < fighters.Count ? fighters[f2Index] : null,
                Status = MatchStatus.Scheduled
            });
        }

        db.Matches.AddRange(matches);
        await db.SaveChangesAsync();
    }

    public async Task RecordResultAsync(Guid matchId, Guid winnerId, string? score, string? victoryType)
    {
        var match = await db.Matches.FirstOrDefaultAsync(m => m.Id == matchId)
            ?? throw DomainException.NotFound("Luta não encontrada.");

        if (winnerId != match.Fighter1Id && winnerId != match.Fighter2Id)
            throw new DomainException("O vencedor deve ser um dos lutadores da luta.");

        match.WinnerId = winnerId;
        match.Score = score;
        match.VictoryType = victoryType;
        match.Status = MatchStatus.Finished;

        await db.SaveChangesAsync();
        await AdvanceWinnersIfRoundCompleteAsync(match.CategoryId, match.RoundName);
    }

    /// <summary>Quando todas as lutas de uma fase terminam, cria a próxima fase com os vencedores.</summary>
    private async Task AdvanceWinnersIfRoundCompleteAsync(Guid categoryId, string roundName)
    {
        var roundMatches = await db.Matches
            .Where(m => m.CategoryId == categoryId && m.RoundName == roundName)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();

        if (roundMatches.Any(m => m.Status != MatchStatus.Finished)) return;

        var winners = roundMatches
            .Select(m => m.WinnerId ?? m.Fighter1Id ?? m.Fighter2Id)
            .Where(id => id is not null)
            .Select(id => id!.Value)
            .ToList();

        if (winners.Count <= 1) return; // campeão definido

        // Evita duplicar a próxima fase se já existir.
        var nextRoundName = RoundNameForSlots(winners.Count);
        var nextExists = await db.Matches.AnyAsync(m => m.CategoryId == categoryId && m.RoundName == nextRoundName);
        if (nextExists) return;

        var next = new List<Match>();
        for (var i = 0; i < winners.Count; i += 2)
        {
            next.Add(new Match
            {
                Id = Guid.NewGuid(),
                CategoryId = categoryId,
                RoundName = nextRoundName,
                Fighter1Id = winners[i],
                Fighter2Id = i + 1 < winners.Count ? winners[i + 1] : null,
                Status = MatchStatus.Scheduled
            });
        }
        db.Matches.AddRange(next);
        await db.SaveChangesAsync();
    }

    private static string RoundNameForSlots(int slots) => slots switch
    {
        >= 16 => "Oitavas",
        8 => "Quartas",
        4 => "Semifinal",
        2 => "Final",
        _ => "Fase"
    };
}
