"use client";

import Header from "@/components/ui/Header";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

export default function InternalTournamentsPage() {
  const tournaments = [
    {
      id: "1",
      title: "1º Torneio Interno Forja 2026",
      date: "15 de Setembro, 2026",
      location: "Tatame Principal",
      athletesCount: 16,
      status: "Inscrições Abertas",
      statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
    },
    {
      id: "2",
      title: "Copa Inverno Interna de Jiu-Jitsu",
      date: "10 de Julho, 2026",
      location: "Tatame 2",
      athletesCount: 24,
      status: "Concluído",
      statusColor: "bg-stone-500/20 text-stone-300 border-stone-500/40",
    },
  ];

  return (
    <main className="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant my-4">
          <Link href="/professor/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Campeonatos Internos</span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Campeonatos Internos da Academia</h1>
            <p className="text-xs text-on-surface-variant">
              Competições exclusivas de tatame para integração e testes dos alunos matriculados.
            </p>
          </div>

          <Link
            href="/professor/campeonatos/novo"
            className="bg-primary-container hover:bg-secondary-container text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-primary-container/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>⚡ Criar Campeonato Interno</span>
          </Link>
        </div>

        {/* Tournament Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-primary/50 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${t.statusColor}`}
                  >
                    {t.status}
                  </span>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-sm">groups</span>
                    <span>{t.athletesCount} Alunos</span>
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl text-on-surface mb-2">{t.title}</h3>
                <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-sm text-primary">calendar_month</span> {t.date}
                </p>
                <p className="text-xs text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-tertiary">location_on</span> {t.location}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/30 flex flex-wrap gap-2">
                <Link
                  href="/professor/campeonatos/novo"
                  className="flex-1 bg-surface-variant hover:bg-surface-bright text-on-surface text-center py-2 px-3 rounded-lg text-xs font-bold transition-all border border-outline-variant/40"
                >
                  ⚙️ Categorias
                </Link>
                <Link
                  href={`/campeonato/${t.id}`}
                  className="flex-1 bg-primary-container hover:bg-secondary-container text-white text-center py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 shadow"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  <span>Chaves ao Vivo</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <DemoSwitcher />
    </main>
  );
}
