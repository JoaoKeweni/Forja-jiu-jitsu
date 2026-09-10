"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

export default function CadastroPage() {
  const params = useParams();
  const slug = params.academy_slug as string;
  const academyName = slug?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Academia";

  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <main className="bg-background text-on-background min-h-screen flex flex-col font-body-md">
      <div className="flex-1 flex flex-col w-full max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop justify-center items-center py-12">
        <div className="w-full max-w-md bg-surface-container border border-surface-variant rounded-xl p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container rounded-full blur-[80px] opacity-20 pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <h1 className="font-display-lg-mobile text-display-lg-mobile text-primary italic uppercase tracking-tighter mb-2">
              FORJA
            </h1>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">Cadastro do Aluno</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">Siga o caminho. Inicie sua jornada.</p>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            {/* Step 1 */}
            <div
              className={`space-y-4 transition-all duration-300 ${
                step === 1 ? "opacity-100 translate-x-0" : "hidden opacity-0 -translate-x-4"
              }`}
            >
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-1" htmlFor="name">Nome Completo</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">person</span>
                  <input className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:outline-none input-glow transition-colors placeholder-on-surface-variant/50" id="name" placeholder="Seu nome" type="text" />
                </div>
              </div>
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-1" htmlFor="email-cadastro">E-mail</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
                  <input className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:outline-none input-glow transition-colors placeholder-on-surface-variant/50" id="email-cadastro" placeholder="seu@email.com" type="email" />
                </div>
              </div>
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-1" htmlFor="phone">Telefone</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">phone</span>
                  <input className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:outline-none input-glow transition-colors placeholder-on-surface-variant/50" id="phone" placeholder="(00) 00000-0000" type="tel" />
                </div>
              </div>
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-1" htmlFor="password-cadastro">Senha</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
                  <input className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-4 text-on-surface focus:outline-none input-glow transition-colors placeholder-on-surface-variant/50" id="password-cadastro" placeholder="••••••••" type="password" />
                </div>
              </div>
              <button
                type="button"
                onClick={nextStep}
                className="w-full bg-primary-container text-white font-label-bold text-label-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary-container transition-all btn-glow mt-6 cursor-pointer"
              >
                Continuar
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            {/* Step 2 */}
            <div
              className={`space-y-5 transition-all duration-300 ${
                step === 2 ? "opacity-100 translate-x-0 animate-slide-in-right" : "hidden opacity-0 translate-x-4"
              }`}
            >
              {/* Photo Upload */}
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-2">Foto de Perfil</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-surface-dim border-2 border-dashed border-outline-variant flex items-center justify-center text-outline overflow-hidden relative group cursor-pointer">
                    <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">add_a_photo</span>
                    <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" accept="image/*" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-on-surface-variant">Faça upload de uma foto clara do seu rosto.</p>
                    <p className="text-xs text-outline mt-1">JPG ou PNG, máx. 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Academy (Pre-selected) */}
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-1">Academia Vinculada</label>
                <div className="bg-primary-container/15 border border-primary-container/40 rounded-lg p-3 flex items-center justify-between text-on-surface">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">domain</span>
                    <div>
                      <div className="font-bold text-sm text-on-surface">{academyName}</div>
                      <div className="text-xs text-on-surface-variant">Identificado via URL exclusiva</div>
                    </div>
                  </div>
                  <span className="text-xs bg-primary-container/30 text-primary font-mono px-2 py-1 rounded-[4px] border border-primary-container/40">
                    Pré-selecionado
                  </span>
                </div>
              </div>

              {/* Team Select */}
              <div>
                <label className="block font-label-bold text-label-bold text-on-surface-variant mb-1" htmlFor="team">Selecione sua Equipe / Horário</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">schedule</span>
                  <select className="w-full bg-surface-dim border border-surface-variant rounded-lg py-3 pl-10 pr-10 text-on-surface focus:outline-none input-glow transition-colors appearance-none" id="team">
                    <option disabled value="">Escolha a sua turma</option>
                    <option value="1">Equipe Adulto Noite - Seg/Qua/Sex 19:00 (Prof. Marcus)</option>
                    <option value="2">Equipe Manhã - Ter/Qui 08:00 (Prof. Carlos)</option>
                    <option value="3">Equipe Infantil - Ter/Qui 17:00 (Profª. Ana)</option>
                    <option value="4">Equipe Competição - Sábado 10:00</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-none bg-transparent border-2 border-outline text-on-surface font-label-bold text-label-bold py-4 px-4 rounded-lg flex items-center justify-center hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-container text-white font-label-bold text-label-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary-container transition-all btn-glow cursor-pointer"
                >
                  Finalizar Cadastro
                  <span className="material-symbols-outlined">check_circle</span>
                </button>
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Já possui uma conta?{" "}
              <Link href={`/${slug}/login`} className="text-primary hover:text-tertiary transition-colors underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-surface-container border border-primary-container/50 p-8 rounded-xl max-w-md w-full text-center space-y-4 shadow-2xl animate-fade-in">
            <div className="w-16 h-16 bg-primary-container/20 text-primary-container rounded-full flex items-center justify-center mx-auto border border-primary-container/40">
              <span className="material-symbols-outlined text-4xl">hourglass_top</span>
            </div>
            <h3 className="font-headline-md text-xl text-on-surface">Cadastro Solicitado!</h3>
            <p className="font-body-md text-sm text-on-surface-variant">
              Seus dados foram enviados com sucesso. O professor da academia selecionada precisa aprovar seu acesso no painel de moderação.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <Link
                href="/professor/aprovacao"
                className="w-full bg-primary-container text-white py-3 rounded-lg font-label-bold hover:bg-secondary-container transition-all text-center"
              >
                👀 Ver Tela de Aprovação (Visão Professor)
              </Link>
              <Link
                href={`/${slug}/login`}
                className="w-full bg-surface border border-outline-variant text-on-surface py-3 rounded-lg font-label-bold hover:bg-surface-bright transition-all text-center"
              >
                🔑 Voltar para Login
              </Link>
            </div>
          </div>
        </div>
      )}

      <DemoSwitcher />
    </main>
  );
}
