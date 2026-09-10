import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminLogin } from "../api/authHooks";
import { useAuth } from "../auth/AuthContext";
import { apiError } from "../api/client";
import { Button, Input } from "../components/ui";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const login = useAdminLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const auth = await login.mutateAsync({ email, password });
      await setSession(auth);
      navigate("/admin");
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pattern p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 animate-fade-in">
        <h1 className="text-center font-display text-2xl font-bold text-primary">Portal Super Admin</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Input type="email" placeholder="E-mail" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Senha" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" className="w-full" disabled={login.isPending}>
            {login.isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
