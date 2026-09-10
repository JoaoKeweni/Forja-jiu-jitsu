using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Forja.Api.Auth;

/// <summary>Extensões para ler claims do usuário autenticado.</summary>
public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(JwtRegisteredClaimNames.Sub)
                  ?? user.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(sub, out var id)
            ? id
            : throw new InvalidOperationException("Claim de usuário ausente ou inválida.");
    }

    public static Guid? GetAcademyId(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ForjaClaims.AcademyId);
        return Guid.TryParse(value, out var id) ? id : null;
    }

    public static IReadOnlyList<Guid> GetTeamIds(this ClaimsPrincipal user)
    {
        var value = user.FindFirstValue(ForjaClaims.TeamIds);
        if (string.IsNullOrWhiteSpace(value)) return [];
        return value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(Guid.Parse)
            .ToList();
    }
}
