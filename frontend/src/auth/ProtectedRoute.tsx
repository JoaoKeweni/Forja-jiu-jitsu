import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { UserRole } from "../api/types";

interface Props {
  children: ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
}

/** Protege rotas por autenticação e, opcionalmente, por role. */
export function ProtectedRoute({ children, roles, redirectTo = "/" }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-on-surface-variant">
        Carregando...
      </div>
    );
  }

  if (!user) return <Navigate to={redirectTo} replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={redirectTo} replace />;

  return <>{children}</>;
}
