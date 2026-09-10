using Forja.Api.Domain;

namespace Forja.Api.Dtos;

// ── Alunos ──
public record StudentDto(
    Guid Id,
    string FullName,
    string Email,
    string? Phone,
    string? AvatarUrl,
    Guid AcademyId,
    Guid TeamId,
    string TeamName,
    BeltType Belt,
    int Degrees,
    int DueDay,
    StudentStatus Status);

/// <summary>Aprovação de aluno pendente (ADM-08, RN-01): define faixa, graus e vencimento.</summary>
public record ApproveStudentRequest(BeltType Belt, int Degrees, int DueDay);

/// <summary>Edição de dados do aluno pelo professor (ADM-03).</summary>
public record UpdateStudentRequest(BeltType Belt, int Degrees, int DueDay, Guid TeamId);

// ── Financeiro ──
public record PaymentDto(
    Guid Id,
    Guid StudentId,
    int Month,
    int Year,
    decimal Amount,
    DateOnly DueDate,
    DateTime? PaidAt,
    PaymentMethod? Method,
    PaymentStatus Status,
    string? Notes);

/// <summary>Linha da planilha financeira: aluno + pagamentos do ano (ADM-04).</summary>
public record FinanceRowDto(
    Guid StudentId,
    string FullName,
    string? Phone,
    int DueDay,
    IEnumerable<PaymentDto> Payments);

/// <summary>Baixa manual de pagamento (RN-04).</summary>
public record SettlePaymentRequest(PaymentMethod Method, decimal? Amount, string? Notes);

public record UpdatePaymentStatusRequest(PaymentStatus Status);

// ── Campeonatos ──
public record TournamentDto(
    Guid Id, Guid AcademyId, string Title, DateOnly EventDate, TimeOnly? StartTime,
    string? Location, string? Rules, TournamentStatus Status, int CategoryCount);

public record CreateTournamentRequest(string Title, DateOnly EventDate, TimeOnly? StartTime, string? Location, string? Rules);
public record UpdateTournamentRequest(string Title, DateOnly EventDate, TimeOnly? StartTime, string? Location, string? Rules, TournamentStatus Status);

public record CategoryDto(
    Guid Id, Guid TournamentId, string Title, BeltType Belt, string AgeGroup,
    string Gender, decimal? MaxWeight, int EnrollmentCount);
public record CreateCategoryRequest(string Title, BeltType Belt, string AgeGroup, string Gender, decimal? MaxWeight);

public record EnrollStudentRequest(Guid StudentId);

public record MatchDto(
    Guid Id, Guid CategoryId, string RoundName,
    Guid? Fighter1Id, string? Fighter1Name,
    Guid? Fighter2Id, string? Fighter2Name,
    Guid? WinnerId, string? Score, string? VictoryType, MatchStatus Status);

/// <summary>Registro de resultado da luta (súmula — ADM-07).</summary>
public record RecordMatchResultRequest(Guid WinnerId, string? Score, string? VictoryType);
