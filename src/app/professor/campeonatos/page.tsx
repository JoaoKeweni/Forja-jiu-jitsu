"use client";

import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

const tournaments = [
  {
    id: "1",
    title: "1º Torneio Interno Forja 2026",
    date: "15 Set 2026",
    status: "Inscrições Abertas",
    statusColor: "#22c55e",
    enrolled: 24,
    categories: 6,
  },
  {
    id: "2",
    title: "Copa Interna de Inverno",
    date: "20 Jul 2026",
    status: "Finalizado",
    statusColor: "#6b7280",
    enrolled: 32,
    categories: 8,
  },
  {
    id: "3",
    title: "Desafio Kids & Juvenil",
    date: "10 Out 2026",
    status: "Planejamento",
    statusColor: "#eab308",
    enrolled: 0,
    categories: 4,
  },
];

export default function GestaoCampeonatosPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-on-background font-body-md text-body-md pt-20 pb-32 md:pb-12">
      <Header pendingCount={3} />

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter">
        <div className="mb-6 mt-4 flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Campeonatos Internos</h1>
            <p className="text-on-surface-variant text-sm">{tournaments.length} torneios registrados</p>
          </div>
          <Link
            href="/professor/campeonatos/novo"
            className="bg-primary-container text-white font-label-bold text-label-bold px-5 py-2.5 rounded-lg hover:bg-secondary-container transition-all flex items-center gap-2 cursor-pointer btn-glow"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Novo Campeonato
          </Link>
        </div>

        <div className="space-y-4">
          {tournaments.map((t) => (
            <Link
              key={t.id}
              href={`/campeonato/${t.id}`}
              className="block bg-surface-container border border-surface-variant rounded-xl p-5 shadow-lg hover:border-outline-variant transition-colors group"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      emoji_events
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-on-surface group-hover:text-primary transition-colors">{t.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {t.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {t.enrolled} inscritos
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">category</span>
                        {t.categories} categorias
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className="inline-flex items-center px-3 py-1 rounded-[12px] text-xs font-bold uppercase tracking-wider border"
                  style={{
                    backgroundColor: `${t.statusColor}20`,
                    color: t.statusColor,
                    borderColor: `${t.statusColor}40`,
                  }}
                >
                  {t.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
      <DemoSwitcher />
    </main>
  );
}
