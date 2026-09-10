import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

// Placeholders — serão substituídos pelas telas completas na próxima etapa.
function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pattern">
      <div className="glass-panel rounded-2xl p-8 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">{title}</h1>
        <p className="mt-2 text-on-surface-variant">Tela em construção.</p>
      </div>
    </div>
  );
}

function Landing() {
  const { user } = useAuth();
  if (user?.role === "SuperAdmin") return <Navigate to="/admin" replace />;
  if (user?.role === "Professor") return <Navigate to="/professor" replace />;
  if (user?.role === "Student") return <Navigate to="/aluno" replace />;
  return <Placeholder title="Forja Jiu-Jitsu" />;
}

export default function App() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={<Placeholder title="Login Super Admin" />} />
      <Route path="/:slug/login" element={<Placeholder title="Login da Academia" />} />
      <Route path="/:slug/cadastro" element={<Placeholder title="Cadastro de Aluno" />} />

      {/* Super Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={["SuperAdmin"]}>
            <Placeholder title="Painel Super Admin" />
          </ProtectedRoute>
        }
      />

      {/* Professor */}
      <Route
        path="/professor/*"
        element={
          <ProtectedRoute roles={["Professor"]}>
            <Placeholder title="Painel do Professor" />
          </ProtectedRoute>
        }
      />

      {/* Aluno */}
      <Route
        path="/aluno/*"
        element={
          <ProtectedRoute roles={["Student"]}>
            <Placeholder title="Painel do Aluno" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
