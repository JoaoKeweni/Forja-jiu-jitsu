"use client";

import Header from "@/components/ui/Header";
import TeamSelector from "@/components/ui/TeamSelector";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

export default function ProfessorDashboard() {
  return (
    <main className="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header pendingCount={2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar with Team Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 my-6">
          <div>
            <h1 className="font-display font-black text-2xl text-on-surface">Painel do Professor</h1>
            <p className="text-xs text-on-surface-variant">Gerencie suas equipes, pagamentos e alunos no tatame.</p>
          </div>
          <TeamSelector />
        </div>

        {/* Pending Approval Banner */}
        <div className="bg-primary-container/20 border border-primary-container/50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl animate-pulse">notifications_active</span>
            <div>
              <div className="font-bold text-sm text-on-surface">
                Existem 2 solicitações de alunos aguardando sua aprovação
              </div>
              <div className="text-xs text-on-surface-variant">
                Novas matrículas pendentes para inclusão na equipe selecionada.
              </div>
            </div>
          </div>
          <Link
            href="/professor/aprovacao"
            className="bg-primary-container hover:bg-secondary-container text-white text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-1 shadow cursor-pointer whitespace-nowrap"
          >
            <span>Ver Fila de Moderação</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Alunos na Equipe</span>
              <span className="material-symbols-outlined text-primary text-xl">groups</span>
            </div>
            <div className="text-3xl font-bold font-display text-on-surface">24</div>
            <div className="text-[11px] text-emerald-400 mt-1">100% ativos nesta turma</div>
          </div>

          <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Adimplência do Mês</span>
              <span className="material-symbols-outlined text-emerald-400 text-xl">verified</span>
            </div>
            <div className="text-3xl font-bold font-display text-emerald-400">91.6%</div>
            <div className="text-[11px] text-on-surface-variant mt-1">22 de 24 mensalidades pagas</div>
          </div>

          <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Pagamentos Pendentes</span>
              <span className="material-symbols-outlined text-amber-400 text-xl">payments</span>
            </div>
            <div className="text-3xl font-bold font-display text-amber-400">2</div>
            <div className="text-[11px] text-on-surface-variant mt-1">Vencimento próximo ou atrasado</div>
          </div>

          <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
            <div className="flex justify-between items-center text-on-surface-variant mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Próximo Torneio</span>
              <span className="material-symbols-outlined text-tertiary text-xl">emoji_events</span>
            </div>
            <div className="text-xl font-bold font-display text-on-surface truncate">1º Torneio Forja</div>
            <div className="text-[11px] text-tertiary mt-1">Em 15 dias no Tatame 1</div>
          </div>
        </div>

        {/* Quick Module Shortcuts */}
        <h2 className="font-display font-bold text-lg text-on-surface mb-4">Módulos da Academia</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/professor/aprovacao"
            className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-primary/60 transition-all group flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-primary text-3xl group-hover:scale-110 transition-transform">
                how_to_reg
              </span>
              <span className="bg-primary-container text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                2 Pendentes
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">
                Fila de Moderação
              </h3>
              <p className="text-xs text-on-surface-variant">Aprovar ou recusar solicitações de novos alunos</p>
            </div>
          </Link>

          <Link
            href="/professor/financeiro"
            className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-emerald-500/60 transition-all group flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-emerald-400 text-3xl group-hover:scale-110 transition-transform">
                table_chart
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-emerald-400 transition-colors">
                Planilha Financeira
              </h3>
              <p className="text-xs text-on-surface-variant">Baixa manual de parcelas (PIX/Dinheiro)</p>
            </div>
          </Link>

          <Link
            href="/professor/alunos"
            className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-tertiary/60 transition-all group flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-tertiary text-3xl group-hover:scale-110 transition-transform">
                badge
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-tertiary transition-colors">
                Gestão de Alunos
              </h3>
              <p className="text-xs text-on-surface-variant">Listagem por faixa, graus e histórico</p>
            </div>
          </Link>

          <Link
            href="/professor/campeonatos"
            className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 hover:border-amber-400/60 transition-all group flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined text-amber-400 text-3xl group-hover:scale-110 transition-transform">
                workspace_premium
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface group-hover:text-amber-400 transition-colors">
                Campeonatos Internos
              </h3>
              <p className="text-xs text-on-surface-variant">Criar torneios, pesagem e chaveamento</p>
            </div>
          </Link>
        </div>
      </div>

      <DemoSwitcher />
    </main>
  );
}
