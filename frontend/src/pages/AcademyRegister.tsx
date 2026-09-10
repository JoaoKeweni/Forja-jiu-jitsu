import { useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usePublicAcademy, useRegister } from "../api/authHooks";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import { Button, Input } from "../components/ui";

export default function AcademyRegister() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { data: academy } = usePublicAcademy(slug);
  const register = useRegister(slug!);

  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", teamId: "" });
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const auth = await register.mutateAsync(form);
      await setSession(auth);
      navigate("/aluno");
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pattern p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <h1 className="text-center font-display text-2xl font-bold text-primary">Criar Conta</h1>
        {academy && (
          <p className="mt-2 text-center text-sm text-on-surface-variant">
            Academia: <span className="text-on-surface font-semibold">{academy.name}</span>
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input placeholder="Nome completo" value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)} required />
          <Input type="email" placeholder="E-mail" value={form.email}
            onChange={(e) => update("email", e.target.value)} required />
          <Input placeholder="WhatsApp" value={form.phone}
            onChange={(e) => update("phone", e.target.value)} required />
          <Input type="password" placeholder="Senha" value={form.password}
            onChange={(e) => update("password", e.target.value)} required />

          <select
            className="w-full rounded-xl bg-surface-container-low border border-outline-variant px-4 py-2.5 text-on-surface input-glow"
            value={form.teamId}
            onChange={(e) => update("teamId", e.target.value)}
            required
          >
            <option value="">Selecione sua Equipe/Horário</option>
            {academy?.teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}{t.schedule ? ` — ${t.schedule}` : ""}
              </option>
            ))}
          </select>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" className="w-full" disabled={register.isPending}>
            {register.isPending ? "Enviando..." : "Finalizar Cadastro e Solicitar Aprovação"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Já tem conta?{" "}
          <Link to={`/${slug}/login`} className="text-primary font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
