import { useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { usePublicAcademy, useLogin } from "../api/authHooks";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import { Button, Input } from "../components/ui";

export default function AcademyLogin() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { data: academy } = usePublicAcademy(slug);
  const login = useLogin(slug!);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const auth = await login.mutateAsync({ email, password });
      await setSession(auth);
      navigate("/");
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pattern p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <div className="text-center">
          <h1 className="font-display text-3xl font-black text-primary-container">FORJA</h1>
          <p className="mt-1 text-sm uppercase tracking-widest text-on-surface-variant">Jiu-Jitsu</p>
          {academy && (
            <span className="mt-4 inline-block rounded-full bg-surface-container-high px-3 py-1 text-sm">
              {academy.name}
            </span>
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input type="email" placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Senha" value={password}
            onChange={(e) => setPassword(e.target.value)} required />

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Entrando..." : "Entrar na Plataforma"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-on-surface-variant">
          Novo aluno?{" "}
          <Link to={`/${slug}/cadastro`} className="text-primary font-semibold">
            Crie sua conta
          </Link>
        </p>
      </div>
    </div>
  );
}
