# 🥋 Forja Jiu-Jitsu

![CI](https://github.com/JoaoKeweni/Forja-jiu-jitsu/actions/workflows/ci.yml/badge.svg)

Plataforma SaaS multi-tenant para gestão de academias de Jiu-Jitsu (academias, equipes, alunos, mensalidades e campeonatos internos).

## 🏗️ Arquitetura

Aplicação **cliente-servidor**:

- **Backend**: ASP.NET Core Web API (.NET 10) + Entity Framework Core (`backend/Forja.Api`)
- **Frontend**: React + Vite + TypeScript (`frontend/`)
- **Banco de dados**: PostgreSQL gerenciado pelo **Supabase** (usado apenas como banco; auth e regras ficam no backend)

> Migrado de um protótipo Next.js + Supabase full-stack. Detalhes em [docs/arquitetura.md](docs/arquitetura.md).

## 📁 Estrutura

```
├── backend/Forja.Api/   # API C# (.NET 10, EF Core, JWT)
├── frontend/            # SPA React (Vite)
├── docs/                # Documentação
└── wireframes/          # Wireframes HTML de referência
```

## 📄 Documentação

- [Arquitetura Técnica](docs/arquitetura.md)
- [Documento de Contexto do Sistema](docs/contexto.md)
- [Guia de Prompts de UI/UX e Especificação de Telas](docs/prompts_telas.md)

## 🚀 Como executar

Consulte a seção [Como Executar](docs/arquitetura.md#7-como-executar-desenvolvimento) da documentação de arquitetura.

## ✅ Testes e CI

- Testes do backend: `dotnet test backend/Forja.Api.Tests`
- Build do frontend: `cd frontend && npm run build`
- CI (GitHub Actions): a cada push/PR na `main`, roda build+testes do backend e build do frontend (`.github/workflows/ci.yml`).
