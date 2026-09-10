using Forja.Api.Data;
using Forja.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Tests;

/// <summary>Utilitários para criar um DbContext InMemory isolado por teste.</summary>
public static class TestDb
{
    public static ForjaDbContext Create()
    {
        var options = new DbContextOptionsBuilder<ForjaDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .EnableSensitiveDataLogging()
            .Options;
        return new ForjaDbContext(options);
    }

    public static readonly Guid AcademyId = new("a0000000-0000-0000-0000-000000000001");
    public static readonly Guid TeamId = new("b0000000-0000-0000-0000-000000000001");
    public static readonly Guid OtherTeamId = new("b0000000-0000-0000-0000-000000000002");
    public static readonly Guid ProfessorId = new("c0000000-0000-0000-0000-000000000002");

    /// <summary>Popula uma academia com uma equipe e um professor vinculado.</summary>
    public static void SeedAcademyTeamProfessor(ForjaDbContext db)
    {
        db.Academies.Add(new Academy { Id = AcademyId, Name = "GB", Slug = "gb" });
        db.Teams.Add(new Team { Id = TeamId, AcademyId = AcademyId, Name = "Noite" });
        db.Teams.Add(new Team { Id = OtherTeamId, AcademyId = AcademyId, Name = "Manhã" });
        db.Profiles.Add(new Profile
        {
            Id = ProfessorId, Email = "prof@forja.com", PasswordHash = "x",
            Role = UserRole.Professor, FullName = "Prof"
        });
        db.ProfessorTeams.Add(new ProfessorTeam { ProfessorId = ProfessorId, TeamId = TeamId });
        db.SaveChanges();
    }

    /// <summary>Cria um aluno ativo na academia/equipe de teste.</summary>
    public static Student AddActiveStudent(ForjaDbContext db, string name)
    {
        var id = Guid.NewGuid();
        db.Profiles.Add(new Profile
        {
            Id = id, Email = $"{id:N}@x.com", PasswordHash = "x",
            Role = UserRole.Student, FullName = name
        });
        var student = new Student
        {
            Id = id, AcademyId = AcademyId, TeamId = TeamId,
            Belt = BeltType.Azul, Status = StudentStatus.Active
        };
        db.Students.Add(student);
        db.SaveChanges();
        return student;
    }
}
