using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Forja.Api.Domain;
using Microsoft.IdentityModel.Tokens;

namespace Forja.Api.Auth;

public class JwtOptions
{
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string Key { get; set; } = null!;
    public int ExpiryHours { get; set; } = 12;
}

/// <summary>Claims customizados usados pela aplicação.</summary>
public static class ForjaClaims
{
    public const string AcademyId = "academy_id";
    public const string TeamIds = "team_ids";
}

public interface ITokenService
{
    string CreateToken(Profile profile, Guid? academyId, IEnumerable<Guid> teamIds);
}

public class TokenService(Microsoft.Extensions.Options.IOptions<JwtOptions> options) : ITokenService
{
    private readonly JwtOptions _opt = options.Value;

    public string CreateToken(Profile profile, Guid? academyId, IEnumerable<Guid> teamIds)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, profile.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, profile.Email),
            new(ClaimTypes.Name, profile.FullName),
            new(ClaimTypes.Role, profile.Role.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        if (academyId is not null)
            claims.Add(new Claim(ForjaClaims.AcademyId, academyId.ToString()!));

        var teamIdList = teamIds.ToList();
        if (teamIdList.Count > 0)
            claims.Add(new Claim(ForjaClaims.TeamIds, string.Join(',', teamIdList)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_opt.Key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _opt.Issuer,
            audience: _opt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_opt.ExpiryHours),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
