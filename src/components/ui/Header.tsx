"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  pendingCount?: number;
}

const navLinks = [
  { href: "/professor/dashboard", label: "Dashboard" },
  { href: "/professor/alunos", label: "Alunos" },
  { href: "/professor/financeiro", label: "Financeiro" },
  { href: "/professor/campeonatos", label: "Torneios" },
];

const teams = [
  "Equipe Adulto Noite",
  "Kids & Juvenil Manhã",
  "Competição Matutino",
];

export default function Header({ pendingCount = 0 }: HeaderProps) {
  const pathname = usePathname();
  const [teamOpen, setTeamOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-outline-variant/30 bg-surface/40 backdrop-blur-xl flex justify-between items-center px-gutter h-16 transition-all duration-300">
      {/* Left side: Logo + Team Selector */}
      <div className="flex items-center gap-4">
        <Link
          href="/professor/dashboard"
          className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary italic uppercase leading-none mt-1"
        >
          FORJA
        </Link>

        {/* Desktop Team Selector */}
        <div className="relative ml-8 hidden md:block">
          <button
            onClick={() => setTeamOpen(!teamOpen)}
            className="flex items-center gap-2 bg-surface-container-high border border-outline-variant rounded-[12px] px-4 py-1.5 text-on-surface hover:text-primary transition-colors text-label-bold font-label-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              sports_martial_arts
            </span>
            <span>{selectedTeam}</span>
            <span className="material-symbols-outlined text-[18px]">
              arrow_drop_down
            </span>
          </button>

          {teamOpen && (
            <div className="absolute top-10 left-0 bg-surface-container border border-outline-variant rounded-xl p-2 shadow-2xl w-56 z-50 animate-fade-in">
              {teams.map((team) => (
                <button
                  key={team}
                  onClick={() => {
                    setSelectedTeam(team);
                    setTeamOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-label-bold rounded-lg flex items-center justify-between transition-colors ${
                    selectedTeam === team
                      ? "text-on-surface hover:bg-surface-bright"
                      : "text-on-surface-variant hover:bg-surface-bright"
                  }`}
                >
                  {team}
                  {selectedTeam === team && (
                    <span className="text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Desktop Navigation */}
      <nav className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-headline-md text-headline-md active:scale-95 transition-all duration-200 ${
                isActive
                  ? "text-primary font-bold"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Right side: Notifications + Avatar */}
      <div className="flex items-center gap-4">
        <Link
          href="/professor/aprovacao"
          className="text-on-surface-variant hover:text-primary transition-colors active:scale-95 relative p-2"
          title="Fila de Aprovação"
        >
          <span className="material-symbols-outlined">notifications</span>
          {pendingCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
          )}
        </Link>
        <Link href="/aluno/perfil">
          <img
            className="w-10 h-10 rounded-full border border-outline-variant object-cover ml-2 cursor-pointer hover:border-primary transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9pywuhRmEAu-cw0r_iWddjzTtbmME8vAzMnRII1SWBlv8HSV90JMYv3dw9vgErjm8VZKi4s_XA0QMdyHlYhQzD7QZmKOhAPLBy5ig4UmCWR9HBo8sg3vAwEkTY8v8fIrW9he2gXRbINyHftffOeOMonTSNZtyQHCD_e0sILl4ye10glpruJZETiPofGYcSVpP1420L1Ubs-sBwVdm5uvDRN9BAfz1C7ohh4bxJEu66HxfCVIO8MTy"
            alt="Professor avatar"
          />
        </Link>
      </div>

      {/* Click outside to close dropdown */}
      {teamOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setTeamOpen(false)}
        />
      )}
    </header>
  );
}
