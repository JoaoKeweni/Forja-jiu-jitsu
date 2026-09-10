import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useAcademies, useCreateAcademy, useAcademyTeams, useCreateTeam } from "../api/adminHooks";
import { apiError } from "../api/client";
import { Button, Card, Input } from "../components/ui";

export default function AdminArea() {
  const { logout } = useAuth();
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

      {/* Nova academia (SA-02) */}
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

      {isLoading ? (
        <p className="text-on-surface-variant">Carregando...</p>
      ) : (
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
        </div>
      )}
    </div>
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
