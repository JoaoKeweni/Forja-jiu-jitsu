"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import TeamSelector from "@/components/ui/TeamSelector";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

type PaymentStatus = "paid" | "pending" | "overdue" | "exempt";

interface StudentPaymentRecord {
  id: string;
  name: string;
  phone: string;
  dueDay: number;
  months: Record<string, PaymentStatus>;
}

export default function FinancialPage() {
  const monthKeys = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const [records, setRecords] = useState<StudentPaymentRecord[]>([
    {
      id: "1",
      name: "Lucas Almeida Silva",
      phone: "5511977772222",
      dueDay: 10,
      months: { Jan: "paid", Fev: "paid", Mar: "paid", Abr: "paid", Mai: "paid", Jun: "paid", Jul: "paid", Ago: "paid", Set: "pending", Out: "pending", Nov: "pending", Dez: "pending" },
    },
    {
      id: "2",
      name: "Matheus Henrique",
      phone: "5511966663333",
      dueDay: 15,
      months: { Jan: "paid", Fev: "paid", Mar: "paid", Abr: "paid", Mai: "paid", Jun: "paid", Jul: "paid", Ago: "paid", Set: "pending", Out: "pending", Nov: "pending", Dez: "pending" },
    },
    {
      id: "3",
      name: "Rafael Costa",
      phone: "5511955554444",
      dueDay: 10,
      months: { Jan: "paid", Fev: "paid", Mar: "paid", Abr: "paid", Mai: "paid", Jun: "paid", Jul: "overdue", Ago: "overdue", Set: "pending", Out: "pending", Nov: "pending", Dez: "pending" },
    },
    {
      id: "4",
      name: "Bruno Lima",
      phone: "5511944445555",
      dueDay: 5,
      months: { Jan: "paid", Fev: "paid", Mar: "paid", Abr: "paid", Mai: "paid", Jun: "paid", Jul: "paid", Ago: "paid", Set: "pending", Out: "pending", Nov: "pending", Dez: "pending" },
    },
  ]);

  const [selectedCell, setSelectedCell] = useState<{ studentId: string; studentName: string; month: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "dinheiro" | "cartao">("pix");
  const [toastMessage, setToastMessage] = useState("");

  const handleCellClick = (studentId: string, studentName: string, month: string, currentStatus: PaymentStatus) => {
    if (currentStatus === "paid") return;
    setSelectedCell({ studentId, studentName, month });
  };

  const handleConfirmPayment = () => {
    if (!selectedCell) return;
    setRecords((prev) =>
      prev.map((r) => {
        if (r.id === selectedCell.studentId) {
          return {
            ...r,
            months: {
              ...r.months,
              [selectedCell.month]: "paid",
            },
          };
        }
        return r;
      })
    );
    setToastMessage(`🟢 Baixa efetuada para ${selectedCell.studentName} (${selectedCell.month}) via ${paymentMethod.toUpperCase()}`);
    setSelectedCell(null);
  };

  return (
    <main class="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header />

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-2 text-xs text-on-surface-variant my-4">
          <Link href="/professor/dashboard" class="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <span class="text-on-surface font-bold">Planilha Financeira</span>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 class="font-display font-bold text-2xl text-on-surface">Planilha Inteligente de Mensalidades</h1>
            <p class="text-xs text-on-surface-variant">
              Controle de mensalidades presencial sem gateway. Baixa manual em 1 clique.
            </p>
          </div>
          <TeamSelector />
        </div>

        {/* Legend Banner */}
        <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-4 text-xs font-mono">
          <span class="text-on-surface-variant font-bold">Legenda:</span>
          <span class="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/30">
            🟢 Pago
          </span>
          <span class="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded border border-amber-500/30">
            🟡 A Vencer
          </span>
          <span class="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2.5 py-1 rounded border border-red-500/30">
            🔴 Atrasado
          </span>
          <span class="inline-flex items-center gap-1 bg-stone-500/20 text-stone-300 px-2.5 py-1 rounded border border-stone-500/30">
            ⚪ Isento
          </span>
        </div>

        {/* Financial Spreadsheet Table */}
        <div class="bg-surface-container border border-outline-variant/40 rounded-xl p-4 shadow-xl overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-outline-variant/30 text-on-surface-variant uppercase font-mono">
                <th class="py-3 px-4 min-w-[200px]">Aluno</th>
                <th class="py-3 px-2 text-center">Dia</th>
                {monthKeys.map((m) => (
                  <th key={m} class="py-3 px-2 text-center min-w-[60px]">
                    {m}
                  </th>
                ))}
                <th class="py-3 px-4 text-right">Cobrança</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/20">
              {records.map((r) => {
                const hasOverdue = Object.values(r.months).includes("overdue");
                return (
                  <tr key={r.id} class="hover:bg-surface-variant/20 transition-colors">
                    <td class="py-3 px-4 font-bold text-on-surface">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-full bg-surface-dim border border-outline-variant/40 flex items-center justify-center text-xs font-bold text-primary">
                          {r.name.charAt(0)}
                        </div>
                        <span>{r.name}</span>
                      </div>
                    </td>
                    <td class="py-3 px-2 text-center font-mono text-on-surface-variant">Dia {r.dueDay}</td>
                    {monthKeys.map((m) => {
                      const st = r.months[m] || "pending";
                      return (
                        <td key={m} class="py-3 px-2 text-center">
                          <button
                            onClick={() => handleCellClick(r.id, r.name, m, st)}
                            title={st === "paid" ? "Baixa efetuada" : "Clique para dar baixa manual"}
                            class={`w-8 h-8 rounded-lg font-bold text-[10px] inline-flex items-center justify-center transition-all cursor-pointer ${
                              st === "paid"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : st === "overdue"
                                ? "bg-red-500/30 text-red-400 border border-red-500/60 animate-pulse hover:scale-110"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:scale-110"
                            }`}
                          >
                            {st === "paid" ? "✓" : st === "overdue" ? "!" : "•"}
                          </button>
                        </td>
                      );
                    })}
                    <td class="py-3 px-4 text-right">
                      {hasOverdue && (
                        <a
                          href={`https://wa.me/${r.phone}?text=Olá%20${encodeURIComponent(r.name)},%20notamos%20que%20sua%20mensalidade%20está%20pendente.%20Favor%20acertar%20na%20recepção.`}
                          target="_blank"
                          rel="noreferrer"
                          class="inline-flex items-center gap-1 bg-emerald-600/90 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-[11px] font-bold transition-all shadow"
                        >
                          <span class="material-symbols-outlined text-xs">chat</span>
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Payment Baixa Modal */}
      <Modal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        title={`💳 Dar Baixa Manual — Mês de ${selectedCell?.month}`}
      >
        <div class="space-y-4">
          <p class="text-xs text-on-surface-variant">
            Confirmar recebimento da mensalidade de R$ 150,00 para <strong>{selectedCell?.studentName}</strong>?
          </p>

          <div>
            <label class="block text-xs font-bold text-on-surface mb-1">Forma de Pagamento Recebida</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                class={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  paymentMethod === "pix"
                    ? "bg-primary-container text-white border-primary-container"
                    : "bg-surface-dim border-outline-variant/40 text-on-surface-variant"
                }`}
              >
                📱 PIX Direto
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("dinheiro")}
                class={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  paymentMethod === "dinheiro"
                    ? "bg-primary-container text-white border-primary-container"
                    : "bg-surface-dim border-outline-variant/40 text-on-surface-variant"
                }`}
              >
                💵 Dinheiro
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("cartao")}
                class={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                  paymentMethod === "cartao"
                    ? "bg-primary-container text-white border-primary-container"
                    : "bg-surface-dim border-outline-variant/40 text-on-surface-variant"
                }`}
              >
                💳 Maquineta
              </button>
            </div>
          </div>

          <button
            onClick={handleConfirmPayment}
            class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-lg cursor-pointer mt-4"
          >
            Confirmar Baixa na Planilha
          </button>
        </div>
      </Modal>

      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
