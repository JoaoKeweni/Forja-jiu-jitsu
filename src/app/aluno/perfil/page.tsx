"use client";

import Link from "next/link";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

export default function StudentProfilePage() {
  const student = {
    name: "Lucas Almeida Silva",
    belt: "azul",
    beltLabel: "Faixa Azul",
    beltColor: "#3b82f6",
    beltBorderColor: "#60a5fa",
    degrees: 2,
    registrationCode: "FORJA-2026-0842",
    academy: "Gracie Barra Matriz",
    team: "Equipe Adulto Noite",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6jhOKBIACzBwKMnOco9nOawem3_3QUGvdHcpryFelnO-068cbnzmtAdGRscqivEW4uZ1N8XnKCNXA_ULcYFjxho1zk9JNX-gJGaWAUS2oZAEHWUv-WMpSztsG0gN3VguEKBqLhfO4dnS9i4NA0MWnzT-NJa9r6zDO_5Au-zzcLqsCKZAgr-gX7Lj7QmntpX_3Ypf2sdX5qOnptFmngQCSBxdaiykFfgmd5nv-oYFZRDDLWoWpGVfX",
    paymentStatus: "paid",
    dueDate: "Todo dia 10",
  };

  return (
    <main className="min-h-screen bg-background text-on-surface p-4 sm:p-6 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary italic uppercase">FORJA</h1>
            <p className="text-[11px] text-on-surface-variant font-mono">Visão Atleta</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container/20 border border-primary-container/40 flex items-center justify-center text-primary font-bold">
            🥋
          </div>
        </div>

        {/* Digital Athlete ID Card */}
        <div className="relative bg-gradient-to-br from-[#1F2937] to-[#111827] border-2 border-primary-container/60 rounded-2xl p-6 shadow-2xl overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-container/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-primary uppercase">
                Carteirinha Digital do Atleta
              </span>
              <h2 className="font-bold text-lg text-on-surface mt-0.5">{student.name}</h2>
              <p className="text-xs text-on-surface-variant font-mono">{student.registrationCode}</p>
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg flex-shrink-0">
              <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Belt Visual */}
          <div className="bg-black/60 rounded-xl p-3.5 border border-white/10 my-4 relative z-10">
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-on-surface-variant uppercase font-bold">Graduação Atual</span>
              <span className="text-primary font-bold">{student.beltLabel} ({student.degrees} Graus)</span>
            </div>
            <div
              className="w-full h-7 rounded-md relative flex items-center justify-end px-2 shadow-inner"
              style={{ backgroundColor: student.beltColor, border: `1px solid ${student.beltBorderColor}` }}
            >
              <div className="w-14 h-full bg-black absolute right-4 flex items-center justify-center gap-1.5 border-l border-r border-stone-800">
                {Array.from({ length: student.degrees }).map((_, i) => (
                  <div key={i} className="w-1.5 h-full bg-white shadow-sm" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-on-surface-variant relative z-10 font-mono">
            <div><strong className="text-on-surface">Academia:</strong> {student.academy}</div>
            <div><strong className="text-on-surface">Equipe:</strong> {student.team}</div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="bg-surface-container border border-surface-variant rounded-xl p-5 shadow-lg space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[#22c55e] text-lg">verified</span>
              Status da Mensalidade
            </h3>
            <span className="text-xs bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 px-2.5 py-0.5 rounded-[4px] font-mono font-bold">
              Em Dia
            </span>
          </div>
          <p className="text-xs text-on-surface-variant">
            Sua parcela do mês de Agosto está regularizada. Vencimento: {student.dueDate}.
          </p>
          <Link
            href="/aluno/pagamentos"
            className="block w-full bg-surface-variant hover:bg-surface-bright text-on-surface text-center py-2.5 rounded-lg text-xs font-bold transition-all border border-outline-variant/40"
          >
            💳 Ver Histórico &amp; Chave PIX
          </Link>
        </div>

        {/* Next Training */}
        <div className="bg-surface-container border border-surface-variant rounded-xl p-5 shadow-lg space-y-2">
          <h3 className="font-bold text-sm text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-lg">schedule</span>
            Próximo Treino no Tatame
          </h3>
          <p className="text-xs text-on-surface-variant">
            Hoje às <strong>19:00</strong> — <em>Equipe Adulto Noite</em> (Prof. Marcus)
          </p>
        </div>
      </div>

      <DemoSwitcher />
    </main>
  );
}
