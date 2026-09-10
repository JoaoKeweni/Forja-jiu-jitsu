using Forja.Api.Auth;
using Forja.Api.Data;
using Forja.Api.Domain;
using Forja.Api.Dtos;
using Microsoft.EntityFrameworkCore;

namespace Forja.Api.Services;

public interface IAuthService
{
    Task<AuthResponse> RegisterStudentAsync(string academySlug, StudentRegisterRequest req);
    Task<AuthResponse> LoginAsync(string academySlug, LoginRequest req);
    Task<AuthResponse> LoginSuperAdminAsync(SuperAdminLoginRequest req);
    Task<MeResponse> GetMeAsync(Guid userId);
}

public class AuthService(ForjaDbContext db, ITokenService tokens) : IAuthService
{
    /// <summary>
    /// Cadastro simplificado de aluno pelo link exclusivo da academia (RN-06).
    /// A academia é resolvida pelo slug; o aluno nasce com status Pending (RN-01).
    /// </summary>
    public async Task<AuthResponse> RegisterStudentAsync(string academySlug, StudentRegisterRequest req)
    {
        var academy = await db.Academies.FirstOrDefaultAsync(a => a.Slug == academySlug)
            ?? throw DomainException.NotFound("Academia não encontrada.");

        // A equipe escolhida deve pertencer à academia do slug.
        var team = await db.Teams.FirstOrDefaultAsync(t => t.Id == req.TeamId && t.AcademyId == academy.Id)
            ?? throw DomainException.NotFound("Equipe não encontrada nesta academia.");

        var emailExists = await db.Profiles.AnyAsync(p => p.Email == req.Email);
        if (emailExists)
            throw DomainException.Conflict("Já existe uma conta com este e-mail.");

        var profile = new Profile
        {
            Id = Guid.NewGuid(),
            Email = req.Email.Trim().ToLowerInvariant(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            Role = UserRole.Student,
            FullName = req.FullName.Trim(),
            Phone = req.Phone,
            AvatarUrl = req.AvatarUrl
        };

        var student = new Student
        {
            Id = profile.Id,
            AcademyId = academy.Id,
            TeamId = team.Id,
            Belt = BeltType.Branca,
            Degrees = 0,
            DueDay = 10,
            Status = StudentStatus.Pending
        };

        db.Profiles.Add(profile);
        db.Students.Add(student);
        await db.SaveChangesAsync();

        var token = tokens.CreateToken(profile, academy.Id, []);
        return new AuthResponse(token, profile.Id, profile.Email, profile.FullName,
            profile.Role, academy.Id, student.Status);
    }

    /// <summary>Login de aluno ou professor no contexto da academia (AUTH-01).</summary>
    public async Task<AuthResponse> LoginAsync(string academySlug, LoginRequest req)
    {
        var academy = await db.Academies.FirstOrDefaultAsync(a => a.Slug == academySlug)
            ?? throw DomainException.NotFound("Academia não encontrada.");

        var email = req.Email.Trim().ToLowerInvariant();
        var profile = await db.Profiles
            .Include(p => p.Student)
            .Include(p => p.ProfessorTeams)
            .FirstOrDefaultAsync(p => p.Email == email);

        if (profile is null || !BCrypt.Net.BCrypt.Verify(req.Password, profile.PasswordHash))
            throw DomainException.Unauthorized("E-mail ou senha inválidos.");

        // Só alunos e professores logam por esta rota (Super Admin tem portal separado).
        if (profile.Role == UserRole.SuperAdmin)
            throw DomainException.Forbidden("Super Admin deve acessar pelo portal administrativo.");

        // O usuário precisa pertencer à academia do slug.
        Guid? academyId = null;
        IEnumerable<Guid> teamIds = [];

        if (profile.Role == UserRole.Student)
        {
            if (profile.Student is null || profile.Student.AcademyId != academy.Id)
                throw DomainException.Forbidden("Usuário não pertence a esta academia.");
            academyId = academy.Id;
        }
        else if (profile.Role == UserRole.Professor)
        {
            // Professor: equipes vinculadas que pertencem a esta academia.
            var proTeamIds = await db.ProfessorTeams
                .Where(pt => pt.ProfessorId == profile.Id)
                .Join(db.Teams.Where(t => t.AcademyId == academy.Id),
                    pt => pt.TeamId, t => t.Id, (pt, t) => t.Id)
                .ToListAsync();

            if (proTeamIds.Count == 0)
                throw DomainException.Forbidden("Professor não possui vínculo com esta academia.");

            academyId = academy.Id;
            teamIds = proTeamIds;
        }

        var token = tokens.CreateToken(profile, academyId, teamIds);
        return new AuthResponse(token, profile.Id, profile.Email, profile.FullName,
            profile.Role, academyId, profile.Student?.Status);
    }

    /// <summary>Login do Super Admin no portal SaaS (sem contexto de academia).</summary>
    public async Task<AuthResponse> LoginSuperAdminAsync(SuperAdminLoginRequest req)
    {
        var email = req.Email.Trim().ToLowerInvariant();
        var profile = await db.Profiles.FirstOrDefaultAsync(p => p.Email == email);

        if (profile is null || !BCrypt.Net.BCrypt.Verify(req.Password, profile.PasswordHash))
            throw DomainException.Unauthorized("E-mail ou senha inválidos.");

        if (profile.Role != UserRole.SuperAdmin)
            throw DomainException.Forbidden("Acesso restrito ao Super Admin.");

        var token = tokens.CreateToken(profile, null, []);
        return new AuthResponse(token, profile.Id, profile.Email, profile.FullName,
            profile.Role, null, null);
    }

    public async Task<MeResponse> GetMeAsync(Guid userId)
    {
        var profile = await db.Profiles
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.Id == userId)
            ?? throw DomainException.NotFound("Usuário não encontrado.");

        Guid? academyId = profile.Student?.AcademyId;
        var teamIds = new List<Guid>();

        if (profile.Role == UserRole.Professor)
        {
            teamIds = await db.ProfessorTeams
                .Where(pt => pt.ProfessorId == userId)
                .Select(pt => pt.TeamId)
                .ToListAsync();
        }
        else if (profile.Student is not null)
        {
            teamIds.Add(profile.Student.TeamId);
        }

        return new MeResponse(profile.Id, profile.Email, profile.FullName, profile.Role,
            profile.AvatarUrl, academyId, teamIds, profile.Student?.Status);
    }
}
