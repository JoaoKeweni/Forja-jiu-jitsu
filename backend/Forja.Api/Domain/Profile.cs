namespace Forja.Api.Domain;

/// <summary>
/// Perfil de usuário (super admin, professor ou aluno).
/// Substitui o Supabase auth.users: agora guardamos o hash da senha localmente.
/// </summary>
public class Profile
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;

    /// <summary>Hash BCrypt da senha.</summary>
    public string PasswordHash { get; set; } = null!;

    public UserRole Role { get; set; } = UserRole.Student;
    public string FullName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; }

    // Navegação
    public Student? Student { get; set; }
    public ICollection<ProfessorTeam> ProfessorTeams { get; set; } = new List<ProfessorTeam>();
}
