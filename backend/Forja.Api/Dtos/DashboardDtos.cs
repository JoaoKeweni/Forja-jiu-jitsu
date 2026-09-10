namespace Forja.Api.Dtos;

/// <summary>KPIs do dashboard do professor (ADM-01), no escopo das suas equipes.</summary>
public record ProfessorDashboardDto(
    int ActiveStudents,
    int PendingApprovals,
    int OverduePayments,
    double AdimplenciaPercent,
    int UpcomingTournaments);
