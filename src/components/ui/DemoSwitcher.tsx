"use client";

import { useRouter } from "next/navigation";

const routes = [
  { group: "⚡ Geral", items: [
    { label: "🔑 Login", href: "/gracie-barra/login" },
    { label: "📝 Cadastro Aluno", href: "/gracie-barra/cadastro" },
    { label: "🏆 Campeonato Bracket Live", href: "/campeonato/1" },
  ]},
  { group: "🥋 Professor / Admin Academia", items: [
    { label: "📊 Dashboard Professor", href: "/professor/dashboard" },
    { label: "⏳ Moderação Alunos", href: "/professor/aprovacao" },
    { label: "👥 Gestão de Alunos", href: "/professor/alunos" },
    { label: "💵 Planilha Financeira", href: "/professor/financeiro" },
    { label: "🥇 Lista de Campeonatos", href: "/professor/campeonatos" },
    { label: "⚙️ Config. Evento", href: "/professor/campeonatos/novo" },
  ]},
  { group: "👑 Super Admin (SaaS)", items: [
    { label: "🌐 Dashboard Super Admin", href: "/admin/dashboard" },
  ]},
  { group: "🥋 Aluno", items: [
    { label: "🪪 Perfil & Carteirinha", href: "/aluno/perfil" },
    { label: "💳 Histórico & PIX", href: "/aluno/pagamentos" },
  ]},
];

export default function DemoSwitcher() {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-[#1F2937]/95 border border-[#b91c1c]/50 backdrop-blur-md px-3 py-2 rounded-[12px] shadow-2xl flex items-center gap-2 text-xs font-mono text-on-surface">
      <span className="flex items-center gap-1 font-bold text-[#ffb4ab] px-2">
        <span className="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse" />
        DEMO
      </span>
      <select
        onChange={(e) => {
          if (e.target.value) router.push(e.target.value);
        }}
        className="bg-[#0A0A0A] border border-[#374151] text-on-surface text-xs rounded-[12px] px-3 py-1 focus:outline-none focus:border-[#b91c1c] cursor-pointer"
        defaultValue=""
      >
        <option value="" disabled>Navegar...</option>
        {routes.map((group) => (
          <optgroup key={group.group} label={group.group}>
            {group.items.map((item) => (
              <option key={item.href} value={item.href}>{item.label}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
