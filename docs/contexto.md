# Contexto do produto — Forja Jiu-Jitsu

## 1. Propósito

O Forja Jiu-Jitsu é uma plataforma SaaS para simplificar a operação de academias de Jiu-Jitsu. O produto reúne gestão de unidades e turmas, cadastro e graduação de atletas, controle manual de mensalidades e organização de campeonatos internos.

O sistema é multi-tenant: cada academia representa um ambiente de dados isolado. Uma instalação atende várias academias, mas usuários de uma academia não podem consultar ou alterar dados de outra sem autorização explícita da plataforma.

## 2. Objetivos do produto

- Reduzir controles paralelos em planilhas e mensagens.
- Dar ao professor uma visão rápida da turma que está administrando.
- Permitir que o aluno acompanhe cadastro, perfil, mensalidades e eventos.
- Manter a operação financeira simples, sem processar pagamentos no MVP.
- Garantir isolamento entre academias e rastreabilidade de ações sensíveis.

## 3. Escopo do MVP

### Incluído

- autenticação e recuperação de acesso;
- gestão de academias, turmas e vínculos de professores;
- URL pública identificada pelo slug da academia;
- cadastro de aluno sujeito à aprovação;
- perfil, faixa, graus e histórico de graduação;
- mensalidades com baixa manual;
- consulta de inadimplência e atalho de cobrança por WhatsApp;
- campeonatos internos, categorias, inscrições, chaves e resultados;
- dashboards operacionais por perfil.

### Fora do escopo inicial

- gateway de pagamento e conciliação bancária;
- emissão fiscal ou contabilidade;
- marketplace e inscrições de atletas externos;
- gestão completa de aulas, presença e planos de treino;
- aplicativo móvel nativo;
- comunicação automática por WhatsApp ou e-mail.

Esses itens podem ser avaliados depois do MVP, sem serem assumidos pela arquitetura inicial.

## 4. Perfis e responsabilidades

### Super Admin

Administra a plataforma. Pode cadastrar e desativar academias, criar turmas, cadastrar professores, definir vínculos e visualizar métricas globais. Seu acesso ocorre por uma área administrativa separada do portal de cada academia.

### Professor ou gestor da academia

Administra somente as academias e turmas às quais está vinculado. Pode aprovar alunos, atualizar dados esportivos, controlar mensalidades e administrar campeonatos internos. Quando possuir mais de um vínculo, escolhe uma turma ou uma visão consolidada dentro do seu escopo autorizado.

### Aluno

Solicita entrada em uma turma, acompanha o estado da aprovação e, quando ativo, acessa seu perfil, graduação, mensalidades e campeonatos da academia. Não possui acesso administrativo.

## 5. Conceitos do domínio

- **Academia:** tenant e principal fronteira de isolamento dos dados. Possui nome, slug único, estado e informações de contato.
- **Turma:** grupo ou horário pertencente a uma academia. Uma academia possui uma ou mais turmas.
- **Usuário:** identidade de acesso. Pode receber papéis e vínculos compatíveis com suas responsabilidades.
- **Vínculo do professor:** autorização de um professor para administrar determinada turma.
- **Aluno:** perfil esportivo de um usuário em uma academia, associado inicialmente a uma turma.
- **Graduação:** registro histórico de faixa, graus, data e responsável pela alteração.
- **Mensalidade:** obrigação financeira de um aluno em uma competência, com vencimento, valor e estado.
- **Campeonato interno:** evento restrito aos alunos ativos da própria academia.
- **Categoria:** agrupamento do campeonato por critérios como faixa, idade, gênero e peso.
- **Inscrição:** participação de um aluno em uma categoria.
- **Luta:** confronto do chaveamento, com competidores, fase, resultado e vencedor.

## 6. Jornadas principais

### Entrada de um novo aluno

1. O aluno acessa a URL pública da academia pelo slug.
2. Informa seus dados e escolhe uma turma disponível.
3. O sistema cria a solicitação com estado `Pendente`.
4. Um professor autorizado para a turma analisa a solicitação.
5. Ao aprovar, o professor define dados iniciais como graduação, vencimento e valor da mensalidade.
6. O aluno passa ao estado `Ativo` e recebe acesso às áreas permitidas.

### Controle de mensalidade

1. O sistema apresenta as competências do aluno e calcula a situação exibida a partir do estado e do vencimento.
2. O professor registra manualmente o recebimento e a forma de pagamento.
3. A baixa guarda data, usuário responsável e eventual observação.
4. O aluno consulta o histórico, mas não altera pagamentos.

### Campeonato interno

1. O professor cria um evento em rascunho e configura suas categorias.
2. Alunos ativos da academia são inscritos nas categorias elegíveis.
3. O professor publica e gera o chaveamento.
4. Durante o evento, resultados são registrados e vencedores avançam.
5. Ao final, o evento é encerrado e seus resultados ficam disponíveis para consulta.

## 7. Regras de negócio

- **RN-01 — Aprovação obrigatória:** o cadastro não concede automaticamente acesso de aluno ativo.
- **RN-02 — Isolamento por academia:** toda operação de domínio deve estar limitada à academia do contexto autenticado, exceto ações globais do Super Admin.
- **RN-03 — Escopo do professor:** o professor só administra turmas com vínculo ativo.
- **RN-04 — Visão consolidada:** “todas as turmas” agrega somente turmas autorizadas; não amplia permissões.
- **RN-05 — Slug único:** cada academia ativa possui um slug público único e estável. Alterações devem evitar quebra de links existentes.
- **RN-06 — Estados do aluno:** a transição mínima é `Pendente -> Ativo` ou `Pendente -> Rejeitado`; alunos ativos podem ser inativados sem apagar o histórico.
- **RN-07 — Graduação válida:** graus variam de 0 a 4 e mudanças de faixa ou grau geram histórico auditável.
- **RN-08 — Competência única:** um aluno não pode ter duas mensalidades para a mesma competência mensal.
- **RN-09 — Baixa financeira:** somente professor autorizado ou Super Admin registra, corrige ou cancela uma baixa.
- **RN-10 — Estado financeiro:** `Pago` e `Isento` são estados persistidos; `A vencer` e `Atrasado` podem ser derivados do vencimento de uma mensalidade pendente.
- **RN-11 — Sem processamento financeiro:** o MVP apenas registra pagamentos realizados fora da plataforma.
- **RN-12 — Campeonato interno:** somente alunos ativos da academia do evento podem participar.
- **RN-13 — Integridade da categoria:** um aluno não pode aparecer duas vezes na mesma categoria.
- **RN-14 — Resultado de luta:** uma luta finalizada deve possuir vencedor válido e registro do responsável pela alteração.
- **RN-15 — Exclusão lógica:** academias, usuários e registros operacionais com histórico devem ser inativados, não apagados definitivamente pelo fluxo comum.

## 8. Estados relevantes

| Conceito | Estados mínimos |
| --- | --- |
| Academia | Ativa, Inativa |
| Aluno | Pendente, Ativo, Rejeitado, Inativo |
| Mensalidade | Pendente, Paga, Isenta, Cancelada |
| Campeonato | Rascunho, Inscrições abertas, Chaveamento pronto, Em andamento, Concluído, Cancelado |
| Luta | Agendada, Em andamento, Finalizada, Cancelada |

## 9. Requisitos não funcionais

- autorização validada no backend em todas as operações protegidas;
- isolamento multi-tenant testado automaticamente;
- senhas armazenadas somente por provedor/implementação segura de identidade;
- trilha de auditoria para aprovações, graduações, baixas e resultados;
- validação de entrada e respostas de erro consistentes;
- interface responsiva, com prioridade para uso em celular pelo aluno;
- observabilidade com logs estruturados, correlação de requisições e métricas básicas;
- backups e migrations reproduzíveis antes da entrada em produção;
- conformidade com a LGPD, incluindo minimização de dados e controle de acesso.

## 10. Critérios de sucesso do MVP

- Um Super Admin consegue configurar uma academia, suas turmas e um professor.
- Um aluno consegue solicitar entrada usando o slug correto.
- Um professor vê e administra apenas suas turmas e aprova o aluno.
- O professor registra uma mensalidade e o aluno consulta o resultado.
- Um campeonato completo pode ir de rascunho a concluído com participantes internos.
- Testes demonstram que um tenant não acessa dados de outro.

## 11. Questões pendentes de produto

- Um aluno poderá estar simultaneamente em mais de uma turma?
- Uma academia poderá ter filiais como tenants independentes ou como unidades do mesmo tenant?
- Quem pode corrigir uma baixa financeira já confirmada e por quanto tempo?
- O aluno confirma a própria inscrição em campeonato ou somente o professor inscreve?
- Qual provedor de envio será usado quando notificações automáticas entrarem no escopo?

Essas decisões devem ser resolvidas antes dos módulos afetados. A arquitetura técnica de referência está em [arquitetura.md](arquitetura.md).
