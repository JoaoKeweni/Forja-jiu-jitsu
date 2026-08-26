"use client";

import { useState } from "react";
import Link from "next/link";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

export default function StudentPaymentsPage() {
  const [toastMessage, setToastMessage] = useState("");
  const pixKey = "pix@graciebarramatriz.com.br";

  const payments = [
    { month: "Agosto 2026", dueDate: "10/08/2026", amount: "R$ 150,00", status: "paid", statusText: "🟢 Pago em 08/08" },
    { month: "Julho 2026", dueDate: "10/07/2026", amount: "R$ 150,00", status: "paid", statusText: "🟢 Pago em 09/07" },
    { month: "Junho 2026", dueDate: "10/06/2026", amount: "R$ 150,00", status: "paid", statusText: "🟢 Pago em 10/06" },
    { month: "Maio 2026", dueDate: "10/05/2026", amount: "R$ 150,00", status: "paid", statusText: "🟢 Pago em 05/05" },
  ];

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setToastMessage("📋 Chave PIX copiada para a área de transferência!");
  };

  return (
    <main className="min-h-screen bg-background text-on-surface p-4 sm:p-6 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-on-surface-variant pt-2">
          <Link href="/aluno/perfil" className="hover:text-primary transition-colors">
            Perfil do Atleta
          </Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Histórico Financeiro</span>
        </div>

        <div>
          <h1 className="font-display font-bold text-2xl text-on-surface">Minhas Mensalidades</h1>
          <p className="text-xs text-on-surface-variant">Vencimento todo dia 10 de cada mês.</p>
        </div>

        {/* PIX Payment Box */}
        <div className="bg-gradient-to-br from-primary-container/20 to-surface-container border border-primary-container/40 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl">qr_code_2</span>
            <div>
              <h3 className="font-bold text-sm text-on-surface">Pagamento via PIX Direto</h3>
              <p className="text-xs text-on-surface-variant">Envie para a conta oficial da academia.</p>
            </div>
          </div>

          <div className="bg-black/60 p-3 rounded-lg border border-white/10 font-mono text-xs text-primary flex items-center justify-between">
            <span className="truncate">{pixKey}</span>
            <button
              onClick={handleCopyPix}
              className="bg-primary-container hover:bg-secondary-container text-white px-2.5 py-1 rounded text-[11px] font-sans font-bold transition-all cursor-pointer flex-shrink-0 ml-2"
            >
              Copiar
            </button>
          </div>

          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            ℹ️ Após o pagamento, apresente o comprovante ao professor no tatame ou WhatsApp para dar baixa na sua planilha.
          </p>
        </div>

        {/* History List */}
        <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg space-y-4">
          <h3 className="font-bold text-sm text-on-surface font-display">Histórico de Parcelas</h3>

          <div className="space-y-3">
            {payments.map((p, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-surface-dim rounded-lg border border-outline-variant/30 text-xs"
              >
                <div>
                  <div className="font-bold text-on-surface">{p.month}</div>
                  <div className="text-[11px] text-on-surface-variant">Vencimento: {p.dueDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-on-surface">{p.amount}</div>
                  <div className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">{p.statusText}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
