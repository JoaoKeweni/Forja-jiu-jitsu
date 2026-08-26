"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import TeamSelector from "@/components/ui/TeamSelector";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

export default function StudentManagementPage() {
  const [search, setSearch] = useState("");
  const [selectedBelt, setSelectedBelt] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [students] = useState([
    {
      id: "1",
      name: "Lucas Almeida Silva",
      belt: "azul",
      degrees: 2,
      phone: "(11) 97777-2222",
      dueDay: 10,
      paymentStatus: "paid",
      status: "active",
    },
    {
      id: "2",
      name: "Matheus Henrique",
      belt: "branca",
      degrees: 4,
      phone: "(11) 96666-3333",
      dueDay: 15,
      paymentStatus: "paid",
      status: "active",
    },
    {
      id: "3",
      name: "Rafael Costa",
      belt: "roxa",
      degrees: 1,
      phone: "(11) 95555-4444",
      dueDay: 10,
      paymentStatus: "overdue",
      status: "active",
    },
    {
      id: "4",
      name: "Bruno Lima",
      belt: "preta",
      degrees: 2,
      phone: "(11) 94444-5555",
      dueDay: 5,
      paymentStatus: "paid",
      status: "active",
    },
  ]);

  const beltColors: Record<string, { bg: string; text: string; border: string }> = {
    branca: { bg: "bg-stone-200", text: "text-stone-900", border: "border-stone-400" },
    azul: { bg: "bg-blue-600", text: "text-white", border: "border-blue-400" },
    roxa: { bg: "bg-purple-600", text: "text-white", border: "border-purple-400" },
    marrom: { bg: "bg-amber-900", text: "text-amber-100", border: "border-amber-700" },
    preta: { bg: "bg-stone-950", text: "text-red-500", border: "border-red-600" },
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesBelt = selectedBelt === "all" || s.belt === selectedBelt;
    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
    return matchesSearch && matchesBelt && matchesStatus;
  });

  return (
    <main class="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 text-xs text-on-surface-variant my-4">
          <Link href="/professor/dashboard" class="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span class="text-on-surface font-bold">Gestão de Alunos</span>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 class="font-display font-bold text-2xl text-on-surface">Gestão de Alunos</h1>
            <p class="text-xs text-on-surface-variant">Listagem e graduação dos atletas da equipe.</p>
          </div>
          <TeamSelector />
        </div>

        {/* Filters */}
        <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div class="flex-1 relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar aluno por nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              class="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2 pl-10 pr-3 text-xs text-on-surface outline-none focus:border-primary-container"
            />
          </div>

          <div class="flex gap-2">
            <select
              value={selectedBelt}
              onChange={(e) => setSelectedBelt(e.target.value)}
              class="bg-surface-dim border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-on-surface outline-none cursor-pointer"
            >
              <option value="all">Todas as Faixas</option>
              <option value="branca">Faixa Branca</option>
              <option value="azul">Faixa Azul</option>
              <option value="roxa">Faixa Roxa</option>
              <option value="marrom">Faixa Marrom</option>
              <option value="preta">Faixa Preta</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              class="bg-surface-dim border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-on-surface outline-none cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
            </select>
          </div>
        </div>

        {/* Student Cards Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s) => {
            const beltStyle = beltColors[s.belt] || beltColors.branca;
            return (
              <div
                key={s.id}
                class="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg flex flex-col justify-between hover:border-primary/50 transition-all"
              >
                <div>
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full bg-surface-dim border border-outline-variant/50 flex items-center justify-center font-bold text-on-surface">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h3 class="font-bold text-sm text-on-surface">{s.name}</h3>
                        <p class="text-xs text-on-surface-variant">{s.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Belt Badge */}
                  <div class="mt-2 flex items-center justify-between">
                    <div
                      class={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${beltStyle.bg} ${beltStyle.text} ${beltStyle.border}`}
                    >
                      <span>Faixa {s.belt}</span>
                      <span class="text-[10px] opacity-80">({s.degrees} Graus)</span>
                    </div>

                    <span class="text-xs text-on-surface-variant font-mono">
                      Venc. dia {s.dueDay}
                    </span>
                  </div>
                </div>

                <div class="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-center text-xs">
                  <span
                    class={`px-2 py-0.5 rounded font-bold ${
                      s.paymentStatus === "paid"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {s.paymentStatus === "paid" ? "🟢 Adimplente" : "🔴 Mensalidade Pendente"}
                  </span>

                  <button class="text-primary hover:underline font-bold flex items-center gap-0.5">
                    <span>Editar Aluno</span>
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <DemoSwitcher />
    </main>
  );
}
