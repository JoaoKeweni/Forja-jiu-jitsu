namespace Forja.Api.Domain;

/// <summary>
/// Dados do aluno/atleta. Estende Profile via PK compartilhada (Id == Profile.Id).
/// </summary>
public class Student
{
    /// <summary>Mesmo Id do Profile associado (relação 1:1).</summary>
    public Guid Id { get; set; }

    public Guid AcademyId { get; set; }
    public Guid TeamId { get; set; }

    public BeltType Belt { get; set; } = BeltType.Branca;

    /// <summary>Graus na faixa (0 a 4).</summary>
    public int Degrees { get; set; }

    /// <summary>Dia fixo de vencimento da mensalidade (1 a 31).</summary>
    public int DueDay { get; set; } = 10;

    public StudentStatus Status { get; set; } = StudentStatus.Pending;
    public DateTime CreatedAt { get; set; }

    // Navegação
    public Profile Profile { get; set; } = null!;
    public Academy Academy { get; set; } = null!;
    public Team Team { get; set; } = null!;
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public ICollection<CategoryEnrollment> CategoryEnrollments { get; set; } = new List<CategoryEnrollment>();
}
