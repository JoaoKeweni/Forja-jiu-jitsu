# 🎨 Guia de Prompts de UI/UX e Especificação de Telas — Forja Jiu-Jitsu

Este documento contém a especificação detalhada e os **prompts de UI/UX completos** para o desenvolvimento de todas as telas do sistema **Forja Jiu-Jitsu**, divididos entre as visões de **Autenticação**, **Super Admin**, **Professor / Admin de Academia** e **Aluno (Atleta)**.

---

## 📱 Sumário Geral de Telas

### Telas de Autenticação & Onboarding (Geral)
1. [`AUTH-01`] Tela de Login Única (Super Admin, Professor e Aluno)
2. [`AUTH-02`] Cadastro Simplificado do Aluno (Seleção de Academia + Equipe)
3. [`AUTH-03`] Tela de Espera "Aguardando Aprovação do Professor"

### Telas do Professor / Admin de Academia (Gestor do Time)
1. [`ADM-01`] Dashboard Principal com Seletor de Equipe no Topo
2. [`ADM-02`] Gestão de Alunos (Listagem & Filtros por Equipe)
3. [`ADM-03`] Cadastro e Edição de Aluno (Modal/Página)
4. [`ADM-04`] Controle Financeiro (Planilha Inteligente de Mensalidades)
5. [`ADM-05`] Gestão de Campeonatos Internos (Listagem & Status)
6. [`ADM-06`] Configuração do Campeonato Interno & Categorias
7. [`ADM-07`] Painel de Chaveamento & Execução de Lutas
8. [`ADM-08`] Fila de Aprovação de Novos Alunos (Moderação)

### Telas do Super Admin (Gestão da Plataforma SaaS)
1. [`SA-01`] Dashboard Super Admin (Métricas Globais)
2. [`SA-02`] Cadastro e Gestão de Academias & Equipes
3. [`SA-03`] Gestão de Professores & Vínculo de Equipes

### Telas do Aluno (Atleta)
1. [`ALU-01`] Perfil do Aluno / Carteirinha Digital
2. [`ALU-02`] Histórico Financeiro & Vencimento
3. [`ALU-03`] Campeonatos Internos & Minhas Chaves

---

## 🔑 Prompts de Autenticação & Onboarding

### AUTH-01: Tela de Login da Academia (Alunos & Professores)
* **Objetivo**: Ponto de entrada exclusivo para Alunos e Professores da academia referente à URL acessada (ex: `forja.app/gracie-barra-matriz`). O Super Admin loga por um portal SaaS separado.
* **Layout**: Card centralizado moderno em fundo escuro com branding da Forja Jiu-Jitsu e indicação da academia acessada.
* **Prompt para Geração/UI**:
> "Crie uma tela de Login ultra moderna em Dark Mode para a plataforma 'Forja Jiu-Jitsu' personalizada para o ecossistema de uma academia específica (ex: Gracie Barra Matriz). 
> **Centro**: Card central com efeito glassmorphism (vidro fosco), contendo o logo em destaque com detalhes vermelhos/dourados (#b91c1c), fundo preto profundo e badge indicando a unidade/academia acessada. 
> **Seletor de Perfil**: Alternância rápida entre '🥋 Professor' e '🥋 Aluno' (exclusivo para os perfis da academia). 
> **Campos**: Campo de E-mail/Usuário com ícone de envelope, campo de Senha com alternância de visibilidade (ícone de olho), checkbox 'Lembrar de mim', link 'Esqueceu a senha?'. 
> **Botões**: Botão principal 'Entrar na Plataforma' e link destacado abaixo: 'Novo aluno? Crie sua conta e solicite entrada na sua equipe'."

---

### AUTH-02: Cadastro Simplificado do Aluno (URL Única da Academia)
* **Objetivo**: Permitir que um novo aluno crie sua conta diretamente pelo link exclusivo encaminhado por sua academia (Academia já pré-selecionada automaticamente).
* **Layout**: Formulário em etapas simples (Dados Pessoais -> Escolha da Equipe/Horário).
* **Prompt para Geração/UI**:
> "Desenvolva uma tela de cadastro de aluno mobile-first simples e intuitiva acessada via link único da academia. 
> **Etapa 1 (Seus Dados)**: Nome Completo, E-mail, Telefone (WhatsApp) e criação de Senha. 
> **Etapa 2 (Sua Equipe)**: Bloco informativo indicando a Academia Pré-selecionada ('Academia: Gracie Barra Matriz - Link Exclusivo'), Dropdown 'Selecione sua Equipe/Horário' (ex: 'Equipe Adulto Noite - Prof. Marcus'), Upload opcional de foto de perfil. 
> **Ação**: Botão principal 'Finalizar Cadastro e Solicitar Aprovação'."

---

### AUTH-03: Tela de Espera "Aguardando Aprovação"
* **Objetivo**: Informar ao aluno recém-cadastrado que sua solicitação foi enviada e está aguardando liberação do professor.
* **Layout**: Card amigável de status com ilustração esportiva e botão de atualização.
* **Prompt para Geração/UI**:
> "Crie uma tela de boas-vindas e espera para o aluno recém-cadastrado. 
> **Conteúdo**: Badge 🟡 'Aguardando Aprovação do Professor'. Mensagem amigável: 'Olá, [Nome do Aluno]! Seu cadastro na [Nome da Academia] - [Nome da Equipe] foi recebido com sucesso. O Professor [Nome do Professor] irá aprovar sua entrada em breve.' 
> **Card do Time**: Exibe foto da academia/equipe selecionada e botão 'Verificar Status de Aprovação'."

---

## 🛠️ Prompts das Telas do Professor / Admin de Academia

### ADM-01: Dashboard Principal (com Seletor de Equipes no Topo)
* **Objetivo**: Dashboard do professor para acompanhar KPIs e gerenciar o time em aula no momento.
* **Layout**: Header fixo com seletor de equipes + 4 KPI Cards + Fila de Notificação de Alunos Pendentes + Próximos Vencimentos.
* **Prompt para Geração/UI**:
> "Crie uma interface moderna de Dashboard Admin/Professor para 'Forja Jiu-Jitsu' em Dark Mode. 
> **Topo Fixado**: Header contendo Logo, **Seletor em Dropdown de Destaque**: '🥋 Equipe Atual: [Selecione: Equipe Adulto Noite ▾]' (permitindo alternar para 'Equipe Infantil', 'Equipe Manhã' ou 'Todas as Equipes'), e foto do professor. 
> **Alerta de Moderação**: Banner de aviso se houver novos alunos aguardando aprovação: '🔔 Existem 3 novos alunos aguardando aprovação nesta equipe [Ver Fila]'. 
> **KPI Cards (4 colunas)**: Alunos Ativos na Equipe, Adimplência da Equipe (%), Mensalidades Atrasadas, Próximos Campeonatos Internos. 
> **Corpo**: Tabela de vencimentos da semana com botão direto de WhatsApp e atalhos rápidos."

---

### ADM-02: Gestão de Alunos (Listagem & Filtros por Equipe)
* **Objetivo**: Listar alunos pertencentes à equipe selecionada com filtros de busca por faixa, status e nome.
* **Prompt para Geração/UI**:
> "Desenvolva uma tela de listagem de alunos para gestão de academia de Jiu-Jitsu filtrada pelo time selecionado no topo. 
> **Controles**: Barra de busca com lupa por nome, filtro dropdown por Faixa (Branca, Azul, Roxa, Marrom, Preta), filtro por Status (Ativo, Pendente, Inativo), e botões '+ Novo Aluno' e 'Aprovar Solicitantes'. 
> **Tabela/Cards**: Cada linha/card deve exibir: Foto circular do aluno, Nome completo, Badge visual da Faixa atual com os Graus (ex: Faixa Azul 2 Graus), Telefone/WhatsApp, Dia de Vencimento (ex: Todo dia 10), Status da Mensalidade do Mês (🟢 Pago, 🔴 Atrasado), e menu de 3 pontos com ações ('Editar', 'Ver Perfil', 'Histórico'). Design limpo, alta legibilidade e espaçamento fluido."

---

### ADM-03: Cadastro e Edição de Aluno
* **Objetivo**: Formulário completo para cadastrar ou alterar dados do aluno.
* **Prompt para Geração/UI**:
> "Crie um formulário elegante de cadastro/edição de aluno de Jiu-Jitsu. 
> **Seção 1 (Perfil Visual)**: Área de upload/preview de foto de perfil redonda com ícone de câmera. 
> **Seção 2 (Dados Pessoais)**: Inputs para Nome Completo, E-mail, Telefone (com máscara de WhatsApp), Data de Nascimento e Contato de Emergência. 
> **Seção 3 (Graduação)**: Seletor de Faixa Atual com prévia visual da cor da faixa (Branca, Cinza, Amarela, Laranja, Verde, Azul, Roxa, Marrom, Preta), seletor numérico de Graus (0 a 4), e campo de data da última promoção. 
> **Seção 4 (Financeiro)**: Seletor de Dia de Vencimento da Parcela (ex: dias 05, 10, 15 ou 20) e valor da mensalidade. Botão principal 'Salvar Aluno' e botão secundário 'Cancelar'."

---

### ADM-04: Controle Financeiro (Planilha Inteligente de Mensalidades)
* **Objetivo**: Oferecer o controle manual de mensalidades sem gateway de pagamento, no formato de uma planilha interativa e intuitiva.
* **Prompt para Geração/UI**:
> "Desenvolva a tela principal de controle financeiro estilo 'Planilha Inteligente' sem gateway de pagamento para o Forja Jiu-Jitsu, filtrada pela equipe escolhida no topo. 
> **Cabeçalho da Tabela**: Coluna de Aluno (com foto e nome), seguida de colunas para cada mês do ano (Jan a Dez), e coluna final de 'Ações'. 
> **Células da Grade**: Cada célula do mês exibe um badge colorido clicável: 
> - 🟢 **Pago** (com data da baixa ao passar o mouse) 
> - 🟡 **A Vencer** (amarelo suave se dentro do prazo) 
> - 🔴 **Atrasado** (vermelho destacado se vencido) 
> - ⚪ **Isento** 
> **Interatividade**: Ao clicar numa célula 🔴 Atrasado ou 🟡 A Vencer, abre um minimodal de confirmação: 'Confirmar Pagamento de R$ 150 - Mês de Agosto?', com seleção da forma (PIX, Dinheiro, Cartão Presencial) e botão 'Confirmar Baixa'. 
> **Ação Rápida de WhatsApp**: Ícone verde de WhatsApp na coluna de ações da linha de alunos atrasados para abrir conversa direta."

---

### ADM-05: Gestão de Campeonatos Internos (Listagem & Status)
* **Objetivo**: Listar e organizar os campeonatos internos promovidos dentro da própria academia exclusivamente para os alunos matriculados.
* **Layout**: Grid de cards de eventos com badges de status do ciclo de vida.
* **Prompt para Geração/UI**:
> "Crie a tela de gestão de campeonatos internos para o Professor/Admin. 
> **Header**: Título 'Campeonatos Internos da Academia', subtexto explicativo ('Torneios de tatame exclusivos para alunos matriculados na Forja Jiu-Jitsu') e botão grande '⚡ Criar Campeonato Interno'. 
> **Grid de Cards de Evento**: Cada card representa um torneio interno e possui: Banner do evento, Título (ex: '1º Torneio Interno Forja 2026'), Data e Horário no Tatame Principal, Número de Alunos Matriculados Confirmados, e Badge de Status (`Rascunho`, `Inscrições Abertas`, `Chaveamento Pronto`, `Em Andamento`, `Concluído`). 
> **Ações no Card**: Botões 'Gerenciar Categorias', 'Ver Chaves de Lutas' e botão de destaque '▶ Iniciar Torneio Interno'."

---

### ADM-06: Configuração do Campeonato Interno & Categorias
* **Objetivo**: Definir parâmetros do torneio interno, cadastrar categorias e selecionar/inscrever os alunos matriculados na academia.
* **Layout**: Painel com abas (Informações Gerais, Categorias, Alunos Inscritos da Academia).
* **Prompt para Geração/UI**:
> "Desenvolva a tela de configuração de campeonato interno para o Professor. 
> **Aba 1 (Geral)**: Nome do Torneio Interno, Regras do Tatame, Data e Horário. 
> **Aba 2 (Categorias de Luta)**: Tabela de categorias criadas contendo: Nome da Categoria, Faixa (Branca, Azul, Roxa, Marrom, Preta), Peso Máximo, Gênero, Faixa Etária e Alunos Alocados. Formulário para adicionar categoria. 
> **Aba 3 (Alunos Matriculados Inscritos)**: Lista de seleção multi-check dos alunos ativos da academia para alocar em cada categoria com confirmação de pesagem no tatame."

---

### ADM-07: Painel de Chaveamento & Execução de Lutas
* **Objetivo**: Exibir e gerenciar a chave de lutas do torneio interno (árvore mata-mata) e registrar os resultados em tempo real no tatame.
* **Layout**: Visualizador interativo de árvore de chaves (Bracket Tree) com zoom e modal de súmula de luta.
* **Prompt para Geração/UI**:
> "Crie a tela de chaveamento e execução de lutas estilo mata-mata (Tournament Bracket UI) para o campeonato interno da academia. 
> **Árvore de Chaves**: Componente visual interativo dividindo as fases da competição entre os alunos matriculados (Oitavas, Quartas, Semifinal e Final). Cada nó exibe dois alunos (Foto, Nome, Equipe do Aluno, Faixa) e botão de início da luta no tatame. 
> **Interação / Súmula**: Ao clicar na luta ativa, abre o modal 'Súmula de Luta': Seleção do Aluno Vencedor, Tipo de Vitória (Finalização, Pontos ex: 4x2, Vantagens, Punição), e golpe da finalização. Ao salvar, a chave avança o aluno vencedor automaticamente."

---

### ADM-08: Fila de Aprovação de Novos Alunos (Moderação)
* **Objetivo**: Tela onde o professor analisa e aprova/rejeita novos alunos que solicitaram cadastro no seu time.
* **Layout**: Grade de cards de solicitantes com botões de aprovação rápida.
* **Prompt para Geração/UI**:
> "Crie a tela de Fila de Aprovação de Cadastros de Alunos. 
> **Header**: Título 'Solicitações Pendentes de Entrada na Equipe [Nome da Equipe]'. 
> **Cards de Solicitante**: Foto de perfil, Nome completo, E-mail, Telefone (com link WhatsApp para confirmação prévia), Data da solicitação. 
> **Campos de Aprovação**: Dropdown para selecionar a Faixa Inicial (default: Branca) e Quantidade de Graus, e escolha do Dia de Vencimento mensal (ex: todo dia 05, 10, 15 ou 20). 
> **Ações**: Botão verde destacado '🟢 Aprovar Aluno' e botão secundário '🔴 Recusar Solicitação'."

---

## 🏛️ Prompts das Telas do Super Admin (Gestão SaaS)

### SA-01: Dashboard Super Admin
* **Objetivo**: Visão global da rede de academias, total de equipes, professores e alunos no software.
* **Prompt para Geração/UI**:
> "Crie a tela de Dashboard do Super Admin Geral da Forja Jiu-Jitsu em Dark Mode. 
> **Métricas SaaS (4 Cards)**: Total de Academias Cadastradas, Total de Equipes/Times Ativos, Total de Professores, Total Geral de Alunos na Plataforma. 
> **Tabelas Globais**: Lista de Academias Parceiras (com status Ativo/Inativo) e gráfico de crescimento mensal de novos alunos."

---

### SA-02: Cadastro e Gestão de Academias & Equipes
* **Objetivo**: Cadastrar novas academias no sistema e criar equipes/horários para cada uma.
* **Prompt para Geração/UI**:
> "Desenvolva a tela de Gestão de Academias e Equipes para o Super Admin. 
> **Painel**: Lista de Academias com busca e botão '+ Nova Academia'. 
> **Modal de Cadastro de Academia**: Nome Fantasia, CNPJ/Endereço, Telefone do Responsável. 
> **Seção de Equipes da Academia**: Tabela vinculada permitindo adicionar equipes (ex: 'Academia HQ - Equipe Noite', 'Academia HQ - Equipe Infantil', 'Filial Centro - Equipe Manhã')."

---

### SA-03: Gestão e Vínculo de Professores
* **Objetivo**: Cadastrar professores e autorizar em quais equipes eles têm permissão para dar aula e gerenciar alunos.
* **Prompt para Geração/UI**:
> "Crie a tela de Gestão de Professores para o Super Admin. 
> **Formulário/Modal**: Nome do Professor, E-mail de Acesso, Telefone/WhatsApp. 
> **Vínculo de Equipes**: Checklist multi-seleção de quais Equipes/Academias este professor pode gerenciar (ex: ☑ Equipe Adulto Noite - HQ, ☑ Equipe Manhã - Filial Centro). Botão 'Salvar Credenciais do Professor'."

---

## 🥋 Prompts das Telas do Aluno (Visão Atleta)

### ALU-01: Perfil do Aluno / Carteirinha Digital
* **Objetivo**: Proporcionar ao aluno uma experiência visual esportiva de alto impacto, exibindo sua carteirinha digital de atleta e resumo da sua conta.
* **Layout**: Mobile-first com card 'Carteirinha Digital' no topo, acompanhado de status da mensalidade e próximos treinos.
* **Prompt para Geração/UI**:
> "Crie a tela inicial do Aluno (Visão Atleta) com design mobile-first extremamente moderno e esportivo para o Forja Jiu-Jitsu. 
> **Topo - Carteirinha Digital de Atleta**: Card estilizado de alta qualidade simulando uma carteirinha física de Jiu-Jitsu. Exibe: Foto do aluno em moldura, Nome Completo, Ilustração realista da Faixa Atual com a ponteira preta e os Graus marcados em branco (ex: Faixa Azul com 2 Graus), Matrícula do Aluno, Nome da Academia e Equipe ('Forja Jiu-Jitsu - Equipe Adulto Noite'). 
> **Seção 2 - Status da Mensalidade**: Card interativo simples indicando 'Mensalidade de Agosto: 🟢 Em Dia (Vencimento: Todo dia 10)'. 
> **Seção 3 - Atividades & Avisos**: Horários do próximo treino e card de destaque se houver um campeonato interno da academia agendado."

---

### ALU-02: Histórico Financeiro & Vencimento
* **Objetivo**: Permitir ao aluno consultar suas mensalidades passadas e futuras, datas de vencimento e orientações de pagamento à academia.
* **Layout**: Lista vertical de parcelas por mês/ano com status e bloco de dados PIX da academia.
* **Prompt para Geração/UI**:
> "Desenvolva a tela de Histórico Financeiro do Aluno. 
> **Header**: Resumo estilizado 'Sua mensalidade vence todo dia X'. 
> **Lista de Parcelas**: Timeline/Lista com as mensalidades do ano. Cada item exibe: Mês/Ano (ex: 'Agosto 2026'), Data de Vencimento, Valor (ex: R$ 150,00), e Badge de Status (🟢 Pago em 08/08, 🟡 A Vencer, 🔴 Pendente). 
> **Bloco de Instruções de Pagamento**: Caixa explicativa 'Como Pagar a Mensalidade': Chave PIX da Academia (com botão 'Copiar Chave PIX') e instrução: 'Após realizar o PIX ou pagamento em dinheiro, apresente o comprovante ao professor para baixa no sistema'."

---

### ALU-03: Campeonatos Internos & Minhas Chaves
* **Objetivo**: Permitir ao aluno visualizar os campeonatos internos da sua academia, confirmar participação na sua categoria e acompanhar a chave no tatame.
* **Layout**: Painel com abas ('Torneios Internos da Academia' e 'Minha Chave de Lutas').
* **Prompt para Geração/UI**:
> "Crie a tela de Campeonatos Internos na visão do Aluno. 
> **Aba 1 (Torneios Internos da Academia)**: Cards dos campeonatos internos promovidos pelo seu professor, com data, horário no tatame e botão 'Confirmar Minha Participação'. 
> **Aba 2 (Minha Chave no Tatame)**: Se o aluno estiver participando de um campeonato interno ativo, exibe a sua Categoria (ex: 'Adulto Azul Médio') e um card em tempo real: 'Sua Próxima Luta: Luta #4 no Tatame Principal - Contra [Nome do Colega de Treino]'. Árvore simplificada da chave da categoria."
