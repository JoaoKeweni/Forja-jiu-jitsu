import { useAuth } from "../auth/AuthContext";
import { useMyStudent, useMyPayments } from "../api/hooks";
import { Button, Card } from "../components/ui";
import type { PaymentStatus } from "../api/types";

const statusColor: Record<PaymentStatus, string> = {
  Paid: "bg-status-paid",
  Pending: "bg-status-pending",
  Overdue: "bg-status-late",
  Exempt: "bg-status-exempt",
};

const statusLabel: Record<PaymentStatus, string> = {
  Paid: "Pago",
  Pending: "A Vencer",
  Overdue: "Atrasado",
  Exempt: "Isento",
};

const monthNames = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function StudentArea() {
  const { user, logout, refresh } = useAuth();

  // Aluno pendente: tela de espera (AUTH-03, RN-01).
  if (user?.studentStatus === "Pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pattern p-4">
        <Card className="max-w-md text-center animate-fade-in">
          <span className="inline-block rounded-full bg-status-pending/20 px-4 py-1 text-status-pending">
            🟡 Aguardando Aprovação
          </span>
          <h1 className="mt-4 font-display text-xl font-bold">Olá, {user.fullName}!</h1>
          <p className="mt-2 text-on-surface-variant">
            Seu cadastro foi recebido. O professor irá aprovar sua entrada em breve.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            <Button onClick={() => refresh()}>Verificar Status</Button>
            <Button variant="ghost" onClick={logout}>Sair</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (user?.studentStatus === "Rejected") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pattern p-4">
        <Card className="max-w-md text-center">
          <h1 className="font-display text-xl font-bold text-error">Cadastro não aprovado</h1>
          <p className="mt-2 text-on-surface-variant">Entre em contato com sua academia.</p>
          <Button variant="ghost" className="mt-6" onClick={logout}>Sair</Button>
        </Card>
      </div>
    );
  }

  return <StudentDashboard onLogout={logout} />;
}

function StudentDashboard({ onLogout }: { onLogout: () => void }) {
  const { data: student } = useMyStudent();
  const { data: payments } = useMyPayments(new Date().getFullYear());

  return (
    <div className="mx-auto max-w-lg p-4 pb-16">
      <header className="flex items-center justify-between py-4">
        <h1 className="font-display text-xl font-bold text-primary">Forja Jiu-Jitsu</h1>
        <Button variant="ghost" onClick={onLogout}>Sair</Button>
      </header>

      {/* Carteirinha digital (ALU-01) */}
      {student && (
        <Card className="bg-gradient-to-br from-primary-container to-secondary-container">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-lowest text-2xl">
              🥋
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-on-primary-container">{student.fullName}</h2>
              <p className="text-sm text-on-primary-container/80">
                Faixa {student.belt} · {student.degrees} graus
              </p>
              <p className="text-xs text-on-primary-container/70">{student.teamName}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Histórico financeiro (ALU-02) */}
      <h3 className="mt-6 mb-2 font-semibold">Minhas Mensalidades</h3>
      <div className="space-y-2">
        {payments?.map((p) => (
          <Card key={p.id} className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{monthNames[p.month]} {p.year}</p>
              <p className="text-sm text-on-surface-variant">
                Vencimento dia {new Date(p.dueDate).getDate()} · R$ {p.amount.toFixed(2)}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs text-white ${statusColor[p.status]}`}>
              {statusLabel[p.status]}
            </span>
          </Card>
        ))}
        {payments?.length === 0 && (
          <p className="text-sm text-on-surface-variant">Nenhuma mensalidade registrada.</p>
        )}
      </div>
    </div>
  );
}
