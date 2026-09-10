using Forja.Api.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Forja.Api.Tests;

/// <summary>
/// Sobe a API em memória para testes de integração, substituindo o PostgreSQL
/// por EF Core InMemory. Cada instância usa um banco isolado.
/// </summary>
public class ForjaWebFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            // Remove todos os descritores relacionados ao EF Core / Npgsql
            // para poder registrar o provider InMemory sem conflito.
            var toRemove = services.Where(d =>
                d.ServiceType.FullName?.Contains("EntityFrameworkCore") == true ||
                d.ServiceType == typeof(DbContextOptions<ForjaDbContext>) ||
                d.ServiceType == typeof(ForjaDbContext) ||
                (d.ServiceType.IsGenericType &&
                 d.ServiceType.GetGenericTypeDefinition() == typeof(DbContextOptions<>)))
                .ToList();
            foreach (var d in toRemove) services.Remove(d);

            services.AddDbContext<ForjaDbContext>(opt => opt.UseInMemoryDatabase(_dbName));
        });
    }
}
