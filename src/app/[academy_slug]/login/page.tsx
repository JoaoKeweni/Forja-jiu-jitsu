"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.academy_slug as string;
  const academyName = slug
    ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Academia";

  const [role, setRole] = useState<"professor" | "aluno">("professor");
  const [email, setEmail] = useState("professor@forja.com");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (newRole: "professor" | "aluno") => {
    setRole(newRole);
    setEmail(newRole === "professor" ? "professor@forja.com" : "aluno@forja.com");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (role === "professor") {
        router.push("/professor/dashboard");
      } else {
        router.push("/aluno/perfil");
      }
    }, 500);
  };

  return (
    <body className="bg-background text-on-surface min-h-screen flex items-center justify-center relative overflow-hidden bg-pattern">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-container/10 blur-[120px]" />
        <div className="absolute top-[80%] right-[10%] w-[40%] h-[40%] rounded-full bg-secondary-container/10 blur-[100px]" />
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-margin-mobile md:px-0">
        <div className="glass-panel rounded-xl p-8 md:p-10 shadow-2xl flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="font-display-lg text-display-lg tracking-tighter text-primary italic uppercase drop-shadow-md">
              FORJA
            </h1>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-primary-container/20 border border-primary-container/40 text-primary px-3 py-1 rounded-[12px] text-xs font-mono">
              <span className="material-symbols-outlined text-sm">domain</span>
              <span>{academyName}</span>
            </div>
            <p className="font-body-md text-xs text-on-surface-variant mt-2">
              Área de Acesso da Academia
            </p>
          </div>

          {/* Login Form */}
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-2">
                Entrar como:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("professor")}
                  className={`py-2.5 px-3 text-xs font-label-bold rounded-lg border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    role === "professor"
                      ? "border-primary-container bg-primary-container text-white"
                      : "border-[#374151] bg-[#0A0A0A] text-on-surface-variant hover:border-primary"
                  }`}
                >
                  🥋 Professor
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("aluno")}
                  className={`py-2.5 px-3 text-xs font-label-bold rounded-lg border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    role === "aluno"
                      ? "border-primary-container bg-primary-container text-white"
                      : "border-[#374151] bg-[#0A0A0A] text-on-surface-variant hover:border-primary"
                  }`}
                >
                  🥋 Aluno
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-2" htmlFor="email">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A] border border-[#374151] rounded-lg py-3 pl-10 pr-3 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container input-glow transition-all outline-none placeholder-outline-variant"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-label-bold text-label-bold text-on-surface mb-2" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#0A0A0A] border border-[#374151] rounded-lg py-3 pl-10 pr-10 font-body-md text-body-md text-on-surface focus:border-primary-container focus:ring-1 focus:ring-primary-container input-glow transition-all outline-none placeholder-outline-variant"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline-variant hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="bg-[#0A0A0A] border-[#374151] text-primary-container rounded focus:ring-primary-container focus:ring-offset-0"
                />
                <span className="ml-2 font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                  Lembrar de mim
                </span>
              </label>
              <a className="font-label-bold text-label-bold text-tertiary hover:text-tertiary-fixed transition-colors" href="#">
                Esqueceu a senha?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-container text-on-primary-container font-label-bold text-label-bold py-4 rounded-lg mt-8 btn-glow transition-all active:scale-95 flex justify-center items-center gap-2 cursor-pointer"
            >
              <span>
                {loading
                  ? "Autenticando..."
                  : role === "professor"
                  ? "Entrar como Professor"
                  : "Entrar como Aluno"}
              </span>
              {!loading && (
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              )}
            </button>
          </form>

          {/* Register Link & Super Admin Link */}
          <div className="mt-8 text-center w-full border-t border-outline-variant/30 pt-6 space-y-2">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Novo aluno?{" "}
              <Link
                href={`/${slug}/cadastro`}
                className="font-label-bold text-label-bold text-primary hover:text-primary-fixed transition-colors ml-1"
              >
                Crie sua conta na academia
              </Link>
            </p>
            <p className="text-xs text-on-surface-variant/60">
              É Super Admin da plataforma?{" "}
              <Link
                href="/admin/dashboard"
                className="text-on-surface hover:text-primary underline cursor-pointer"
              >
                Acessar Painel SaaS
              </Link>
            </p>
          </div>
        </div>
      </div>

      <DemoSwitcher />
    </body>
  );
}
