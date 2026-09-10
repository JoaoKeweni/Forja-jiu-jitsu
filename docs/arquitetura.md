# 🏗️ Arquitetura Técnica — Forja Jiu-Jitsu

> **Histórico**: O projeto foi originalmente prototipado em **Next.js + Supabase (full-stack)**.
> A partir de setembro/2026 a arquitetura foi migrada para **cliente-servidor**:
> backend **ASP.NET Core Web API (.NET 10)** + frontend **React (SPA)**, mantendo o
> **PostgreSQL do Supabase** apenas como banco de dados gerenciado.

---

## 1. Visão Geral

```
┌─────────────────┐        HTTPS/JSON        ┌──────────────────────┐       Npgsql/EF Core      ┌────────────────────────┐
│   Frontend SPA  │ ───────────────────────► │  Backend Web API     │ ────────────────────────► │  PostgreSQL (Supabase) │
│  React + Vite   │ ◄─────────────────────── │  ASP.NET Core (.NET 10)│ ◄──────────────────────── │  banco gerenciado      │
│  (TypeScript)   │      JWT Bearer token    │  Controllers + EF Core │                           │                        │
└─────────────────┘                          └──────────────────────┘                           └────────────────────────┘
```

Princípios:

- **Separação cliente-servidor**: o React é uma SPA pura; toda regra de negócio e acesso a dados fica no backend C#.
- **O frontend nunca acessa o banco diretamente.** Toda comunicação passa pela API REST.
- **Multi-tenant por slug**: cada academia tem uma URL exclusiva (ex.: `/gracie-barra-matriz`). O tenant é resolvido pelo slug e propagado via claim no JWT.

---

## 2. Stack Tecnológico

### Backend (`backend/Forja.Api`)
| Camada | Tecnologia |
|---|---|
| Runtime | .NET 10 |
| Framework Web | ASP.NET Core Web API (controllers) |
| ORM | Entity Framework Core 9 |
| Provider de banco | Npgsql (PostgreSQL) |
| Autenticação | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Hashing de senha | BCrypt.Net-Next |
| Documentação de API | OpenAPI (`Microsoft.AspNetCore.OpenApi`) |

### Frontend (`frontend/`)
| Camada | Tecnologia |
|---|---|
| Build tool | Vite |
| UI | React + TypeScript |
| Estilo | Tailwind CSS (design system reaproveitado — ver `docs/legacy-design/`) |
| Roteamento | React Router |
| Estado de servidor / cache | TanStack Query (React Query) |
| Cliente HTTP | fetch/axios com interceptor de JWT |
| Ícones | lucide-react |

### Banco de Dados
- **PostgreSQL gerenciado pelo Supabase.**
- Usamos **somente o banco**. Não utilizamos Supabase Auth, RLS policies nem o SDK client-side.
- A autenticação e a autorização são implementadas no backend C# (JWT + verificação por role/tenant).
- Conexão via connection string do Supabase:
  - **Direct connection** (porta 5432) — usada para migrations.
  - **Connection pooler / Supavisor** (porta 6543) — recomendada para runtime.

---

## 3. Estrutura do Repositório (monorepo)

```
Forja-jiu-jitsu/
├── Forja.slnx                  # Solução .NET (formato .slnx)
├── backend/
│   └── Forja.Api/
│       ├── Domain/             # Entidades de domínio + enums
│       ├── Data/               # ForjaDbContext (EF Core)
│       ├── Dtos/               # Data Transfer Objects (contratos da API)
│       ├── Services/           # Regras de negócio
│       ├── Auth/               # JWT (TokenService, claims)
│       ├── Controllers/        # Endpoints REST
│       ├── Program.cs          # Composição da aplicação
│       └── appsettings.json    # Config (sem segredos — placeholders)
├── frontend/                   # React + Vite (SPA)
├── docs/
│   ├── contexto.md             # Contexto de negócio (perfis, regras RN-01..RN-06)
│   ├── prompts_telas.md        # Especificação de UI/UX das telas
│   ├── arquitetura.md          # Este documento
│   └── legacy-design/          # Design system e schema originais (referência)
│       ├── tailwind.config.ts
│       ├── globals.css
│       └── schema.sql
└── wireframes/                 # Wireframes HTML de referência
```

---

## 4. Modelo de Dados

As entidades C# em `backend/Forja.Api/Domain/` espelham o schema original
(`docs/legacy-design/schema.sql`), com as seguintes **correções** aplicadas na migração:

| # | Correção |
|---|---|
| 1 | `Profile.PasswordHash` (BCrypt) adicionado — substitui o Supabase Auth. |
| 2 | Nova entidade `CategoryEnrollment` (junção aluno ↔ categoria de campeonato), que faltava no schema. |
| 3 | Enums mapeados como texto no PostgreSQL (`HasConversion<string>`). |
| 4 | Check constraints (graus 0–4, dia de vencimento 1–31, mês 1–12), índices e uniques configurados no `ForjaDbContext`. |
| 5 | Correção das inconsistências do seed original (IDs de teams duplicados, role `superadmin` vs `super_admin`, UUIDs inválidos). |

Entidades principais: `Academy` (tenant, slug único) → `Team` → `Student` (1:1 com `Profile`) → `Payment`;
`ProfessorTeam` (N:N professor↔equipe); módulo de campeonatos: `Tournament` → `TournamentCategory` → `CategoryEnrollment` / `Match`.

---

## 5. Autenticação e Autorização

- **Login/registro** tratados pela API C#. Senhas com hash **BCrypt**.
- Emissão de **JWT** contendo claims: `sub`, `email`, `name`, `role`, `academy_id`, `team_ids`.
- **Multi-tenant**: alunos e professores autenticam pelo contexto da academia (slug). O Super Admin tem portal separado.
- Autorização por role (`SuperAdmin`, `Professor`, `Student`) e escopo por equipe (RN-02, RN-03).

---

## 6. Configuração e Segredos

- **Nenhum segredo real é versionado.** `appsettings.json` contém apenas placeholders de desenvolvimento.
- A connection string do Supabase e a chave JWT são fornecidas via **user-secrets** (dev) ou **variáveis de ambiente** (produção), fora do controle de versão.
- `.gitignore` cobre `.env`, `appsettings.Local.json`, `bin/`, `obj/`, `node_modules/`, `dist/`.

---

## 7. Como Executar (desenvolvimento)

### Backend
```bash
cd backend/Forja.Api
# configurar connection string do Supabase (uma vez, via user-secrets)
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:ForjaDb" "<connection string do Supabase>"
# (opcional) aplicar migrations manualmente
dotnet ef database update
# rodar (aplica migrations e roda o seed automaticamente na inicialização)
dotnet run
```

> **Migração e seed automáticos**: ao iniciar, a API aplica as migrations pendentes
> e executa o seed demo (idempotente). Se o banco estiver inacessível, um aviso é
> logado e a API sobe mesmo assim (útil antes de configurar o Supabase).

#### Connection string do Supabase
No painel do Supabase: **Project Settings → Database → Connection string**.
- **Migrations**: use a *direct connection* (porta 5432).
- **Runtime**: recomendado o *connection pooler / Supavisor* (porta 6543).

Formato Npgsql:
```
Host=<host>;Port=5432;Database=postgres;Username=postgres;Password=<senha>;SSL Mode=Require;Trust Server Certificate=true
```

#### Dados demo (seed)
Senha de todos os usuários demo: **`forja123`** (apenas desenvolvimento).

| Perfil | E-mail | Acesso |
|---|---|---|
| Super Admin | `superadmin@forja.com` | `POST /api/admin/login` |
| Professor | `professor@forja.com` | `POST /api/academies/gracie-barra-matriz/login` |
| Aluno | `aluno@forja.com` | `POST /api/academies/gracie-barra-matriz/login` |

Academias demo: `gracie-barra-matriz`, `alliance-sp`.

### Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

O CORS do backend já libera a origem `http://localhost:5173` (configurável em `appsettings.json`, seção `Cors:AllowedOrigins`).

### Integração frontend ↔ backend

- O backend roda em `http://localhost:5063` (perfil `http` em `Properties/launchSettings.json`).
- O frontend consome a API via `VITE_API_URL` (default `http://localhost:5063/api`). Copie `frontend/.env.example` para `frontend/.env` para customizar.
- Fluxo de desenvolvimento: rode o backend (`dotnet run`) e, em outro terminal, o frontend (`npm run dev`).
