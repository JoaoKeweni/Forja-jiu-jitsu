"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

export default function AcademyLoginPage({ params }: { params: { academy_slug: string } }) {
  const router = useRouter();
  const academySlug = params.academy_slug || "gracie-barra-matriz";
  const formattedAcademyName = academySlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [role, setRole] = useState<"professor" | "aluno" | "admin">("professor");
  const [email, setEmail] = useState("professor@forja.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (selectedRole: "professor" | "aluno" | "admin") => {
    setRole(selectedRole);
    if (selectedRole === "professor") setEmail("professor@forja.com");
    else if (selectedRole === "aluno") setEmail("aluno@forja.com");
    else setEmail("superadmin@forja.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (role === "professor") {
        router.push("/professor/dashboard");
      } else if (role === "aluno") {
        router.push("/aluno/perfil");
      } else {
        router.push("/admin/dashboard");
      }
    }, 500);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface flex items-center justify-center relative overflow-hidden px-4">
      {/* Glow Effects */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-container/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[80%] right-[10%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col items-center border border-outline-variant/40">
          {/* Logo & Academy Badge */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-4xl tracking-tighter text-primary italic uppercase font-black">
              FORJA
            </h1>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-primary-container/20 border border-primary-container/40 text-primary px-3 py-1 rounded-full text-xs font-mono">
              <span className="material-symbols-outlined text-sm">domain</span>
              <span>{formattedAcademyName}</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant mt-2">Área de Acesso da Academia</p>
          </div>

          {/* Form */}
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-2 uppercase tracking-wider">
                Entrar como:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleSelect("professor")}
                  className={`py-2.5 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    role === "professor"
                      ? "border-primary-container bg-primary-container text-white shadow-lg shadow-primary-container/20"
                      : "border-[#374151] bg-[#0A0A0A] text-on-surface-variant hover:border-primary"
                  }`}
                >
                  🥋 Professor
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect("aluno")}
                  className={`py-2.5 px-3 text-xs font-bold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    role === "aluno"
                      ? "border-primary-container bg-primary-container text-white shadow-lg shadow-primary-container/20"
                      : "border-[#374151] bg-[#0A0A0A] text-on-surface-variant hover:border-primary"
                  }`}
                >
                  🥋 Aluno
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#374151] rounded-lg py-3 pl-10 pr-3 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-lg">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#374151] rounded-lg py-3 pl-10 pr-10 text-sm text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-on-surface-variant hover:text-on-surface">
                <input type="checkbox" defaultChecked className="rounded bg-[#0A0A0A] border-[#374151] text-primary-container focus:ring-0" />
                Lembrar de mim
              </label>
              <a href="#" className="text-tertiary hover:underline font-medium">
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container hover:bg-secondary-container text-white font-bold py-3.5 rounded-lg mt-6 transition-all flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-primary-container/20 active:scale-95"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar como {role === "professor" ? "Professor" : "Aluno"}</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center w-full border-t border-outline-variant/30 pt-6 space-y-2">
            <p className="text-sm text-on-surface-variant">
              Novo aluno?{" "}
              <Link
                href={`/${academySlug}/cadastro`}
                className="font-bold text-primary hover:underline ml-1"
              >
                Crie sua conta na academia
              </Link>
            </p>
            <p className="text-xs text-on-surface-variant/60">
              É Super Admin da plataforma?{" "}
              <button
                onClick={() => {
                  handleRoleSelect("admin");
                  router.push("/admin/dashboard");
                }}
                className="text-on-surface hover:text-primary underline cursor-pointer"
              >
                Acessar Painel SaaS
              </button>
            </p>
          </div>
        </div>
      </div>

      <DemoSwitcher />
    </main>
  );
}
