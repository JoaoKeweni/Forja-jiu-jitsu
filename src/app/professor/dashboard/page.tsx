"use client";

import Header from "@/components/ui/Header";
import TeamSelector from "@/components/ui/TeamSelector";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

export default function ProfessorDashboard() {
  return (
    <main class="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header pendingCount={2} />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar with Team Selector */}
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
          <div>
            <h1 class="font-display font-black text-2xl text-on-surface">Painel do Professor</h1>
            <p class="text-xs text-on-surface-variant">Gerencie suas equipes, pagamentos e alunos no tatame.</p>
          </div>
          <TeamSelector />
        </div>

        {/* Pending Approval Banner */}
        <div class="bg-primary-container/20 border border-primary-container/50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary text-2xl animate-pulse">notifications_active</span>
            <div>
              <div class="font-bold text-sm text-on-surface">
                Existem 2 solicitações de alunos aguardando sua aprovação
              </div>
              <div class="text-xs text-on-surface-variant">
                Novas matrículas pendentes para inclusão na equipe selecionada.
              </div>
            </div>
          </div>
          <Link
            href="/professor/aprovacao"
            class="bg-primary-container hover:bg-secondary-container text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1 shadow cursor-pointer whitespace-nowrap"
          >
            <span>Ver Fila de Moderação</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* KPI Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div class="flex justify-between items-center text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Alunos na Equipe</span>
              <span class="material-symbols-outlined text-primary text-xl">groups</span>
            </div>
            <div class="text-3xl font-bold font-display text-on-surface">24</div>
            <div class="text-[11px] text-emerald-400 mt-1">100% ativos nesta turma</div>
          </div>

          <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div class="flex justify-between items-center text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Adimplência do Mês</span>
              <span class="material-symbols-outlined text-emerald-400 text-xl">verified</span>
            </div>
            <div class="text-3xl font-bold font-display text-emerald-400">91.6%</div>
            <div class="text-[11px] text-on-surface-variant mt-1">22 de 24 mensalidades pagas</div>
          </div>

          <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div class="flex justify-between items-center text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Pagamentos Pendentes</span>
              <span class="material-symbols-outlined text-amber-400 text-xl">payments</span>
            </div>
            <div class="text-3xl font-bold font-display text-amber-400">2</div>
            <div class="text-[11px] text-on-surface-variant mt-1">Vencimento próximo ou atrasado</div>
          </div>

          <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div class="flex justify-between items-center text-on-surface-variant mb-2">
              <span class="text-xs font-bold uppercase tracking-wider">Próximo Torneio</span>
              <span class="material-symbols-outlined text-tertiary text-xl">emoji_events</span>
            </div>
            <div class="text-xl font-bold font-display text-on-surface truncate">1º Torneio Forja</div>
            <div class="text-[11px] text-tertiary mt-1">Em 15 dias no Tatame 1</div>
          </div>
        </div>

        {/* Quick Module Shortcuts */}
        <h2 class="font-display font-bold text-lg text-on-surface mb-4">Módulos da Academia</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/professor/aprovacao"
            class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-primary/60 transition-all group flex flex-col justify-between h-36"
          >
            <div class="flex justify-between items-start">
              <span class="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">
                how_to_reg
              </span>
              <span class="bg-primary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                2 Pendentes
              </span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Fila de Moderação
              </h3>
              <p class="text-xs text-on-surface-variant">Aprovar ou recusar solicitações de novos alunos</p>
            </div>
          </Link>

          <Link
            href="/professor/financeiro"
            class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-emerald-500/60 transition-all group flex flex-col justify-between h-36"
          >
            <div class="flex justify-between items-start">
              <span class="material-symbols-outlined text-emerald-400 text-3xl group-hover:scale-110 transition-transform">
                table_chart
              </span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface group-hover:text-emerald-400 transition-colors">
                Planilha Financeira
              </h3>
              <p class="text-xs text-on-surface-variant">Baixa manual de parcelas (PIX/Dinheiro)</p>
            </div>
          </Link>

          <Link
            href="/professor/alunos"
            class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-tertiary/60 transition-all group flex flex-col justify-between h-36"
          >
            <div class="flex justify-between items-start">
              <span class="material-symbols-outlined text-tertiary text-3xl group-hover:scale-110 transition-transform">
                badge
              </span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface group-hover:text-tertiary transition-colors">
                Gestão de Alunos
              </h3>
              <p class="text-xs text-on-surface-variant">Listagem por faixa, graus e histórico</p>
            </div>
          </Link>

          <Link
            href="/professor/campeonatos"
            class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-amber-400/60 transition-all group flex flex-col justify-between h-36"
          >
            <div class="flex justify-between items-start">
              <span class="material-symbols-outlined text-amber-400 text-3xl group-hover:scale-110 transition-transform">
                workspace_premium
              </span>
            </div>
            <div>
              <h3 class="font-bold text-sm text-on-surface group-hover:text-amber-400 transition-colors">
                Campeonatos Internos
              </h3>
              <p class="text-xs text-on-surface-variant">Criar torneios, pesagem e chaveamento</p>
            </div>
          </Link>
        </div>
      </div>

      <DemoSwitcher />
    </main>
  );
}
