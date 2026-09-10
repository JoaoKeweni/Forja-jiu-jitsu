namespace Forja.Api.Domain;

/// <summary>Luta do chaveamento mata-mata (súmula).</summary>
public class Match
{
    public Guid Id { get; set; }
    public Guid CategoryId { get; set; }

    /// <summary>Fase (ex.: "Oitavas", "Quartas", "Semifinal", "Final").</summary>
    public string RoundName { get; set; } = null!;

    public Guid? Fighter1Id { get; set; }
    public Guid? Fighter2Id { get; set; }
    public Guid? WinnerId { get; set; }

    /// <summary>Placar (ex.: "4 x 2 (Pontos)").</summary>
    public string? Score { get; set; }

    /// <summary>Tipo de vitória (ex.: "Armlock", "Pontos", "Desclassificação").</summary>
    public string? VictoryType { get; set; }

    public MatchStatus Status { get; set; } = MatchStatus.Scheduled;
    public DateTime CreatedAt { get; set; }

    // Navegação
    public TournamentCategory Category { get; set; } = null!;
    public Student? Fighter1 { get; set; }
    public Student? Fighter2 { get; set; }
    public Student? Winner { get; set; }
}
