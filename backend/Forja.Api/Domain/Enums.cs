namespace Forja.Api.Domain;

/// <summary>Perfis de usuário do sistema.</summary>
public enum UserRole
{
    SuperAdmin,
    Professor,
    Student
}

/// <summary>Status de aprovação do aluno (RN-01).</summary>
public enum StudentStatus
{
    Pending,
    Active,
    Rejected
}

/// <summary>Faixas do Jiu-Jitsu (adulto e infantil).</summary>
public enum BeltType
{
    Branca,
    Cinza,
    Amarela,
    Laranja,
    Verde,
    Azul,
    Roxa,
    Marrom,
    Preta
}

/// <summary>Status de uma mensalidade.</summary>
public enum PaymentStatus
{
    Paid,
    Pending,
    Overdue,
    Exempt
}

/// <summary>Forma de pagamento (presencial, sem gateway).</summary>
public enum PaymentMethod
{
    Pix,
    Dinheiro,
    Cartao
}

/// <summary>Ciclo de vida de um campeonato interno.</summary>
public enum TournamentStatus
{
    Draft,
    Published,
    InProgress,
    Closed
}

/// <summary>Status de uma luta no chaveamento.</summary>
public enum MatchStatus
{
    Scheduled,
    Live,
    Finished
}
