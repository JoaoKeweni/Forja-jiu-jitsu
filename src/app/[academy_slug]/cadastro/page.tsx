"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

export default function StudentRegistrationPage({ params }: { params: { academy_slug: string } }) {
  const router = useRouter();
  const academySlug = params.academy_slug || "gracie-barra-matriz";
  const formattedAcademyName = academySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    team: "1",
  });

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md bg-surface-container border border-surface-variant rounded-2xl p-8 shadow-2xl relative">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-primary italic uppercase font-black tracking-tighter mb-1">
            FORJA
          </h1>
          <h2 className="font-display font-bold text-xl text-on-surface mb-1">Cadastro do Aluno</h2>
          <p className="text-xs text-on-surface-variant">Siga o caminho. Inicie sua jornada.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1" htmlFor="name">
                  Nome Completo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    person
                  </span>
                  <input
                    id="name"
                    required
                    type="text"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1" htmlFor="email">
                  E-mail
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    mail
                  </span>
                  <input
                    id="email"
                    required
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1" htmlFor="phone">
                  Telefone (WhatsApp)
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    phone
                  </span>
                  <input
                    id="phone"
                    required
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1" htmlFor="password">
                  Senha
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    lock
                  </span>
                  <input
                    id="password"
                    required
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary-container"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-primary-container text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary-container transition-all mt-6 cursor-pointer"
              >
                <span>Continuar</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-surface-dim border-2 border-dashed border-outline-variant flex items-center justify-center text-outline cursor-pointer hover:border-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">add_a_photo</span>
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    <p className="font-semibold text-on-surface">Upload de foto clara</p>
                    <p className="text-[11px] text-outline">Facilita a aprovação pelo professor.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">
                  Academia Vinculada
                </label>
                <div className="bg-primary-container/15 border border-primary-container/40 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">domain</span>
                    <div>
                      <div className="font-bold text-sm text-on-surface">{formattedAcademyName}</div>
                      <div className="text-[11px] text-on-surface-variant">Identificado via URL exclusiva</div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-primary-container/30 text-primary font-mono px-2 py-0.5 rounded border border-primary-container/40">
                    Pré-selecionado
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1" htmlFor="team">
                  Selecione sua Equipe / Horário
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                    schedule
                  </span>
                  <select
                    id="team"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                    className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-10 text-sm text-on-surface outline-none focus:border-primary-container appearance-none cursor-pointer"
                  >
                    <option value="1">Equipe Adulto Noite - Seg/Qua/Sex 19:00 (Prof. Marcus)</option>
                    <option value="2">Equipe Manhã - Ter/Qui 08:00 (Prof. Carlos)</option>
                    <option value="3">Equipe Infantil - Ter/Qui 17:00 (Profª. Ana)</option>
                    <option value="4">Equipe Competição - Sábado 10:00</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-lg">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-transparent border border-outline text-on-surface font-bold py-3.5 px-4 rounded-lg hover:bg-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-container text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary-container transition-all cursor-pointer shadow-lg shadow-primary-container/20"
                >
                  <span>Finalizar Cadastro</span>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-on-surface-variant">
            Já possui uma conta?{" "}
            <Link href={`/${academySlug}/login`} className="text-primary font-bold hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-surface-container border border-primary-container/50 p-8 rounded-2xl max-w-md w-full text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto border border-primary-container/40">
              <span className="material-symbols-outlined text-4xl">hourglass_top</span>
            </div>
            <h3 className="font-display font-bold text-xl text-on-surface">Cadastro Solicitado!</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Seus dados foram enviados com sucesso. O professor da academia{" "}
              <strong>{formattedAcademyName}</strong> irá aprovar o seu acesso no painel de moderação.
            </p>
            <div className="pt-4 flex flex-col gap-2.5">
              <button
                onClick={() => router.push("/professor/aprovacao")}
                className="w-full bg-primary-container text-white py-3 rounded-lg font-bold text-sm hover:bg-secondary-container transition-all cursor-pointer"
              >
                👀 Ver Tela de Aprovação (Visão Professor)
              </button>
              <button
                onClick={() => router.push(`/${academySlug}/login`)}
                className="w-full bg-surface border border-outline-variant text-on-surface py-3 rounded-lg font-bold text-sm hover:bg-surface-bright transition-all cursor-pointer"
              >
                🔑 Voltar para Login
              </button>
            </div>
          </div>
        </div>
      )}

      <DemoSwitcher />
    </main>
  );
}
