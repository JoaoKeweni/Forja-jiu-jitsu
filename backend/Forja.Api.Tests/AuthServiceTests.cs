using FluentAssertions;
using Forja.Api.Auth;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Xunit;

namespace Forja.Api.Tests;

/// <summary>Token service falso para isolar os testes do AuthService.</summary>
internal class FakeTokenService : ITokenService
{
    public string CreateToken(Profile profile, Guid? academyId, IEnumerable<Guid> teamIds) => "fake-token";
}

public class AuthServiceTests
{
    private static AuthService CreateService(Data.ForjaDbContext db) => new(db, new FakeTokenService());

    [Fact]
    public async Task RegisterStudent_creates_pending_student()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = CreateService(db);

        var req = new StudentRegisterRequest("Lucas", "lucas@x.com", "11999", "senha123", TestDb.TeamId, null);
        var result = await service.RegisterStudentAsync("gb", req);

        result.Role.Should().Be(UserRole.Student);
        result.StudentStatus.Should().Be(StudentStatus.Pending);
        result.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task RegisterStudent_duplicate_email_throws_conflict()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = CreateService(db);
        var req = new StudentRegisterRequest("A", "dup@x.com", "1", "senha123", TestDb.TeamId, null);
        await service.RegisterStudentAsync("gb", req);

        var act = () => service.RegisterStudentAsync("gb", req with { FullName = "B" });

        var ex = await Assert.ThrowsAsync<DomainException>(act);
        ex.StatusCode.Should().Be(409);
    }

    [Fact]
    public async Task RegisterStudent_unknown_academy_throws_not_found()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = CreateService(db);
        var req = new StudentRegisterRequest("A", "a@x.com", "1", "senha123", TestDb.TeamId, null);

        var ex = await Assert.ThrowsAsync<DomainException>(() => service.RegisterStudentAsync("inexistente", req));
        ex.StatusCode.Should().Be(404);
    }

    [Fact]
    public async Task Login_with_wrong_password_throws_unauthorized()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = CreateService(db);
        await service.RegisterStudentAsync("gb",
            new StudentRegisterRequest("Lucas", "lucas@x.com", "1", "senha123", TestDb.TeamId, null));

        var ex = await Assert.ThrowsAsync<DomainException>(
            () => service.LoginAsync("gb", new LoginRequest("lucas@x.com", "errada")));
        ex.StatusCode.Should().Be(401);
    }

    [Fact]
    public async Task Login_student_succeeds_after_register()
    {
        using var db = TestDb.Create();
        TestDb.SeedAcademyTeamProfessor(db);
        var service = CreateService(db);
        await service.RegisterStudentAsync("gb",
            new StudentRegisterRequest("Lucas", "lucas@x.com", "1", "senha123", TestDb.TeamId, null));

        var result = await service.LoginAsync("gb", new LoginRequest("lucas@x.com", "senha123"));

        result.AcademyId.Should().Be(TestDb.AcademyId);
        result.Role.Should().Be(UserRole.Student);
    }
}
