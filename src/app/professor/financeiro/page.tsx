"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

type PayStatus = "paid" | "pending" | "late" | "exempt" | "future";

interface Student {
  name: string;
  belt: string;
  beltColor: string;
  photo?: string;
  initial?: string;
  months: PayStatus[];
}

const statusColors: Record<PayStatus, string> = {
  paid: "#22c55e",
  pending: "#eab308",
  late: "#ef4444",
  exempt: "#6b7280",
  future: "transparent",
};

export default function FinanceiroPage() {
  const monthLabels = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
  const currentMonthIndex = 3; // Abril

  const [students, setStudents] = useState<Student[]>([
    {
      name: "Carlos Silva", belt: "Faixa Azul", beltColor: "#3b82f6",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6jhOKBIACzBwKMnOco9nOawem3_3QUGvdHcpryFelnO-068cbnzmtAdGRscqivEW4uZ1N8XnKCNXA_ULcYFjxho1zk9JNX-gJGaWAUS2oZAEHWUv-WMpSztsG0gN3VguEKBqLhfO4dnS9i4NA0MWnzT-NJa9r6zDO_5Au-zzcLqsCKZAgr-gX7Lj7QmntpX_3Ypf2sdX5qOnptFmngQCSBxdaiykFfgmd5nv-oYFZRDDLWoWpGVfX",
      months: ["paid", "paid", "paid", "late", "future", "future"],
    },
    {
      name: "Ana Paula", belt: "Faixa Roxa", beltColor: "#a855f7",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk4es2gSXHw7QQvFi2p61Migy3K8w8L4u5ShK3TNP3KNFYqnH2om5mZgtaMc5ZXeSsmcfP_-ZAqwHzpL5vak6EoFn2RBX2jc2B0_gyYlyNE02nKymvUjmZXZUSUQ763yxNC_3HRW1MGOEoXAIr0UMMNbrQCuMAxHvEJZOH-ozGgUYWFcV7bQpoKWLz8ZPcSRRtmt6evPmOF9Prp3Op9gauh7teF1oP4QcX-kNDbuhMzXm0iOrSRYuuI",
      months: ["paid", "paid", "paid", "paid", "pending", "future"],
    },
    {
      name: "Mestre Roberto", belt: "Prof. (Isento)", beltColor: "#9ca3af",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmpEw0-EjzCL14-rPPv-5QgsgL5XoJ1EZtGmGJSNpO6q4InhzGzvKzLMud7kaO03mSKm522B0Wsab7X5Hu3fni0DQSvYqA2XD5e2iv58k-kt2GR02TqsDJbO_a7xyKphxBKc08xvviQZ52ZH_RutrUaVgRnEP5ArMyKUbJZo3kmdYUSla9bBKJSkPXHPPCDfQU6NLpj-JBsZLn7Lyy2RrjEpofCQiZxL3Vwn5lK7DqSsUJQ7dUIXJ8",
      months: ["exempt", "exempt", "exempt", "exempt", "exempt", "exempt"],
    },
    {
      name: "Lucas Mendes", belt: "Faixa Branca", beltColor: "#9ca3af",
      initial: "L",
      months: ["paid", "late", "late", "late", "future", "future"],
    },
  ]);

  const [selectedCell, setSelectedCell] = useState<{ studentIdx: number; monthIdx: number } | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [adimplencia, setAdimplencia] = useState("85%");
  const [recebimentos, setRecebimentos] = useState("R$ 4.200,00");
  const [pendenciasCount, setPendenciasCount] = useState("2 alunos em atraso");

  const handleCellClick = (studentIdx: number, monthIdx: number) => {
    const status = students[studentIdx].months[monthIdx];
    if (status === "late" || status === "pending") {
      setSelectedCell({ studentIdx, monthIdx });
    }
  };

  const confirmBaixa = (method: string) => {
    if (!selectedCell) return;
    setStudents((prev) => {
      const copy = [...prev];
      copy[selectedCell.studentIdx] = {
        ...copy[selectedCell.studentIdx],
        months: copy[selectedCell.studentIdx].months.map((m, i) =>
          i === selectedCell.monthIdx ? "paid" as PayStatus : m
        ),
      };
      return copy;
    });
    setAdimplencia("92%");
    setRecebimentos("R$ 4.350,00");
    setPendenciasCount("1 aluno em atraso");
    setToastMessage(`✅ Baixa de R$ 150,00 via ${method} realizada para ${students[selectedCell.studentIdx].name}!`);
    setSelectedCell(null);
  };

  const renderStatusDot = (status: PayStatus, studentIdx: number, monthIdx: number, isCurrent: boolean) => {
    if (status === "future") {
      return <div className="w-2 h-2 rounded-full bg-surface-variant" />;
    }
    if (status === "exempt") {
      return <div className="w-2 h-2 rounded-full bg-[#6b7280]" />;
    }

    const color = statusColors[status];
    const isClickable = status === "late" || status === "pending";
    const isLateGlow = status === "late" && isCurrent;

    return (
      <button
        onClick={() => isClickable && handleCellClick(studentIdx, monthIdx)}
        className={`status-badge bg-[${color}]/20 border border-[${color}]/50 ${
          isClickable ? "cursor-pointer" : ""
        } ${isLateGlow ? "ring-2 ring-[#ef4444]/30 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)]" : ""}`}
        style={{
          backgroundColor: `${color}20`,
          borderColor: `${color}80`,
        }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      </button>
    );
  };

  return (
    <main className="min-h-screen bg-surface-container-low text-on-background font-body-md text-body-md antialiased pb-24 md:pb-0 pt-20">
      <Header pendingCount={3} />

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter pt-4">
        {/* Title */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Planilha Inteligente</h2>
            <p className="text-on-surface-variant mt-1 text-sm">Controle Financeiro - 2026</p>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="border border-surface-variant rounded-xl p-4 flex flex-col justify-center items-start shadow-sm bg-surface-container">
            <p className="text-xs text-on-surface-variant font-label-bold uppercase tracking-wider mb-1">Adimplência</p>
            <p className="text-2xl font-display-lg-mobile text-[#22c55e]">{adimplencia}</p>
          </div>
          <div className="border border-surface-variant rounded-xl p-4 flex flex-col justify-center items-start shadow-sm bg-surface-container">
            <p className="text-xs text-on-surface-variant font-label-bold uppercase tracking-wider mb-1">Recebimentos</p>
            <p className="text-2xl font-display-lg-mobile text-on-surface">{recebimentos}</p>
          </div>
          <div className="border border-surface-variant rounded-xl p-4 flex flex-col justify-center items-start shadow-sm col-span-2 md:col-span-2 bg-surface-container">
            <p className="text-xs text-on-surface-variant font-label-bold uppercase tracking-wider mb-1">Pendências (Abril)</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex -space-x-2">
                {students[0].photo && (
                  <img alt="Atleta" className="w-8 h-8 rounded-full border-2 border-surface-container-low object-cover" src={students[0].photo} />
                )}
                <div className="w-8 h-8 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center text-xs font-bold">L</div>
              </div>
              <p className="text-sm font-bold text-[#ef4444]">{pendenciasCount}</p>
            </div>
          </div>
        </div>

        {/* Legend/Filters */}
        <div className="overflow-x-auto pb-4 mb-2 spreadsheet-container">
          <div className="flex gap-2 min-w-max">
            {[
              { color: "#22c55e", label: "Pago", glow: true },
              { color: "#eab308", label: "A Vencer", glow: true },
              { color: "#ef4444", label: "Atrasado", glow: true, highlight: true },
              { color: "#6b7280", label: "Isento", glow: false },
            ].map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2 rounded-[12px] bg-surface-container border transition-colors ${
                  item.highlight
                    ? "border-[#ef4444]/30 bg-[#ef4444]/5 hover:border-[#ef4444]/50"
                    : "border-surface-variant hover:border-surface-variant"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: item.glow ? `0 0 8px ${item.color}66` : "none",
                  }}
                />
                <span className={`text-sm font-label-bold ${item.label === "Isento" ? "text-on-surface-variant" : "text-on-surface"}`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Spreadsheet Grid */}
        <div className="border border-surface-variant rounded-2xl overflow-hidden shadow-lg bg-surface-container">
          {/* Header Row */}
          <div className="flex border-b border-surface-variant bg-surface-container-highest/20">
            <div className="w-48 shrink-0 p-4 font-label-bold text-xs text-on-surface-variant uppercase tracking-wider sticky left-0 backdrop-blur z-20 border-r border-surface-variant bg-surface-container">
              Atleta
            </div>
            <div className="flex-1 overflow-x-auto spreadsheet-container flex">
              {monthLabels.map((month, idx) => (
                <div
                  key={month}
                  className={`w-16 shrink-0 p-4 font-label-bold text-xs text-center uppercase tracking-wider ${
                    idx === currentMonthIndex
                      ? "text-primary bg-primary/5 border-b-2 border-primary"
                      : "text-on-surface-variant"
                  }`}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Student Rows */}
          {students.map((student, sIdx) => (
            <div
              key={student.name}
              className={`flex border-b border-surface-variant/50 hover:bg-surface-container-high/30 transition-colors group ${
                student.belt.includes("Isento") ? "opacity-80" : ""
              }`}
            >
              {/* Sticky Student Column */}
              <div className="w-48 shrink-0 p-3 sticky left-0 backdrop-blur group-hover:bg-surface-container-high/90 z-10 border-r border-surface-variant flex items-center gap-3 bg-surface-container">
                {student.photo ? (
                  <img className="w-10 h-10 rounded-full object-cover shadow-sm" src={student.photo} alt={student.name} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-on-surface font-bold shadow-sm">
                    {student.initial}
                  </div>
                )}
                <div className="overflow-hidden">
                  <p className="font-bold text-sm text-on-surface truncate">{student.name}</p>
                  <p className="text-[11px] font-medium truncate" style={{ color: student.beltColor }}>
                    {student.belt}
                  </p>
                </div>
              </div>

              {/* Month Cells */}
              <div className="flex-1 overflow-x-auto spreadsheet-container flex items-center">
                {student.months.map((status, mIdx) => (
                  <div
                    key={mIdx}
                    className={`w-16 shrink-0 flex justify-center ${
                      mIdx === currentMonthIndex ? "bg-primary/5 h-full items-center" : ""
                    }`}
                    style={{ minHeight: "56px", display: "flex", alignItems: "center" }}
                  >
                    {renderStatusDot(status, sIdx, mIdx, mIdx === currentMonthIndex)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Resolution Modal */}
      <Modal
        isOpen={!!selectedCell}
        onClose={() => setSelectedCell(null)}
        title="Resolução de Pendência"
      >
        {selectedCell && (
          <>
            <p className="text-on-surface-variant text-sm mt-1 -mt-2 mb-4">
              {students[selectedCell.studentIdx].name} - Mensalidade {monthLabels[selectedCell.monthIdx]}
            </p>
            <div className="flex items-center gap-3 mb-6 p-4 bg-surface-container rounded-xl border border-[#ef4444]/30 shadow-inner">
              <div className="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[#ef4444]">warning</span>
              </div>
              <div>
                <p className="text-on-surface font-bold text-lg">R$ 150,00</p>
                <p className="text-sm text-[#ef4444] font-medium">Vencido há 5 dias</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Manual Baixa */}
              <div>
                <p className="font-label-bold text-label-bold text-on-surface-variant mb-3 text-xs uppercase tracking-wider">
                  Dar Baixa Manual
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: "qr_code_scanner", label: "PIX" },
                    { icon: "payments", label: "Dinheiro" },
                    { icon: "credit_card", label: "Cartão" },
                  ].map((method) => (
                    <button
                      key={method.label}
                      onClick={() => confirmBaixa(method.label)}
                      className="flex flex-col items-center justify-center p-3 rounded-xl bg-surface-container border border-surface-variant hover:border-primary hover:text-primary transition-all text-on-surface group cursor-pointer"
                    >
                      <span className="material-symbols-outlined mb-2 text-[24px] group-hover:scale-110 transition-transform">
                        {method.icon}
                      </span>
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp */}
              <div className="pt-5 border-t border-surface-variant">
                <button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#25D366]/20 cursor-pointer">
                  <span className="material-symbols-outlined">chat</span>
                  WhatsApp Cobrança
                </button>
                <p className="text-center text-xs text-on-surface-variant mt-3 font-medium">
                  Envia mensagem padrão com chave PIX
                </p>
              </div>
            </div>
          </>
        )}
      </Modal>

      <BottomNav />
      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
