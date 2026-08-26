"use client";

import { useState } from "react";

interface TeamSelectorProps {
  onTeamChange?: (teamId: string) => void;
}

export default function TeamSelector({ onTeamChange }: TeamSelectorProps) {
  const [selectedTeam, setSelectedTeam] = useState("t1");

  const teams = [
    { id: "all", name: "🥋 Todas as Equipes" },
    { id: "t1", name: "🥋 Equipe Adulto Noite" },
    { id: "t2", name: "🥋 Equipe Manhã" },
    { id: "t3", name: "🥋 Equipe Infantil" },
    { id: "t4", name: "🥋 Equipe Competição" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTeam(val);
    if (onTeamChange) onTeamChange(val);
  };

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <select
        value={selectedTeam}
        onChange={handleChange}
        className="w-full bg-surface-container border border-primary-container/40 text-on-surface font-label-bold text-sm rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none cursor-pointer shadow-sm transition-all"
      >
        {teams.map((t) => (
          <option key={t.id} value={t.id} className="bg-surface-container text-on-surface py-2">
            {t.name}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none text-xl">
        expand_more
      </span>
    </div>
  );
}
