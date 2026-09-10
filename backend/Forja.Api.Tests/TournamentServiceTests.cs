using FluentAssertions;
using Forja.Api.Domain;
using Forja.Api.Services;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Forja.Api.Tests;

public class TournamentServiceTests
{
    private static TournamentCategory SeedCategoryWithStudents(Data.ForjaDbContext db, int studentCount)
    {
        TestDb.SeedAcademyTeamProfessor(db);
        var tournament = new Tournament
        {
            Id = Guid.NewGuid(), AcademyId = TestDb.AcademyId, Title = "Torneio",
            EventDate = new DateOnly(2026, 1, 1)
        };
        var category = new TournamentCategory
        {
            Id = Guid.NewGuid(), TournamentId = tournament.Id, Title = "Azul Adulto", Belt = BeltType.Azul
        };
        db.Tournaments.Add(tournament);
        db.TournamentCategories.Add(category);
        for (var i = 0; i < studentCount; i++)
        {
            var s = TestDb.AddActiveStudent(db, $"Aluno {i}");
            db.CategoryEnrollments.Add(new CategoryEnrollment { CategoryId = category.Id, StudentId = s.Id });
        }
        db.SaveChanges();
        return category;
    }

    [Fact]
    public async Task GenerateBracket_with_fewer_than_2_throws()
    {
        using var db = TestDb.Create();
        var category = SeedCategoryWithStudents(db, 1);
        var service = new TournamentService(db);

        await Assert.ThrowsAsync<DomainException>(() => service.GenerateBracketAsync(category.Id));
    }

    [Fact]
    public async Task GenerateBracket_with_4_students_creates_2_semifinal_matches()
    {
        using var db = TestDb.Create();
        var category = SeedCategoryWithStudents(db, 4);
        var service = new TournamentService(db);

        await service.GenerateBracketAsync(category.Id);

        var matches = await db.Matches.Where(m => m.CategoryId == category.Id).ToListAsync();
        matches.Should().HaveCount(2);
        matches.Should().OnlyContain(m => m.RoundName == "Semifinal");
        matches.Should().OnlyContain(m => m.Fighter1Id != null && m.Fighter2Id != null);
    }

    [Fact]
    public async Task GenerateBracket_with_3_students_creates_byes()
    {
        using var db = TestDb.Create();
        var category = SeedCategoryWithStudents(db, 3);
        var service = new TournamentService(db);

        await service.GenerateBracketAsync(category.Id);

        var matches = await db.Matches.Where(m => m.CategoryId == category.Id).ToListAsync();
        // 3 alunos → 4 vagas → 2 lutas na semifinal, uma delas com bye (fighter2 null).
        matches.Should().HaveCount(2);
        matches.Count(m => m.Fighter2Id == null).Should().Be(1);
    }

    [Fact]
    public async Task GenerateBracket_twice_throws_conflict()
    {
        using var db = TestDb.Create();
        var category = SeedCategoryWithStudents(db, 4);
        var service = new TournamentService(db);
        await service.GenerateBracketAsync(category.Id);

        var ex = await Assert.ThrowsAsync<DomainException>(() => service.GenerateBracketAsync(category.Id));
        ex.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task RecordResult_advances_winner_to_final()
    {
        using var db = TestDb.Create();
        var category = SeedCategoryWithStudents(db, 4);
        var service = new TournamentService(db);
        await service.GenerateBracketAsync(category.Id);

        var semis = await db.Matches.Where(m => m.CategoryId == category.Id).ToListAsync();
        await service.RecordResultAsync(semis[0].Id, semis[0].Fighter1Id!.Value, "4x0", "Pontos");
        await service.RecordResultAsync(semis[1].Id, semis[1].Fighter1Id!.Value, "2x0", "Vantagem");

        var finals = await db.Matches.Where(m => m.CategoryId == category.Id && m.RoundName == "Final").ToListAsync();
        finals.Should().ContainSingle();
        var final = finals.Single();
        final.Fighter1Id.Should().Be(semis[0].Fighter1Id);
        final.Fighter2Id.Should().Be(semis[1].Fighter1Id);
    }

    [Fact]
    public async Task RecordResult_with_invalid_winner_throws()
    {
        using var db = TestDb.Create();
        var category = SeedCategoryWithStudents(db, 2);
        var service = new TournamentService(db);
        await service.GenerateBracketAsync(category.Id);
        var match = await db.Matches.FirstAsync(m => m.CategoryId == category.Id);

        await Assert.ThrowsAsync<DomainException>(
            () => service.RecordResultAsync(match.Id, Guid.NewGuid(), null, null));
    }
}
