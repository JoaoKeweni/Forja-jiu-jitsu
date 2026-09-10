using Forja.Api.Auth;
using Forja.Api.Dtos;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Forja.Api.Controllers;

[ApiController]
[Route("api")]
public class AuthController(IAuthService auth) : ControllerBase
{
    /// <summary>Cadastro de aluno pelo link exclusivo da academia (AUTH-02, RN-06).</summary>
    [HttpPost("academies/{slug}/register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Register(string slug, StudentRegisterRequest req)
        => Ok(await auth.RegisterStudentAsync(slug, req));

    /// <summary>Login de aluno/professor no contexto da academia (AUTH-01).</summary>
    [HttpPost("academies/{slug}/login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> Login(string slug, LoginRequest req)
        => Ok(await auth.LoginAsync(slug, req));

    /// <summary>Login do Super Admin (portal SaaS separado).</summary>
    [HttpPost("admin/login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponse>> AdminLogin(SuperAdminLoginRequest req)
        => Ok(await auth.LoginSuperAdminAsync(req));

    /// <summary>Dados do usuário autenticado.</summary>
    [HttpGet("auth/me")]
    [Authorize]
    public async Task<ActionResult<MeResponse>> Me()
        => Ok(await auth.GetMeAsync(User.GetUserId()));
}
