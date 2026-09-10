using Forja.Api.Domain;

namespace Forja.Api.Dtos;

// ── Academias ──
public record AcademyDto(Guid Id, string Name, string Slug, string? Address, string? Phone, int TeamCount, int StudentCount);
public record CreateAcademyRequest(string Name, string Slug, string? Address, string? Phone);
public record UpdateAcademyRequest(string Name, string? Address, string? Phone);

/// <summary>Dados públicos da academia (para a tela de login/cadastro por slug).</summary>
public record PublicAcademyDto(Guid Id, string Name, string Slug, IEnumerable<TeamDto> Teams);

// ── Equipes ──
public record TeamDto(Guid Id, Guid AcademyId, string Name, string? Schedule, int StudentCount);
public record CreateTeamRequest(string Name, string? Schedule);
public record UpdateTeamRequest(string Name, string? Schedule);

// ── Professores (Super Admin) ──
public record ProfessorDto(Guid Id, string FullName, string Email, string? Phone, IEnumerable<Guid> TeamIds);
public record CreateProfessorRequest(string FullName, string Email, string? Phone, string Password, IEnumerable<Guid> TeamIds);
public record UpdateProfessorTeamsRequest(IEnumerable<Guid> TeamIds);
