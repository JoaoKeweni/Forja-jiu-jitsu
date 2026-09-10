namespace Forja.Api.Domain;

/// <summary>Campeonato interno da academia (exclusivo para alunos matriculados — RN-05).</summary>
public class Tournament
{
    public Guid Id { get; set; }
    public Guid AcademyId { get; set; }
    public string Title { get; set; } = null!;
    public DateOnly EventDate { get; set; }
    public TimeOnly? StartTime { get; set; }
    public string? Location { get; set; }
    public string? Rules { get; set; }
    public TournamentStatus Status { get; set; } = TournamentStatus.Draft;
    public DateTime CreatedAt { get; set; }

    // Navegação
    public Academy Academy { get; set; } = null!;
    public ICollection<TournamentCategory> Categories { get; set; } = new List<TournamentCategory>();
}
