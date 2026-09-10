"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

interface WeeklyPayment {
  id: string;
  name: string;
  initials: string;
  plan: string;
  dueText: string;
  status: "pendente" | "atrasado" | "a-vencer" | "pago";
  statusLabel: string;
}

export default function ProfessorDashboard() {
  const [toastMessage, setToastMessage] = useState("");
  const [payments, setPayments] = useState<WeeklyPayment[]>([
    { id: "lucas", name: "Lucas Moraes", initials: "LM", plan: "Anual Ouro", dueText: "Hoje", status: "pendente", statusLabel: "Pendente" },
    { id: "amanda", name: "Amanda Silva", initials: "AS", plan: "Mensal", dueText: "Atrasado (2 dias)", status: "atrasado", statusLabel: "Atrasado" },
    { id: "rafael", name: "Rafael Costa", initials: "RC", plan: "Semestral Prata", dueText: "Em 3 dias", status: "a-vencer", statusLabel: "A Vencer" },
  ]);

  const markPaid = (id: string, name: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "pago" as const, statusLabel: "PAGO ✓" } : p
      )
    );
    setToastMessage(`Pagamento de ${name} baixado com sucesso!`);
  };

  const sendWhatsApp = (name: string) => {
    setToastMessage(`Abrindo cobrança via WhatsApp para ${name}...`);
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-tertiary/20 text-tertiary";
      case "atrasado":
        return "bg-error/20 text-error border border-error/50";
      case "a-vencer":
        return "bg-surface-variant text-on-surface-variant";
      case "pago":
        return "bg-[#10B981]/20 text-[#10B981]";
      default:
        return "";
    }
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-on-background font-body-md text-body-md overflow-x-hidden">
      <Header pendingCount={3} />

      <div className="pt-24 pb-32 md:pb-24 px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto w-full flex flex-col gap-8">
        {/* Mobile Team Selector */}
        <div className="w-full md:hidden">
          <select className="w-full bg-surface-container border border-outline-variant rounded-lg p-3 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary appearance-none font-label-bold text-label-bold">
            <option>🥋 Equipe Adulto Noite</option>
            <option>🥋 Kids &amp; Juvenil Manhã</option>
            <option>🥋 Competição Matutino</option>
          </select>
        </div>

        {/* Moderation Banner */}
        <div className="bg-error-container/20 border border-error-container rounded-xl p-4 flex items-center justify-between shadow-[0_0_15px_rgba(185,28,28,0.1)]">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              notifications_active
            </span>
            <p className="font-body-md text-body-md text-on-surface">
              Existem <strong className="text-primary font-bold">3 novos alunos</strong> aguardando aprovação.
            </p>
          </div>
          <Link
            href="/professor/aprovacao"
            className="bg-primary text-on-primary font-label-bold text-label-bold px-6 py-2 rounded-[2px] hover:bg-surface-tint transition-colors uppercase tracking-wider cursor-pointer whitespace-nowrap"
          >
            Ver Fila
          </Link>
        </div>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-surface-variant pb-4">
          <div>
            <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight mb-2">
              Visão Geral
            </h1>
            <p className="text-on-surface-variant font-body-lg text-body-lg">
              Acompanhe a performance e saúde financeira da sua academia.
            </p>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KPI 1: Alunos Ativos */}
          <Link
            href="/professor/alunos"
            className="bg-surface-container border border-surface-variant rounded-xl p-6 relative overflow-hidden group hover:border-outline-variant transition-colors cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span
                className="material-symbols-outlined text-6xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                groups
              </span>
            </div>
            <h3 className="text-on-surface-variant font-label-bold text-label-bold uppercase tracking-widest mb-2">
              Alunos Ativos
            </h3>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-display-lg text-on-surface leading-none">142</span>
              <span className="text-[#4ade80] font-label-bold text-label-bold flex items-center mb-1">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12%
              </span>
            </div>
          </Link>

          {/* KPI 2: Adimplência */}
          <Link
            href="/professor/financeiro"
            className="bg-surface-container border border-surface-variant rounded-xl p-6 relative overflow-hidden group hover:border-outline-variant transition-colors border-t-2 border-t-tertiary cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span
                className="material-symbols-outlined text-6xl text-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trending_up
              </span>
            </div>
            <h3 className="text-on-surface-variant font-label-bold text-label-bold uppercase tracking-widest mb-2">
              Adimplência
            </h3>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-display-lg text-tertiary leading-none">94%</span>
              <span className="text-on-surface-variant font-label-bold text-label-bold mb-1">Ótimo</span>
            </div>
          </Link>

          {/* KPI 3: Mensalidades Atrasadas */}
          <Link
            href="/professor/financeiro"
            className="bg-surface-container border border-surface-variant rounded-xl p-6 relative overflow-hidden group hover:border-error transition-colors border-l-2 border-l-error cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span
                className="material-symbols-outlined text-6xl text-error"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <h3 className="text-on-surface-variant font-label-bold text-label-bold uppercase tracking-widest mb-2">
              Mensalidades Atrasadas
            </h3>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-display-lg text-error leading-none">8</span>
              <span className="text-on-surface-variant font-body-md text-body-md mb-1">R$ 1.240,00</span>
            </div>
          </Link>

          {/* KPI 4: Próx. Campeonatos */}
          <Link
            href="/professor/campeonatos"
            className="bg-surface-container border border-surface-variant rounded-xl p-6 relative overflow-hidden group hover:border-outline-variant transition-colors cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span
                className="material-symbols-outlined text-6xl text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                emoji_events
              </span>
            </div>
            <h3 className="text-on-surface-variant font-label-bold text-label-bold uppercase tracking-widest mb-2">
              Próx. Campeonatos
            </h3>
            <div className="flex items-end gap-3">
              <span className="font-display-lg text-display-lg text-on-surface leading-none">2</span>
              <span className="text-on-surface-variant font-body-md text-body-md mb-1">Inscrições abertas</span>
            </div>
          </Link>
        </div>

        {/* Weekly Payments Table */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Vencimentos da Semana</h2>
            <Link
              href="/professor/financeiro"
              className="border-2 border-primary text-primary font-label-bold text-label-bold px-4 py-2 rounded-[2px] hover:bg-primary/10 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Ver Todos
            </Link>
          </div>

          <div className="bg-surface-container border border-surface-variant rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-surface-variant">
                    <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase">Aluno</th>
                    <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase">Plano</th>
                    <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase">Vencimento</th>
                    <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase">Status</th>
                    <th className="p-4 font-label-bold text-label-bold text-on-surface-variant uppercase text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-bright/50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${p.id === "lucas" ? "bg-primary/20 text-primary" : "bg-surface-variant text-on-surface"}`}>
                          {p.initials}
                        </div>
                        <span className="font-body-md text-body-md text-on-surface font-bold">{p.name}</span>
                      </td>
                      <td className="p-4 text-on-surface-variant">{p.plan}</td>
                      <td className={`p-4 ${p.status === "atrasado" ? "text-error font-bold" : "text-on-surface"}`}>
                        {p.dueText}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${statusStyle(p.status)}`}>
                          {p.statusLabel}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => sendWhatsApp(p.name)}
                            className="p-2 rounded hover:bg-surface-variant text-[#25D366] transition-colors cursor-pointer"
                            title="Enviar Lembrete WhatsApp"
                          >
                            <span className="material-symbols-outlined text-[20px]">chat</span>
                          </button>
                          {p.status !== "pago" && (
                            <button
                              onClick={() => markPaid(p.id, p.name)}
                              className="p-2 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                              title="Registrar Pagamento"
                            >
                              <span
                                className="material-symbols-outlined text-[20px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                payments
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
