using System.Text;
using System.Text.Json.Serialization;
using Forja.Api.Auth;
using Forja.Api.Data;
using Forja.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ── Controllers + JSON (enums como string) ──
builder.Services.AddControllers().AddJsonOptions(o =>
{
    o.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

builder.Services.AddOpenApi();

// ── EF Core / PostgreSQL ──
builder.Services.AddDbContext<ForjaDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("ForjaDb")));

// ── JWT ──
var jwtSection = builder.Configuration.GetSection("Jwt");
builder.Services.Configure<JwtOptions>(jwtSection);
var jwtOptions = jwtSection.Get<JwtOptions>()!;
builder.Services.AddScoped<ITokenService, TokenService>();

// ── Serviços de aplicação ──
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITeamScopeService, TeamScopeService>();
builder.Services.AddScoped<ITournamentService, TournamentService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key))
        };
    });

builder.Services.AddAuthorization();

// ── CORS (frontend Vite) ──
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
                     ?? ["http://localhost:5173"];
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// ── Migrations + seed na inicialização ──
// Se o banco não estiver acessível (ex.: connection string ainda não configurada),
// loga um aviso em vez de derrubar a aplicação.
await using (var scope = app.Services.CreateAsyncScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = services.GetRequiredService<ForjaDbContext>();
        await db.Database.MigrateAsync();
        await DbSeeder.SeedAsync(db);
        logger.LogInformation("Banco migrado e populado com sucesso.");
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex,
            "Não foi possível migrar/popular o banco na inicialização. " +
            "Verifique a connection string 'ForjaDb' (Supabase).");
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
