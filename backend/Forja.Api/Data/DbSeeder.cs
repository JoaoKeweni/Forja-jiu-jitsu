using Forja.Api.Domain;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Data;

/// <summary>
/// Semente de dados demo. Idempotente: só insere se o banco estiver vazio.
/// Corrige as inconsistências do seed SQL original (UUIDs inválidos com 't'/'u',
/// IDs de teams duplicados, role 'superadmin' vs enum correto).
/// </summary>
public static class DbSeeder
{
    // UUIDs determinísticos e VÁLIDOS (apenas dígitos hex).
    private static readonly Guid AcademyGb = new("a0000000-0000-0000-0000-000000000001");
    private static readonly Guid AcademyAlliance = new("a0000000-0000-0000-0000-000000000002");

    private static readonly Guid TeamNoite = new("b0000000-0000-0000-0000-000000000001");
    private static readonly Guid TeamManha = new("b0000000-0000-0000-0000-000000000002"); // corrige ID duplicado
    private static readonly Guid TeamComp = new("b0000000-0000-0000-0000-000000000003");

    private static readonly Guid UserSuperAdmin = new("c0000000-0000-0000-0000-000000000001");
    private static readonly Guid UserProfessor = new("c0000000-0000-0000-0000-000000000002");
    private static readonly Guid UserAluno = new("c0000000-0000-0000-0000-000000000003");

    public static async Task SeedAsync(ForjaDbContext db)
    {
        if (await db.Academies.AnyAsync()) return; // já populado

        var now = DateTime.UtcNow;

        var academies = new[]
        {
            new Academy { Id = AcademyGb, Name = "Gracie Barra Matriz", Slug = "gracie-barra-matriz",
                Address = "Av. Paulista, 1000 - São Paulo, SP", Phone = "(11) 99999-1000", CreatedAt = now },
            new Academy { Id = AcademyAlliance, Name = "Alliance São Paulo", Slug = "alliance-sp",
                Address = "Rua Oscar Freire, 500 - São Paulo, SP", Phone = "(11) 99999-2000", CreatedAt = now },
        };

        var teams = new[]
        {
            new Team { Id = TeamNoite, AcademyId = AcademyGb, Name = "Equipe Adulto Noite", Schedule = "Seg/Qua/Sex 19:00", CreatedAt = now },
            new Team { Id = TeamManha, AcademyId = AcademyGb, Name = "Equipe Manhã", Schedule = "Ter/Qui 08:00", CreatedAt = now },
            new Team { Id = TeamComp, AcademyId = AcademyAlliance, Name = "Equipe Competição", Schedule = "Sábado 10:00", CreatedAt = now },
        };

        // Senha demo para todos: "forja123" (apenas ambiente de desenvolvimento).
        var demoHash = BCrypt.Net.BCrypt.HashPassword("forja123");

        var profiles = new[]
        {
            new Profile { Id = UserSuperAdmin, Email = "superadmin@forja.com", PasswordHash = demoHash,
                Role = UserRole.SuperAdmin, FullName = "Super Admin Forja", Phone = "(11) 90000-0000", CreatedAt = now },
            new Profile { Id = UserProfessor, Email = "professor@forja.com", PasswordHash = demoHash,
                Role = UserRole.Professor, FullName = "Prof. Marcus Vinicius", Phone = "(11) 98888-1111", CreatedAt = now },
            new Profile { Id = UserAluno, Email = "aluno@forja.com", PasswordHash = demoHash,
                Role = UserRole.Student, FullName = "Lucas Almeida Silva", Phone = "(11) 97777-2222", CreatedAt = now },
        };

        var student = new Student
        {
            Id = UserAluno, AcademyId = AcademyGb, TeamId = TeamNoite,
            Belt = BeltType.Azul, Degrees = 2, DueDay = 10, Status = StudentStatus.Active, CreatedAt = now
        };

        // Professor Marcus vinculado às duas equipes da Gracie Barra.
        var professorTeams = new[]
        {
            new ProfessorTeam { ProfessorId = UserProfessor, TeamId = TeamNoite },
            new ProfessorTeam { ProfessorId = UserProfessor, TeamId = TeamManha },
        };

        db.Academies.AddRange(academies);
        db.Teams.AddRange(teams);
        db.Profiles.AddRange(profiles);
        db.Students.Add(student);
        db.ProfessorTeams.AddRange(professorTeams);

        // Algumas mensalidades demo para o aluno ativo.
        var year = now.Year;
        var payments = new List<Payment>();
        for (var month = 1; month <= now.Month; month++)
        {
            payments.Add(new Payment
            {
                Id = Guid.NewGuid(),
                StudentId = UserAluno,
                Month = month,
                Year = year,
                Amount = 150.00m,
                DueDate = new DateOnly(year, month, 10),
                Status = month < now.Month ? PaymentStatus.Paid : PaymentStatus.Pending,
                PaidAt = month < now.Month ? now.AddMonths(month - now.Month) : null,
                Method = month < now.Month ? PaymentMethod.Pix : null,
                CreatedAt = now
            });
        }
        db.Payments.AddRange(payments);

        await db.SaveChangesAsync();
    }
}
