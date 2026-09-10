import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";
import AcademyLogin from "./pages/AcademyLogin";
import AcademyRegister from "./pages/AcademyRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminArea from "./pages/AdminArea";
import ProfessorArea from "./pages/ProfessorArea";
import StudentArea from "./pages/StudentArea";

function Landing() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-on-surface-variant">
        Carregando...
      </div>
    );
  }
  if (user?.role === "SuperAdmin") return <Navigate to="/admin" replace />;
  if (user?.role === "Professor") return <Navigate to="/professor" replace />;
  if (user?.role === "Student") return <Navigate to="/aluno" replace />;

  // Sem sessão: landing simples com acesso ao portal admin.
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-pattern p-4 text-center">
      <h1 className="font-display text-5xl font-black text-primary-container">FORJA</h1>
      <p className="mt-2 uppercase tracking-[0.3em] text-on-surface-variant">Jiu-Jitsu</p>
      <p className="mt-6 max-w-md text-on-surface-variant">
        Acesse pela URL exclusiva da sua academia (ex.: <code>/gracie-barra-matriz/login</code>).
      </p>
      <a href="/admin/login" className="mt-6 text-sm text-primary font-semibold">Portal Super Admin →</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/:slug/login" element={<AcademyLogin />} />
      <Route path="/:slug/cadastro" element={<AcademyRegister />} />

      <Route
        path="/admin"
        element={<ProtectedRoute roles={["SuperAdmin"]}><AdminArea /></ProtectedRoute>}
      />
      <Route
        path="/professor"
        element={<ProtectedRoute roles={["Professor"]}><ProfessorArea /></ProtectedRoute>}
      />
      <Route
        path="/aluno"
        element={<ProtectedRoute roles={["Student"]}><StudentArea /></ProtectedRoute>}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
