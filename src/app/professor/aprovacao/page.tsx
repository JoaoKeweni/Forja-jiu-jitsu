"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import BottomNav from "@/components/ui/BottomNav";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

interface PendingStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  team: string;
  requestDate: string;
  photo: string;
}

export default function AprovacaoPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [students, setStudents] = useState<PendingStudent[]>([
    {
      id: "1", name: "João Pedro Nascimento", email: "joao.pedro@email.com",
      phone: "(11) 98765-4321", team: "Equipe Adulto Noite",
      requestDate: "Há 2 horas",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6jhOKBIACzBwKMnOco9nOawem3_3QUGvdHcpryFelnO-068cbnzmtAdGRscqivEW4uZ1N8XnKCNXA_ULcYFjxho1zk9JNX-gJGaWAUS2oZAEHWUv-WMpSztsG0gN3VguEKBqLhfO4dnS9i4NA0MWnzT-NJa9r6zDO_5Au-zzcLqsCKZAgr-gX7Lj7QmntpX_3Ypf2sdX5qOnptFmngQCSBxdaiykFfgmd5nv-oYFZRDDLWoWpGVfX",
    },
    {
      id: "2", name: "Maria Clara Souza", email: "maria.clara@email.com",
      phone: "(11) 91234-5678", team: "Equipe Adulto Noite",
      requestDate: "Há 5 horas",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAk4es2gSXHw7QQvFi2p61Migy3K8w8L4u5ShK3TNP3KNFYqnH2om5mZgtaMc5ZXeSsmcfP_-ZAqwHzpL5vak6EoFn2RBX2jc2B0_gyYlyNE02nKymvUjmZXZUSUQ763yxNC_3HRW1MGOEoXAIr0UMMNbrQCuMAxHvEJZOH-ozGgUYWFcV7bQpoKWLz8ZPcSRRtmt6evPmOF9Prp3Op9gauh7teF1oP4QcX-kNDbuhMzXm0iOrSRYuuI",
    },
    {
      id: "3", name: "Thiago Oliveira", email: "thiago.oli@email.com",
      phone: "(21) 99876-5432", team: "Kids & Juvenil Manhã",
      requestDate: "Ontem",
      photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmpEw0-EjzCL14-rPPv-5QgsgL5XoJ1EZtGmGJSNpO6q4InhzGzvKzLMud7kaO03mSKm522B0Wsab7X5Hu3fni0DQSvYqA2XD5e2iv58k-kt2GR02TqsDJbO_a7xyKphxBKc08xvviQZ52ZH_RutrUaVgRnEP5ArMyKUbJZo3kmdYUSla9bBKJSkPXHPPCDfQU6NLpj-JBsZLn7Lyy2RrjEpofCQiZxL3Vwn5lK7DqSsUJQ7dUIXJ8",
    },
  ]);

  const approve = (id: string, name: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setToastMessage(`✅ ${name} aprovado com sucesso! Acesso liberado.`);
  };

  const reject = (id: string, name: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setToastMessage(`❌ Solicitação de ${name} recusada.`);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-on-background font-body-md text-body-md pt-20 pb-32 md:pb-12">
      <Header pendingCount={students.length} />

      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-gutter">
        <div className="mb-8 mt-4">
          <h1 className="font-headline-md text-headline-md text-on-surface mb-1">Fila de Moderação</h1>
          <p className="text-on-surface-variant text-sm">
            {students.length > 0
              ? `${students.length} solicitação(ões) aguardando sua aprovação`
              : "Nenhuma solicitação pendente 🎉"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-surface-container border border-surface-variant rounded-xl p-5 shadow-lg hover:border-outline-variant transition-colors animate-fade-in"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-outline-variant shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-on-surface text-sm truncate">{student.name}</h3>
                  <p className="text-xs text-on-surface-variant truncate">{student.email}</p>
                  <p className="text-xs text-on-surface-variant">{student.phone}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-primary">sports_martial_arts</span>
                  <span className="text-on-surface-variant">{student.team}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">schedule</span>
                  <span className="text-on-surface-variant">{student.requestDate}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => approve(student.id, student.name)}
                  className="flex-1 bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40 font-label-bold text-xs py-2.5 rounded-lg hover:bg-[#22c55e]/30 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Aprovar
                </button>
                <button
                  onClick={() => reject(student.id, student.name)}
                  className="flex-1 bg-error/10 text-error border border-error/30 font-label-bold text-xs py-2.5 rounded-lg hover:bg-error/20 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                  Recusar
                </button>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">verified</span>
            <p className="text-lg font-bold">Tudo limpo!</p>
            <p className="text-sm">Nenhum aluno aguardando aprovação no momento.</p>
          </div>
        )}
      </div>

      <BottomNav />
      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
