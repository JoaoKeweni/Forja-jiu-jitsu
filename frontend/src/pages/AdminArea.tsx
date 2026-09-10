import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  useAcademies, useCreateAcademy, useAcademyTeams, useCreateTeam,
  useProfessors, useCreateProfessor, useDeleteProfessor,
} from "../api/adminHooks";
import { apiError } from "../api/client";
import { Button, Card, Input } from "../components/ui";
import { Loading, EmptyState } from "../components/States";
import { useToast } from "../components/Toast";
import type { AcademyDto, TeamDto } from "../api/types";

type Tab = "academias" | "professores";

export default function AdminArea() {
  const { logout } = useAuth();
  const { data: academies } = useAcademies();
  const [tab, setTab] = useState<Tab>("academias");

  return (
    <div className="mx-auto max-w-5xl p-4">
      <header className="flex items-center justify-between py-4">
        <h1 className="font-display text-xl font-bold text-primary">Forja · Super Admin</h1>
        <Button variant="ghost" onClick={logout}>Sair</Button>
      </header>

      {/* KPIs (SA-01) */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Card><p className="text-sm text-on-surface-variant">Academias</p><p className="text-2xl font-bold">{academies?.length ?? 0}</p></Card>
        <Card><p className="text-sm text-on-surface-variant">Equipes</p><p className="text-2xl font-bold">{academies?.reduce((a, x) => a + x.teamCount, 0) ?? 0}</p></Card>
        <Card><p className="text-sm text-on-surface-variant">Alunos</p><p className="text-2xl font-bold">{academies?.reduce((a, x) => a + x.studentCount, 0) ?? 0}</p></Card>
      </div>

      <nav className="mb-4 flex gap-2">
        {(["academias", "professores"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high"
            }`}>
            {t}
          </button>
        ))}
      </nav>

      {tab === "academias" ? <AcademiesTab /> : <ProfessorsTab academies={academies ?? []} />}
    </div>
  );
}

// ── Academias & Equipes (SA-02) ──
function AcademiesTab() {
  const { data: academies, isLoading } = useAcademies();
  const create = useCreateAcademy();
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", address: "", phone: "" });
  const [error, setError] = useState("");

  async function onCreate() {
    setError("");
    try {
      await create.mutateAsync(form);
      setForm({ name: "", slug: "", address: "", phone: "" });
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <>
      <Card className="mb-4">
        <h3 className="mb-3 font-semibold">Nova Academia</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="slug-url" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input placeholder="Endereço" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <Input placeholder="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        {error && <p className="mt-2 text-sm text-error">{error}</p>}
        <Button className="mt-3" onClick={onCreate} disabled={create.isPending || !form.name || !form.slug}>
          Criar Academia
        </Button>
      </Card>

      {isLoading ? <Loading /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {academies?.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-on-surface-variant">/{a.slug}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelected(selected === a.id ? null : a.id)}>
                  Equipes ({a.teamCount})
                </Button>
              </div>
              {selected === a.id && <TeamManager academyId={a.id} />}
            </Card>
          ))}
          {academies?.length === 0 && <EmptyState message="Nenhuma academia cadastrada." />}
        </div>
      )}
    </>
  );
}

function TeamManager({ academyId }: { academyId: string }) {
  const { data: teams } = useAcademyTeams(academyId);
  const create = useCreateTeam(academyId);
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");

  return (
    <div className="mt-4 border-t border-outline-variant/30 pt-3">
      <div className="mb-2 flex flex-wrap gap-2">
        <Input placeholder="Nome da equipe" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" />
        <Input placeholder="Horário" value={schedule} onChange={(e) => setSchedule(e.target.value)} className="flex-1" />
        <Button onClick={() => { create.mutate({ name, schedule }); setName(""); setSchedule(""); }} disabled={!name}>+</Button>
      </div>
      <ul className="space-y-1 text-sm">
        {teams?.map((t) => (
          <li key={t.id} className="flex justify-between text-on-surface-variant">
            <span>{t.name}</span><span>{t.schedule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Professores (SA-03) ──
function ProfessorsTab({ academies }: { academies: AcademyDto[] }) {
  const { data: professors, isLoading } = useProfessors();
  const create = useCreateProfessor();
  const del = useDeleteProfessor();
  const toast = useToast();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [teamIds, setTeamIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  function toggleTeam(id: string) {
    setTeamIds((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]);
  }

  async function onCreate() {
    setError("");
    try {
      await create.mutateAsync({ ...form, teamIds });
      setForm({ fullName: "", email: "", phone: "", password: "" });
      setTeamIds([]);
      toast.show("Professor cadastrado!", "success");
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <>
      <Card className="mb-4">
        <h3 className="mb-3 font-semibold">Novo Professor</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          <Input placeholder="Nome" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <Input type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input type="password" placeholder="Senha inicial" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>

        {/* Vínculo de equipes (checklist multi-seleção) */}
        <p className="mt-3 mb-1 text-sm text-on-surface-variant">Equipes que pode gerenciar:</p>
        <div className="space-y-3">
          {academies.map((a) => <AcademyTeamChecklist key={a.id} academy={a} selected={teamIds} onToggle={toggleTeam} />)}
        </div>

        {error && <p className="mt-2 text-sm text-error">{error}</p>}
        <Button className="mt-3" onClick={onCreate}
          disabled={create.isPending || !form.fullName || !form.email || !form.password}>
          Salvar Credenciais do Professor
        </Button>
      </Card>

      {isLoading ? <Loading /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {professors?.map((p) => (
            <Card key={p.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{p.fullName}</p>
                  <p className="text-sm text-on-surface-variant">{p.email}</p>
                  <p className="text-xs text-on-surface-variant">{p.teamIds.length} equipe(s)</p>
                </div>
                <Button variant="danger" className="py-1 text-xs"
                  onClick={() => del.mutate(p.id)} disabled={del.isPending}>
                  Remover
                </Button>
              </div>
            </Card>
          ))}
          {professors?.length === 0 && <EmptyState message="Nenhum professor cadastrado." />}
        </div>
      )}
    </>
  );
}

function AcademyTeamChecklist({ academy, selected, onToggle }: {
  academy: AcademyDto; selected: string[]; onToggle: (id: string) => void;
}) {
  const { data: teams } = useAcademyTeams(academy.id);
  if (!teams || teams.length === 0) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-on-surface">{academy.name}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        {teams.map((t: TeamDto) => (
          <label key={t.id}
            className={`cursor-pointer rounded-lg px-2 py-1 text-xs transition ${
              selected.includes(t.id) ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high"
            }`}>
            <input type="checkbox" className="mr-1" checked={selected.includes(t.id)} onChange={() => onToggle(t.id)} />
            {t.name}
          </label>
        ))}
      </div>
    </div>
  );
}
