using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Xunit;

namespace Forja.Api.Tests;

public class AuthEndpointsTests(ForjaWebFactory factory) : IClassFixture<ForjaWebFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    // Records auxiliares para desserializar respostas.
    private record AuthResult(string Token, string Email, string Role, string? StudentStatus);
    private record ErrorResult(string Error);
    private record PublicAcademy(Guid Id, string Name, string Slug, List<TeamItem> Teams);
    private record TeamItem(Guid Id, string Name);

    [Fact]
    public async Task Public_academy_endpoint_returns_seeded_academy()
    {
        var res = await _client.GetAsync("/api/academies/gracie-barra-matriz");
        res.StatusCode.Should().Be(HttpStatusCode.OK);

        var academy = await res.Content.ReadFromJsonAsync<PublicAcademy>();
        academy!.Slug.Should().Be("gracie-barra-matriz");
        academy.Teams.Should().NotBeEmpty();
    }

    [Fact]
    public async Task Unknown_academy_returns_404()
    {
        var res = await _client.GetAsync("/api/academies/nao-existe");
        res.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Student_login_then_me_returns_profile()
    {
        var login = await _client.PostAsJsonAsync("/api/academies/gracie-barra-matriz/login",
            new { email = "aluno@forja.com", password = "forja123" });
        login.StatusCode.Should().Be(HttpStatusCode.OK);

        var auth = await login.Content.ReadFromJsonAsync<AuthResult>();
        auth!.Token.Should().NotBeNullOrEmpty();
        auth.Role.Should().Be("Student");

        _client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", auth.Token);
        var me = await _client.GetAsync("/api/auth/me");
        me.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task Login_wrong_password_returns_401()
    {
        var res = await _client.PostAsJsonAsync("/api/academies/gracie-barra-matriz/login",
            new { email = "aluno@forja.com", password = "errada" });
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task SuperAdmin_cannot_login_via_academy_route()
    {
        var res = await _client.PostAsJsonAsync("/api/academies/gracie-barra-matriz/login",
            new { email = "superadmin@forja.com", password = "forja123" });
        res.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Me_without_token_returns_401()
    {
        var res = await _client.GetAsync("/api/auth/me");
        res.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task Register_new_student_returns_pending()
    {
        var res = await _client.PostAsJsonAsync("/api/academies/gracie-barra-matriz/register",
            new
            {
                fullName = "Novo Aluno",
                email = $"novo-{Guid.NewGuid():N}@x.com",
                phone = "11999998888",
                password = "senha123",
                teamId = "b0000000-0000-0000-0000-000000000001",
            });
        res.StatusCode.Should().Be(HttpStatusCode.OK);
        var auth = await res.Content.ReadFromJsonAsync<AuthResult>();
        auth!.StudentStatus.Should().Be("Pending");
    }
}
