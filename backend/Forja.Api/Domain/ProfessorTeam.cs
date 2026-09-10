namespace Forja.Api.Domain;

/// <summary>Vínculo N:N entre professores e equipes (RN-03).</summary>
public class ProfessorTeam
{
    public Guid ProfessorId { get; set; }
    public Guid TeamId { get; set; }

    // Navegação
    public Profile Professor { get; set; } = null!;
    public Team Team { get; set; } = null!;
}
