namespace Forja.Api.Domain;

/// <summary>Categoria de luta dentro de um campeonato (faixa/peso/idade/gênero).</summary>
public class TournamentCategory
{
    public Guid Id { get; set; }
    public Guid TournamentId { get; set; }
    public string Title { get; set; } = null!;
    public BeltType Belt { get; set; }
    public string AgeGroup { get; set; } = "Adulto";
    public string Gender { get; set; } = "Masculino";
    public decimal? MaxWeight { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegação
    public Tournament Tournament { get; set; } = null!;
    public ICollection<CategoryEnrollment> Enrollments { get; set; } = new List<CategoryEnrollment>();
    public ICollection<Match> Matches { get; set; } = new List<Match>();
}
