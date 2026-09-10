namespace Forja.Api.Services;

/// <summary>Erro de regra de negócio, mapeado para respostas HTTP 4xx.</summary>
public class DomainException(string message, int statusCode = 400) : Exception(message)
{
    public int StatusCode { get; } = statusCode;

    public static DomainException NotFound(string message) => new(message, 404);
    public static DomainException Conflict(string message) => new(message, 409);
    public static DomainException Unauthorized(string message) => new(message, 401);
    public static DomainException Forbidden(string message) => new(message, 403);
}
