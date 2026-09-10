# ▶️ Como rodar e testar localmente

Você precisa de **dois terminais**: um para o backend (API) e outro para o frontend.

Pré-requisitos já verificados nesta máquina: .NET 10, Node 20, Docker.

---

## Passo 1 — Banco de dados

Escolha **uma** das opções.

### Opção A — PostgreSQL local via Docker (recomendado para testar agora)

1. **Abra o Docker Desktop** e espere ele iniciar (o ícone da baleia fica estável).
2. Na raiz do projeto:
   ```powershell
   docker compose up -d
   ```
   Isso sobe um Postgres em `localhost:5432` com usuário `postgres`, senha `postgres`, banco `forja`
   — exatamente o que o `appsettings.json` já espera. **Nenhuma configuração extra é necessária.**
3. Para conferir:
   ```powershell
   docker compose ps
   ```

### Opção B — Supabase (quando tiver o projeto)

No painel do Supabase: **Project Settings → Database → Connection string**. Depois:
```powershell
cd backend/Forja.Api
dotnet user-secrets set "ConnectionStrings:ForjaDb" "Host=<host>;Port=5432;Database=postgres;Username=postgres;Password=<senha>;SSL Mode=Require;Trust Server Certificate=true"
```

---

## Passo 2 — Backend (API)

No **terminal 1**:
```powershell
cd backend/Forja.Api
dotnet run
```
- Ao iniciar, a API **aplica as migrations e roda o seed automaticamente**.
- A API sobe em **http://localhost:5063**.
- Deixe este terminal aberto.

> Se aparecer aviso sobre banco inacessível, confirme que o Docker Desktop está rodando
> (Opção A) ou que a connection string do Supabase foi configurada (Opção B).

---

## Passo 3 — Frontend (SPA)

No **terminal 2**:
```powershell
cd frontend
npm install      # só na primeira vez
npm run dev
```
- O frontend sobe em **http://localhost:5173** (já configurado para falar com a API na 5063).

---

## Passo 4 — Testar no navegador

Abra **http://localhost:5173**. Use os dados de demonstração (senha de todos: **`forja123`**):

| Perfil | Como acessar | E-mail |
|---|---|---|
| **Aluno** | `http://localhost:5173/gracie-barra-matriz/login` | `aluno@forja.com` |
| **Professor** | `http://localhost:5173/gracie-barra-matriz/login` | `professor@forja.com` |
| **Super Admin** | `http://localhost:5173/admin/login` | `superadmin@forja.com` |

Fluxos para experimentar:
- **Aluno**: veja a carteirinha digital e o histórico de mensalidades.
- **Professor**: dashboard com KPIs, listagem/busca de alunos, fila de aprovação, planilha
  financeira (clique numa célula para dar baixa; botão do WhatsApp para cobrar), campeonatos
  (crie um, adicione categoria, inscreva alunos, gere o chaveamento).
- **Super Admin**: crie academias/equipes e cadastre professores vinculando equipes.
- **Cadastro de novo aluno**: `http://localhost:5173/gracie-barra-matriz/cadastro` → ele nasce
  "Pendente" e aparece na fila de aprovação do professor.

---

## Rodar os testes automatizados

```powershell
dotnet test backend/Forja.Api.Tests
```

## Parar o banco (Opção A)

```powershell
docker compose down        # mantém os dados
docker compose down -v     # apaga os dados (volume)
```
