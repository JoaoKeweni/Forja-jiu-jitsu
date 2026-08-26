"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";

interface MatchNode {
  id: string;
  round: "quartas" | "semi" | "final";
  fighter1: { name: string; belt: string; academy: string; winner?: boolean };
  fighter2: { name: string; belt: string; academy: string; winner?: boolean };
  status: "pending" | "live" | "finished";
  score?: string;
  victoryType?: string;
}

export default function LiveTournamentBracketPage() {
  const [matches, setMatches] = useState<MatchNode[]>([
    {
      id: "m1",
      round: "semi",
      fighter1: { name: "Lucas Almeida", belt: "azul", academy: "Gracie Barra" },
      fighter2: { name: "Matheus Henrique", belt: "azul", academy: "Gracie Barra" },
      status: "live",
    },
    {
      id: "m2",
      round: "semi",
      fighter1: { name: "Rafael Costa", belt: "azul", academy: "Alliance" },
      fighter2: { name: "Bruno Lima", belt: "azul", academy: "Checkmat" },
      status: "pending",
    },
    {
      id: "m3",
      round: "final",
      fighter1: { name: "Aguardando Vencedor M1", belt: "azul", academy: "-" },
      fighter2: { name: "Aguardando Vencedor M2", belt: "azul", academy: "-" },
      status: "pending",
    },
  ]);

  const [selectedMatch, setSelectedMatch] = useState<MatchNode | null>(null);
  const [winnerChoice, setWinnerChoice] = useState<1 | 2>(1);
  const [victoryType, setVictoryType] = useState("Armlock (Finalização)");
  const [score, setScore] = useState("4 x 2");
  const [toastMessage, setToastMessage] = useState("");

  const handleSaveResult = () => {
    if (!selectedMatch) return;

    const winnerName = winnerChoice === 1 ? selectedMatch.fighter1.name : selectedMatch.fighter2.name;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === selectedMatch.id) {
          return {
            ...m,
            status: "finished",
            score: score,
            victoryType: victoryType,
            fighter1: { ...m.fighter1, winner: winnerChoice === 1 },
            fighter2: { ...m.fighter2, winner: winnerChoice === 2 },
          };
        }
        if (m.round === "final") {
          if (selectedMatch.id === "m1") {
            return { ...m, fighter1: { ...m.fighter1, name: winnerName } };
          }
          if (selectedMatch.id === "m2") {
            return { ...m, fighter2: { ...m.fighter2, name: winnerName } };
          }
        }
        return m;
      })
    );

    setToastMessage(`🏆 Vencedor registrado: ${winnerName} via ${victoryType}!`);
    setSelectedMatch(null);
  };

  return (
    <main class="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      {/* Top Header */}
      <div class="max-w-6xl mx-auto mb-8">
        <div class="flex items-center gap-2 text-xs text-on-surface-variant mb-4">
          <Link href="/professor/dashboard" class="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/professor/campeonatos" class="hover:text-primary transition-colors">
            Campeonatos
          </Link>
          <span>/</span>
          <span class="text-on-surface font-bold">Chaveamento Live</span>
        </div>

        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container border border-outline-variant/40 rounded-2xl p-6 shadow-xl">
          <div>
            <div class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-0.5 rounded-full text-xs font-mono font-bold mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Em Andamento no Tatame Principal</span>
            </div>
            <h1 class="font-display font-black text-2xl text-on-surface">1º Torneio Interno Forja 2026</h1>
            <p class="text-xs text-on-surface-variant">Categoria: Adulto Azul Médio (até 82.3kg)</p>
          </div>

          <div class="flex gap-2">
            <span class="bg-surface-dim border border-outline-variant/40 px-3 py-1.5 rounded-lg text-xs font-mono text-on-surface">
              🥋 4 Atletas Matrocinados
            </span>
          </div>
        </div>
      </div>

      {/* Bracket Tree Canvas */}
      <div class="max-w-6xl mx-auto overflow-x-auto pb-12">
        <div class="min-w-[800px] grid grid-cols-2 gap-12 items-center relative py-8">
          {/* Semifinals Column */}
          <div class="space-y-12">
            <h3 class="text-xs font-bold font-mono uppercase tracking-widest text-primary mb-4 text-center">
              — Semifinais —
            </h3>

            {/* Match 1 */}
            <div
              onClick={() => setSelectedMatch(matches[0])}
              class={`bg-surface-container border rounded-xl p-4 shadow-xl cursor-pointer hover:border-primary transition-all relative ${
                matches[0].status === "finished"
                  ? "border-emerald-500/50"
                  : "border-primary-container/60 shadow-primary-container/10"
              }`}
            >
              <div class="flex justify-between items-center text-[11px] text-on-surface-variant font-mono mb-2">
                <span>LUTA #1 (Tatame 1)</span>
                <span
                  class={`px-2 py-0.5 rounded font-bold ${
                    matches[0].status === "finished"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-primary-container text-white animate-pulse"
                  }`}
                >
                  {matches[0].status === "finished" ? "Finalizada" : "EM ANDAMENTO"}
                </span>
              </div>

              {/* Fighter 1 */}
              <div
                class={`p-2.5 rounded-lg flex justify-between items-center text-xs mb-2 transition-colors ${
                  matches[0].fighter1.winner ? "bg-emerald-500/20 font-bold text-emerald-300" : "bg-surface-dim"
                }`}
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-blue-600 border border-blue-400" />
                  <span>{matches[0].fighter1.name}</span>
                </div>
                {matches[0].fighter1.winner && <span class="text-emerald-400 font-bold">Vencedor ✓</span>}
              </div>

              {/* Fighter 2 */}
              <div
                class={`p-2.5 rounded-lg flex justify-between items-center text-xs transition-colors ${
                  matches[0].fighter2.winner ? "bg-emerald-500/20 font-bold text-emerald-300" : "bg-surface-dim"
                }`}
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-blue-600 border border-blue-400" />
                  <span>{matches[0].fighter2.name}</span>
                </div>
                {matches[0].fighter2.winner && <span class="text-emerald-400 font-bold">Vencedor ✓</span>}
              </div>
            </div>

            {/* Match 2 */}
            <div
              onClick={() => setSelectedMatch(matches[1])}
              class="bg-surface-container border border-outline-variant/40 rounded-xl p-4 shadow-xl cursor-pointer hover:border-primary transition-all"
            >
              <div class="flex justify-between items-center text-[11px] text-on-surface-variant font-mono mb-2">
                <span>LUTA #2</span>
                <span class="bg-surface-dim px-2 py-0.5 rounded">Aguardando</span>
              </div>

              <div class="p-2.5 rounded-lg bg-surface-dim flex justify-between items-center text-xs mb-2">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-blue-600 border border-blue-400" />
                  <span>{matches[1].fighter1.name}</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-surface-dim flex justify-between items-center text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-blue-600 border border-blue-400" />
                  <span>{matches[1].fighter2.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Finals Column */}
          <div class="space-y-12">
            <h3 class="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 mb-4 text-center">
              🏆 — Grande Final —
            </h3>

            {/* Match 3 (Final) */}
            <div class="bg-gradient-to-br from-amber-500/10 to-surface-container border-2 border-amber-500/50 rounded-2xl p-6 shadow-2xl relative">
              <div class="flex justify-between items-center text-[11px] text-amber-400 font-mono font-bold mb-3">
                <span>DISPUTA DE OURO</span>
                <span class="bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/40">FINAL</span>
              </div>

              <div class="p-3 rounded-lg bg-surface-dim border border-outline-variant/30 flex justify-between items-center text-xs mb-3">
                <span class="font-bold text-on-surface">{matches[2].fighter1.name}</span>
                <span class="text-amber-400 text-xs">🥇 Finalista 1</span>
              </div>

              <div class="p-3 rounded-lg bg-surface-dim border border-outline-variant/30 flex justify-between items-center text-xs">
                <span class="font-bold text-on-surface">{matches[2].fighter2.name}</span>
                <span class="text-amber-400 text-xs">🥇 Finalista 2</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Súmula / Match Modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title="🥋 Registro de Súmula de Luta"
      >
        {selectedMatch && (
          <div class="space-y-4">
            <p class="text-xs text-on-surface-variant">
              Selecione o vencedor e o tipo de vitória para avançar na chave:
            </p>

            {/* Winner Selection */}
            <div class="space-y-2">
              <label class="block text-xs font-bold text-on-surface">Vencedor do Combate</label>
              <button
                type="button"
                onClick={() => setWinnerChoice(1)}
                class={`w-full p-3 rounded-lg border text-left text-xs font-bold flex justify-between items-center transition-all ${
                  winnerChoice === 1
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                    : "bg-surface-dim border-outline-variant/40 text-on-surface"
                }`}
              >
                <span>1. {selectedMatch.fighter1.name}</span>
                {winnerChoice === 1 && <span>✓ Vencedor</span>}
              </button>

              <button
                type="button"
                onClick={() => setWinnerChoice(2)}
                class={`w-full p-3 rounded-lg border text-left text-xs font-bold flex justify-between items-center transition-all ${
                  winnerChoice === 2
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                    : "bg-surface-dim border-outline-variant/40 text-on-surface"
                }`}
              >
                <span>2. {selectedMatch.fighter2.name}</span>
                {winnerChoice === 2 && <span>✓ Vencedor</span>}
              </button>
            </div>

            <div>
              <label class="block text-xs font-bold text-on-surface mb-1">Tipo de Vitória / Golpes</label>
              <select
                value={victoryType}
                onChange={(e) => setVictoryType(e.target.value)}
                class="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2.5 px-3 text-xs text-on-surface outline-none"
              >
                <option value="Armlock (Finalização)">Armlock (Finalização)</option>
                <option value="Estrangulamento (Finalização)">Estrangulamento (Finalização)</option>
                <option value="Chave de Pé (Finalização)">Chave de Pé (Finalização)</option>
                <option value="Pontos">Pontos (Placar Fim do Tempo)</option>
                <option value="Vantagens">Vantagens</option>
                <option value="Desclassificação">Desclassificação por Punição</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-on-surface mb-1">Placar de Pontos</label>
              <input
                type="text"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                class="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-on-surface outline-none font-mono"
              />
            </div>

            <button
              onClick={handleSaveResult}
              class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-xs transition-all shadow-lg cursor-pointer mt-4"
            >
              Salvar Result e Avançar Vencedor na Chave
            </button>
          </div>
        )}
      </Modal>

      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
