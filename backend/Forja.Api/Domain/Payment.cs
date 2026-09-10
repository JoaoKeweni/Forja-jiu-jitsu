namespace Forja.Api.Domain;

/// <summary>Mensalidade de um aluno (controle manual, sem gateway — RN-04).</summary>
public class Payment
{
    public Guid Id { get; set; }
    public Guid StudentId { get; set; }

    /// <summary>Mês de referência (1 a 12).</summary>
    public int Month { get; set; }

    /// <summary>Ano de referência.</summary>
    public int Year { get; set; }

    public decimal Amount { get; set; } = 150.00m;
    public DateOnly DueDate { get; set; }
    public DateTime? PaidAt { get; set; }
    public PaymentMethod? Method { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegação
    public Student Student { get; set; } = null!;
}
