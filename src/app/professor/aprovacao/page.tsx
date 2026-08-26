"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

export default function StudentApprovalPage() {
  const [requests, setRequests] = useState([
    {
      id: "1",
      name: "Gabriel Santos",
      email: "gabriel.santos@email.com",
      phone: "(11) 98765-4321",
      team: "Equipe Adulto Noite",
      requestedAt: "Hoje, 14:30",
      belt: "branca",
      degrees: 0,
      dueDay: 10,
    },
    {
      id: "2",
      name: "Mariana Oliveira",
      email: "mariana.oli@email.com",
      phone: "(11) 97654-3210",
      team: "Equipe Adulto Noite",
      requestedAt: "Hoje, 11:15",
      belt: "azul",
      degrees: 1,
      dueDay: 5,
    },
  ]);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "warning" | "error">("success");

  const handleApprove = (id: string, name: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    setToastType("success");
    setToastMessage(`✅ Aluno '${name}' aprovado com sucesso!`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests(requests.filter((r) => r.id !== id));
    setToastType("warning");
    setToastMessage(`🔴 Solicitação de '${name}' recusada.`);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header pendingCount={requests.length} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant my-4">
          <Link href="/professor/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Moderação de Alunos</span>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface">Fila de Moderação</h1>
            <p className="text-xs text-on-surface-variant">
              Examine e autorize a entrada de novos praticantes na sua equipe.
            </p>
          </div>
          <span className="bg-primary-container/20 text-primary border border-primary-container/40 text-xs font-mono font-bold px-3 py-1 rounded-full">
            {requests.length} solicitações pendentes
          </span>
        </div>

        {requests.length === 0 ? (
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl p-12 text-center space-y-3 shadow-xl">
            <span className="material-symbols-outlined text-emerald-400 text-5xl">task_alt</span>
            <h3 className="font-display font-bold text-lg text-on-surface">Fila Vazia!</h3>
            <p className="text-xs text-on-surface-variant">Não há nenhuma solicitação pendente no momento.</p>
            <Link
              href="/professor/dashboard"
              className="inline-flex items-center gap-1 text-xs bg-primary-container text-white px-4 py-2 rounded-lg font-bold hover:bg-secondary-container transition-all mt-2"
            >
              <span>Voltar ao Dashboard</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-surface-container border border-outline-variant/40 rounded-xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-in"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-dim border border-outline-variant/50 flex items-center justify-center text-on-surface-variant font-bold text-lg flex-shrink-0">
                    {req.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-on-surface">{req.name}</h3>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-sm">mail</span> {req.email}
                    </p>
                    <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-sm text-emerald-400">phone</span> {req.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] bg-surface-dim border border-outline-variant/40 text-on-surface-variant px-2.5 py-0.5 rounded font-mono">
                        Solicitado em: {req.requestedAt}
                      </span>
                      <span className="text-[11px] bg-primary-container/20 text-primary border border-primary-container/40 px-2 py-0.5 rounded font-mono font-bold">
                        {req.team}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto border-t md:border-t-0 border-outline-variant/30 pt-4 md:pt-0">
                  <button
                    onClick={() => handleApprove(req.id, req.name)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Aprovar Matrícula</span>
                  </button>
                  <button
                    onClick={() => handleReject(req.id, req.name)}
                    className="bg-surface border border-error-container/50 text-error hover:bg-error-container/20 font-bold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">cancel</span>
                    <span>Recusar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} type={toastType} />
      <DemoSwitcher />
    </main>
  );
}
