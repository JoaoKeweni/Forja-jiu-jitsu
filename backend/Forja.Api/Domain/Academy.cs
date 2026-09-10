namespace Forja.Api.Domain;

/// <summary>Academia — hub multi-tenant, identificada por slug único na URL.</summary>
public class Academy
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;

    /// <summary>Slug único usado na URL (ex.: "gracie-barra-matriz").</summary>
    public string Slug { get; set; } = null!;

    public string? Address { get; set; }
    public string? Phone { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegação
    public ICollection<Team> Teams { get; set; } = new List<Team>();
    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
}
