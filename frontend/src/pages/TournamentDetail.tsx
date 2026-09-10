import { useState } from "react";
import {
  useCategories, useCreateCategory, useEnrollStudent, useGenerateBracket,
  useMatches, useRecordResult, useStudents,
} from "../api/hooks";
import { apiError } from "../api/client";
import { Button, Card, Input } from "../components/ui";
import type { BeltType, CategoryDto, MatchDto, TournamentDto } from "../api/types";

const BELTS: BeltType[] = ["Branca", "Cinza", "Amarela", "Laranja", "Verde", "Azul", "Roxa", "Marrom", "Preta"];

export default function TournamentDetail({ tournament, onClose }: {
  tournament: TournamentDto; onClose: () => void;
}) {
  const { data: categories } = useCategories(tournament.id);
  const [selectedCat, setSelectedCat] = useState<CategoryDto | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-2xl bg-surface-container p-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-bold text-primary">{tournament.title}</h2>
            <p className="text-sm text-on-surface-variant">
              {new Date(tournament.eventDate).toLocaleDateString("pt-BR")} · {tournament.status}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose}>Fechar</Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <CategoriesPanel
            tournamentId={tournament.id}
            categories={categories ?? []}
            selected={selectedCat}
            onSelect={setSelectedCat}
          />
          <div>
            {selectedCat ? (
              <CategoryDetail academyId={tournament.academyId} category={selectedCat} />
            ) : (
              <p className="text-sm text-on-surface-variant">
                Selecione uma categoria para inscrever alunos e gerar o chaveamento.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoriesPanel({ tournamentId, categories, selected, onSelect }: {
  tournamentId: string; categories: CategoryDto[];
  selected: CategoryDto | null; onSelect: (c: CategoryDto) => void;
}) {
  const create = useCreateCategory(tournamentId);
  const [title, setTitle] = useState("");
  const [belt, setBelt] = useState<BeltType>("Azul");
  const [error, setError] = useState("");

  async function onCreate() {
    setError("");
    try {
      await create.mutateAsync({ title, belt, ageGroup: "Adulto", gender: "Masculino" });
      setTitle("");
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold">Categorias</h3>
      <div className="mb-3 space-y-2">
        <Input placeholder="Nome da categoria" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex gap-2">
          <select
            className="flex-1 rounded-lg bg-surface-container-low border border-outline-variant px-2 py-1.5 text-sm"
            value={belt} onChange={(e) => setBelt(e.target.value as BeltType)}
          >
            {BELTS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <Button onClick={onCreate} disabled={create.isPending || !title}>+ Add</Button>
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
      </div>

      <ul className="space-y-1">
        {categories.map((c) => (
          <li key={c.id}>
            <button
              onClick={() => onSelect(c)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                selected?.id === c.id ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high"
              }`}
            >
              {c.title} <span className="opacity-70">· {c.belt} · {c.enrollmentCount} inscritos</span>
            </button>
          </li>
        ))}
        {categories.length === 0 && <li className="text-sm text-on-surface-variant">Nenhuma categoria.</li>}
      </ul>
    </div>
  );
}

function CategoryDetail({ academyId, category }: { academyId: string; category: CategoryDto }) {
  const { data: activeStudents } = useStudents(undefined, "Active");
  const { data: matches } = useMatches(category.id);
  const enroll = useEnrollStudent(category.id);
  const generate = useGenerateBracket(category.id);
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState("");

  // Somente alunos da academia do torneio (RN-05).
  const eligible = activeStudents?.filter((s) => s.academyId === academyId) ?? [];

  async function onEnroll() {
    setError("");
    try {
      await enroll.mutateAsync(studentId);
      setStudentId("");
    } catch (err) {
      setError(apiError(err));
    }
  }

  async function onGenerate() {
    setError("");
    try {
      await generate.mutateAsync();
    } catch (err) {
      setError(apiError(err));
    }
  }

  return (
    <div>
      <h3 className="mb-2 font-semibold">{category.title}</h3>

      {/* Inscrição (RN-05) */}
      <div className="mb-3 flex gap-2">
        <select
          className="flex-1 rounded-lg bg-surface-container-low border border-outline-variant px-2 py-1.5 text-sm"
          value={studentId} onChange={(e) => setStudentId(e.target.value)}
        >
          <option value="">Inscrever aluno ativo…</option>
          {eligible.map((s) => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
        <Button onClick={onEnroll} disabled={enroll.isPending || !studentId}>Inscrever</Button>
      </div>

      <Button variant="ghost" className="mb-3 w-full" onClick={onGenerate} disabled={generate.isPending}>
        ⚡ Gerar Chaveamento
      </Button>
      {error && <p className="mb-2 text-sm text-error">{error}</p>}

      {/* Chaveamento / súmula (ADM-07) */}
      <div className="space-y-2">
        {matches?.map((m) => <MatchRow key={m.id} categoryId={category.id} match={m} />)}
        {matches?.length === 0 && (
          <p className="text-sm text-on-surface-variant">Sem lutas ainda. Inscreva alunos e gere o chaveamento.</p>
        )}
      </div>
    </div>
  );
}

function MatchRow({ categoryId, match }: { categoryId: string; match: MatchDto }) {
  const record = useRecordResult(categoryId);
  const finished = match.status === "Finished";
  const canFight = match.fighter1Id && match.fighter2Id && !finished;

  return (
    <Card className="p-3">
      <p className="text-xs uppercase tracking-wide text-on-surface-variant">{match.roundName}</p>
      <div className="mt-1 flex items-center justify-between text-sm">
        <span className={match.winnerId === match.fighter1Id ? "font-bold text-status-paid" : ""}>
          {match.fighter1Name ?? "—"}
        </span>
        <span className="text-on-surface-variant">vs</span>
        <span className={match.winnerId === match.fighter2Id ? "font-bold text-status-paid" : ""}>
          {match.fighter2Name ?? "—"}
        </span>
      </div>

      {finished ? (
        <p className="mt-1 text-xs text-on-surface-variant">
          Vencedor definido{match.victoryType ? ` · ${match.victoryType}` : ""}
        </p>
      ) : canFight ? (
        <div className="mt-2 flex gap-2">
          <Button className="flex-1 py-1 text-xs"
            onClick={() => record.mutate({ matchId: match.id, winnerId: match.fighter1Id!, victoryType: "Pontos" })}
            disabled={record.isPending}>
            Vence {match.fighter1Name}
          </Button>
          <Button className="flex-1 py-1 text-xs"
            onClick={() => record.mutate({ matchId: match.id, winnerId: match.fighter2Id!, victoryType: "Pontos" })}
            disabled={record.isPending}>
            Vence {match.fighter2Name}
          </Button>
        </div>
      ) : (
        <p className="mt-1 text-xs text-on-surface-variant">Aguardando adversário.</p>
      )}
    </Card>
  );
}
