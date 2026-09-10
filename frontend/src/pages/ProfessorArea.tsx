import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  useStudents, usePendingStudents, useApproveStudent, useRejectStudent,
  useFinanceGrid, useSettlePayment, useTournaments, useCreateTournament, useMyTeams,
} from "../api/hooks";
import { apiError } from "../api/client";
import { Button, Card, Input } from "../components/ui";
import type { BeltType, PaymentStatus, StudentDto } from "../api/types";

type Tab = "alunos" | "aprovacao" | "financeiro" | "campeonatos";

export default function ProfessorArea() {
  const { logout } = useAuth();
  const [tab, setTab] = useState<Tab>("alunos");
  // Seletor de equipe (RN-02): "" = todas as equipes do professor.
  const [teamId, setTeamId] = useState<string>("");

  const { data: teams } = useMyTeams();

  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="flex flex-wrap items-center justify-between gap-3 py-4">
        <h1 className="font-display text-xl font-bold text-primary">Forja · Professor</h1>
        <div className="flex items-center gap-3">
          {/* Seletor de equipe no topo (ADM-01, RN-02) */}
          <select
            className="rounded-xl bg-surface-container-high border border-outline-variant px-3 py-2 text-sm"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          >
            <option value="">Todas as Equipes</option>
            {teams?.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <Button variant="ghost" onClick={logout}>Sair</Button>
        </div>
      </header>

      <nav className="mb-4 flex gap-2 overflow-x-auto">
        {(["alunos", "aprovacao", "financeiro", "campeonatos"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "alunos" && <StudentsTab teamId={teamId} />}
      {tab === "aprovacao" && <ApprovalTab />}
      {tab === "financeiro" && <FinanceTab teamId={teamId} />}
      {tab === "campeonatos" && <TournamentsTab />}
    </div>
  );
}

// ── Alunos (ADM-02) ──
function StudentsTab({ teamId }: { teamId: string }) {
  const { data: students, isLoading } = useStudents(teamId || undefined);
  if (isLoading) return <p className="text-on-surface-variant">Carregando...</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {students?.map((s) => <StudentCard key={s.id} s={s} />)}
      {students?.length === 0 && <p className="text-on-surface-variant">Nenhum aluno.</p>}
    </div>
  );
}

function StudentCard({ s }: { s: StudentDto }) {
  return (
    <Card className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high">🥋</div>
      <div className="min-w-0">
        <p className="truncate font-medium">{s.fullName}</p>
        <p className="text-sm text-on-surface-variant">Faixa {s.belt} · {s.degrees} graus</p>
        <p className="text-xs text-on-surface-variant">{s.teamName} · vence dia {s.dueDay}</p>
      </div>
    </Card>
  );
}

// ── Aprovação (ADM-08, RN-01) ──
const BELTS: BeltType[] = ["Branca", "Cinza", "Amarela", "Laranja", "Verde", "Azul", "Roxa", "Marrom", "Preta"];
const DUE_DAYS = [5, 10, 15, 20];

function ApprovalTab() {
  const { data: pending, isLoading } = usePendingStudents();
  if (isLoading) return <p className="text-on-surface-variant">Carregando...</p>;
  if (pending?.length === 0) return <p className="text-on-surface-variant">Nenhuma solicitação pendente.</p>;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {pending?.map((s) => <ApprovalCard key={s.id} student={s} />)}
    </div>
  );
}

function ApprovalCard({ student }: { student: StudentDto }) {
  const approve = useApproveStudent();
  const reject = useRejectStudent();
  const [belt, setBelt] = useState<BeltType>("Branca");
  const [degrees, setDegrees] = useState(0);
  const [dueDay, setDueDay] = useState(10);
  const [error, setError] = useState("");

  async function onApprove() {
    setError("");
    try {
      await approve.mutateAsync({ id: student.id, belt, degrees, dueDay });
    } catch (err) {
      setError(apiError(err));
    }
  }

  const selectCls =
    "rounded-lg bg-surface-container-low border border-outline-variant px-2 py-1.5 text-sm";

  return (
    <Card>
      <p className="font-medium">{student.fullName}</p>
      <p className="text-sm text-on-surface-variant">{student.email} · {student.phone}</p>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <label className="text-xs text-on-surface-variant">
          Faixa
          <select className={`mt-1 w-full ${selectCls}`} value={belt}
            onChange={(e) => setBelt(e.target.value as BeltType)}>
            {BELTS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="text-xs text-on-surface-variant">
          Graus
          <select className={`mt-1 w-full ${selectCls}`} value={degrees}
            onChange={(e) => setDegrees(Number(e.target.value))}>
            {[0, 1, 2, 3, 4].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </label>
        <label className="text-xs text-on-surface-variant">
          Vencimento
          <select className={`mt-1 w-full ${selectCls}`} value={dueDay}
            onChange={(e) => setDueDay(Number(e.target.value))}>
            {DUE_DAYS.map((d) => <option key={d} value={d}>dia {d}</option>)}
          </select>
        </label>
      </div>

      {error && <p className="mt-2 text-sm text-error">{error}</p>}

      <div className="mt-3 flex gap-2">
        <Button onClick={onApprove} disabled={approve.isPending}>🟢 Aprovar</Button>
        <Button variant="danger" onClick={() => reject.mutate(student.id)} disabled={reject.isPending}>
          🔴 Recusar
        </Button>
      </div>
    </Card>
  );
}

// ── Financeiro (ADM-04, RN-04) ──
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const statusColor: Record<PaymentStatus, string> = {
  Paid: "bg-status-paid", Pending: "bg-status-pending",
  Overdue: "bg-status-late", Exempt: "bg-status-exempt",
};

function FinanceTab({ teamId }: { teamId: string }) {
  const { data: rows, isLoading } = useFinanceGrid(teamId || undefined, new Date().getFullYear());
  const settle = useSettlePayment();

  if (isLoading) return <p className="text-on-surface-variant">Carregando...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-on-surface-variant">
            <th className="p-2">Aluno</th>
            {monthNames.map((m) => <th key={m} className="p-1 text-center">{m}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row.studentId} className="border-t border-outline-variant/30">
              <td className="p-2 font-medium">{row.fullName}</td>
              {monthNames.map((_, i) => {
                const p = row.payments.find((x) => x.month === i + 1);
                return (
                  <td key={i} className="p-1 text-center">
                    {p ? (
                      <button
                        title={`${p.status} — R$ ${p.amount.toFixed(2)}`}
                        onClick={() => p.status !== "Paid" && settle.mutate({ id: p.id, method: "Pix" })}
                        className={`h-6 w-6 rounded-full ${statusColor[p.status]}`}
                      />
                    ) : <span className="text-on-surface-variant/40">–</span>}
                  </td>
                );
              })}
            </tr>
          ))}
          {rows?.length === 0 && <tr><td className="p-2 text-on-surface-variant" colSpan={13}>Nenhum aluno ativo.</td></tr>}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-on-surface-variant">
        Clique numa célula não paga para dar baixa (PIX). 🟢 Pago · 🟡 A vencer · 🔴 Atrasado · ⚪ Isento
      </p>
    </div>
  );
}

// ── Campeonatos (ADM-05) ──
function TournamentsTab() {
  const { data: tournaments, isLoading } = useTournaments();
  const create = useCreateTournament();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  async function onCreate() {
    setError("");
    try {
      await create.mutateAsync({ title, eventDate: date });
      setTitle(""); setDate("");
    } catch (err) {
      setError(apiError(err));
    }
  }

  if (isLoading) return <p className="text-on-surface-variant">Carregando...</p>;

  return (
    <div>
      <Card className="mb-4">
        <h3 className="mb-3 font-semibold">Criar Campeonato Interno</h3>
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="flex-1" />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
          <Button onClick={onCreate} disabled={create.isPending || !title || !date}>Criar</Button>
        </div>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {tournaments?.map((t) => (
          <Card key={t.id}>
            <p className="font-medium">{t.title}</p>
            <p className="text-sm text-on-surface-variant">
              {new Date(t.eventDate).toLocaleDateString("pt-BR")} · {t.categoryCount} categorias
            </p>
            <span className="mt-2 inline-block rounded-full bg-surface-container-high px-2 py-0.5 text-xs">
              {t.status}
            </span>
          </Card>
        ))}
        {tournaments?.length === 0 && <p className="text-on-surface-variant">Nenhum campeonato.</p>}
      </div>
    </div>
  );
}
