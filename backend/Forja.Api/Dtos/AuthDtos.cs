using Forja.Api.Domain;

namespace Forja.Api.Dtos;

/// <summary>Cadastro simplificado de aluno via slug da academia (AUTH-02).</summary>
public record StudentRegisterRequest(
    string FullName,
    string Email,
    string Phone,
    string Password,
    Guid TeamId,
    string? AvatarUrl);

/// <summary>Login de aluno/professor no contexto de uma academia (AUTH-01).</summary>
public record LoginRequest(string Email, string Password);

/// <summary>Login do Super Admin (portal SaaS separado).</summary>
public record SuperAdminLoginRequest(string Email, string Password);

/// <summary>Resposta de autenticação com o token e dados do usuário.</summary>
public record AuthResponse(
    string Token,
    Guid UserId,
    string Email,
    string FullName,
    UserRole Role,
    Guid? AcademyId,
    StudentStatus? StudentStatus);

/// <summary>Dados do usuário autenticado (GET /auth/me).</summary>
public record MeResponse(
    Guid UserId,
    string Email,
    string FullName,
    UserRole Role,
    string? AvatarUrl,
    Guid? AcademyId,
    IEnumerable<Guid> TeamIds,
    StudentStatus? StudentStatus);
