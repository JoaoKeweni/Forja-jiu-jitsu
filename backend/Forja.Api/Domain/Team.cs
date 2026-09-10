namespace Forja.Api.Domain;

/// <summary>Equipe/Turma dentro de uma academia (ex.: "Equipe Adulto Noite").</summary>
public class Team
{
    public Guid Id { get; set; }
    public Guid AcademyId { get; set; }
    public string Name { get; set; } = null!;

    /// <summary>Horário/agenda (ex.: "Seg/Qua/Sex 19:00").</summary>
    public string? Schedule { get; set; }

    public DateTime CreatedAt { get; set; }

    // Navegação
    public Academy Academy { get; set; } = null!;
    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<ProfessorTeam> ProfessorTeams { get; set; } = new List<ProfessorTeam>();
}
