namespace Forja.Api.Domain;

/// <summary>
/// Inscrição de um aluno matriculado em uma categoria de campeonato interno.
/// (Adiciona a tabela de junção que faltava no schema original — RN-05.)
/// </summary>
public class CategoryEnrollment
{
    public Guid CategoryId { get; set; }
    public Guid StudentId { get; set; }

    /// <summary>Confirmação de pesagem no tatame.</summary>
    public bool WeighedIn { get; set; }

    public DateTime EnrolledAt { get; set; }

    // Navegação
    public TournamentCategory Category { get; set; } = null!;
    public Student Student { get; set; } = null!;
}
