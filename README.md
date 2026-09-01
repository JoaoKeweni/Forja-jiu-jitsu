# Forja Jiu-Jitsu

Plataforma SaaS para gestão de academias de Jiu-Jitsu, equipes, professores, alunos, mensalidades e campeonatos internos.

O projeto está em reconstrução. O protótipo anterior, baseado em Next.js, TypeScript e Supabase, foi removido para que a nova solução seja implementada com responsabilidades bem separadas:

- backend: C# com ASP.NET Core Web API;
- frontend: React em JavaScript;
- persistência: PostgreSQL por meio do Entity Framework Core;
- comunicação: API REST sobre HTTPS;
- arquitetura inicial: monólito modular, preparado para crescer sem a complexidade prematura de microsserviços.

## Estado atual

Esta etapa contém a documentação funcional, a arquitetura de referência e os wireframes legados que servem como insumo visual. A nova aplicação ainda não foi criada.

## Documentação

- [Contexto do produto](docs/contexto.md)
- [Arquitetura de referência](docs/arquitetura.md)
- [Especificação de telas](docs/prompts_telas.md)
- [Wireframes](wireframes/)

Em caso de divergência, o contexto do produto define **o que** o sistema deve fazer e o documento de arquitetura define **como** a nova solução deve ser organizada. Os wireframes são referências, não contratos de implementação.

## Estrutura planejada

```text
Forja-jiu-jitsu/
├── backend/
│   ├── src/
│   │   ├── Forja.Api/
│   │   ├── Forja.Application/
│   │   ├── Forja.Domain/
│   │   └── Forja.Infrastructure/
│   └── tests/
│       ├── Forja.UnitTests/
│       └── Forja.IntegrationTests/
├── frontend/
│   ├── public/
│   ├── src/
│   └── tests/
├── docs/
└── wireframes/
```

Os diretórios `backend/` e `frontend/` devem ser criados quando o novo código for iniciado. A estrutura interna pode evoluir por decisão arquitetural registrada, sem misturar regras de negócio com detalhes de interface ou banco de dados.

## Próxima etapa recomendada

1. Criar a solution .NET e os quatro projetos do backend.
2. Criar a SPA React em JavaScript.
3. Configurar PostgreSQL local, migrations e dados de desenvolvimento.
4. Implementar primeiro o fluxo vertical de cadastro e aprovação de aluno.
5. Adicionar autenticação, autorização por perfil e isolamento por academia desde o primeiro módulo.

## Convenções iniciais

- A API é a única porta de acesso às regras e aos dados do sistema.
- O frontend não acessa o banco diretamente.
- Identificadores são UUIDs e datas são armazenadas em UTC; datas exclusivamente civis usam um tipo sem horário.
- Segredos e credenciais nunca são versionados.
- Toda consulta de dados de academia deve respeitar o tenant autenticado.
- Mudanças importantes de arquitetura devem ser registradas em `docs/decisoes/` como ADRs.
