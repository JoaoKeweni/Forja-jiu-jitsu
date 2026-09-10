using FluentAssertions;
using Forja.Api.Services;
using Xunit;

namespace Forja.Api.Tests;

public class TeamScopeServiceTests
{
    [Fact]
    public async Task GetProfessorTeamIds_returns_linked_teams()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = new TeamScopeService(db);

        var teamIds = await service.GetProfessorTeamIdsAsync(TestDb.ProfessorId);

        teamIds.Should().ContainSingle().Which.Should().Be(TestDb.TeamId);
    }

    [Fact]
    public async Task EnsureProfessorOwnsTeam_allows_linked_team()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = new TeamScopeService(db);

        var act = () => service.EnsureProfessorOwnsTeamAsync(TestDb.ProfessorId, TestDb.TeamId);

        await act.Should().NotThrowAsync();
    }

    [Fact]
    public async Task EnsureProfessorOwnsTeam_forbids_unlinked_team()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = new TeamScopeService(db);

        var ex = await Assert.ThrowsAsync<DomainException>(
            () => service.EnsureProfessorOwnsTeamAsync(TestDb.ProfessorId, TestDb.OtherTeamId));
        ex.StatusCode.Should().Be(403);
    }

    [Fact]
    public async Task EnsureProfessorOwnsStudent_forbids_student_from_other_team()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var student = TestDb.AddActiveStudent(db, "Aluno");
        student.TeamId = TestDb.OtherTeamId; // move para equipe não vinculada
        db.SaveChanges();
        var service = new TeamScopeService(db);

        var ex = await Assert.ThrowsAsync<DomainException>(
            () => service.EnsureProfessorOwnsStudentAsync(TestDb.ProfessorId, student.Id));
        ex.StatusCode.Should().Be(403);
    }
}
