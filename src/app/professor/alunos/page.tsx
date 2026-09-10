"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

const beltColors: Record<string, string> = {
  Branca: "#e5e7eb",
  Azul: "#3b82f6",
  Roxa: "#a855f7",
  Marrom: "#92400e",
  Preta: "#1f2937",
};

const mockStudents = [
  { id: "1", name: "Carlos Silva", belt: "Azul", degrees: 2, team: "Adulto Noite", phone: "(11) 99999-1111", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6jhOKBIACzBwKMnOco9nOawem3_3QUGvdHcpryFelnO-068cbnzmtAdGRscqivEW4uZ1N8XnKCNXA_ULcYFjxho1zk9JNX-gJGaWAUS2oZAEHWUv-WMpSztsG0gN3VguEKBqLhfO4dnS9i4NA0MWnzT-NJa9r6zDO_5Au-zzcLqsCKZAgr-gX7Lj7QmntpX_3Ypf2sdX5qOnptFmngQCSBxdaiykFfgmd5nv-oYFZRDDLWoWpGVfX" },
  { id: "2", name: "Ana Paula Santos", belt: "Roxa", degrees: 1, team: "Adulto Noite", phone: "(11) 99999-2222", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk4es2gSXHw7QQvFi2p61Migy3K8w8L4u5ShK3TNP3KNFYqnH2om5mZgtaMc5ZXeSsmcfP_-ZAqwHzpL5vak6EoFn2RBX2jc2B0_gyYlyNE02nKymvUjmZXZUSUQ763yxNC_3HRW1MGOEoXAIr0UMMNbrQCuMAxHvEJZOH-ozGgUYWFcV7bQpoKWLz8ZPcSRRtmt6evPmOF9Prp3Op9gauh7teF1oP4QcX-kNDbuhMzXm0iOrSRYuuI" },
  { id: "3", name: "Lucas Mendes", belt: "Branca", degrees: 4, team: "Adulto Noite", phone: "(11) 99999-3333" },
  { id: "4", name: "Roberto Almeida", belt: "Marrom", degrees: 3, team: "Competição Matutino", phone: "(11) 99999-4444", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmpEw0-EjzCL14-rPPv-5QgsgL5XoJ1EZtGmGJSNpO6q4InhzGzvKzLMud7kaO03mSKm522B0Wsab7X5Hu3fni0DQSvYqA2XD5e2iv58k-kt2GR02TqsDJbO_a7xyKphxBKc08xvviQZ52ZH_RutrUaVgRnEP5ArMyKUbJZo3kmdYUSla9bBKJSkPXHPPCDfQU6NLpj-JBsZLn7Lyy2RrjEpofCQiZxL3Vwn5lK7DqSsUJQ7dUIXJ8" },
  { id: "5", name: "Fernanda Costa", belt: "Azul", degrees: 0, team: "Kids & Juvenil", phone: "(11) 99999-5555" },
  { id: "6", name: "Thiago Oliveira", belt: "Branca", degrees: 2, team: "Adulto Noite", phone: "(11) 99999-6666" },
];

export default function GestaoAlunosPage() {
  const [search, setSearch] = useState("");
  const [filterBelt, setFilterBelt] = useState("Todas");
  const [toastMessage, setToastMessage] = useState("");

  const filtered = mockStudents.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesBelt = filterBelt === "Todas" || s.belt === filterBelt;
    return matchesSearch && matchesBelt;
  });

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-on-background font-body-md text-body-md pt-20 pb-32 md:pb-12">
      <Header pendingCount={3} />

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter">
        <div className="mb-6 mt-4">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Gestão de Alunos</h1>
          <p className="text-on-surface-variant text-sm">{filtered.length} aluno(s) encontrado(s)</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar aluno..."
              className="w-full bg-surface-container border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:outline-none input-glow transition-colors placeholder-on-surface-variant/50"
            />
          </div>
          <select
            value={filterBelt}
            onChange={(e) => setFilterBelt(e.target.value)}
            className="bg-surface-container border border-surface-variant rounded-lg py-3 px-4 text-on-surface focus:outline-none appearance-none font-label-bold text-label-bold min-w-[160px]"
          >
            <option value="Todas">🥋 Todas as Faixas</option>
            <option value="Branca">⬜ Faixa Branca</option>
            <option value="Azul">🟦 Faixa Azul</option>
            <option value="Roxa">🟪 Faixa Roxa</option>
            <option value="Marrom">🟫 Faixa Marrom</option>
            <option value="Preta">⬛ Faixa Preta</option>
          </select>
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <div
              key={student.id}
              className="bg-surface-container border border-surface-variant rounded-xl p-4 shadow-lg hover:border-outline-variant transition-colors group"
            >
              <div className="flex items-center gap-3 mb-3">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} className="w-12 h-12 rounded-full object-cover border border-outline-variant" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-on-surface font-bold">
                    {student.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-on-surface truncate">{student.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/30"
                      style={{ backgroundColor: beltColors[student.belt] }}
                    />
                    <span className="text-xs" style={{ color: beltColors[student.belt] }}>
                      {student.belt} ({student.degrees} graus)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-xs text-on-surface-variant mb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">sports_martial_arts</span>
                  {student.team}
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">phone</span>
                  {student.phone}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setToastMessage(`Abrindo WhatsApp para ${student.name}...`)}
                  className="flex-1 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/30 text-xs py-2 rounded-lg hover:bg-[#25D366]/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  WhatsApp
                </button>
                <button
                  className="flex-1 bg-primary/10 text-primary border border-primary/30 text-xs py-2 rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
