"use client";

import { usePathname, useRouter } from "next/navigation";

export default function DemoSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      id="demo-switcher"
      class="fixed bottom-4 right-4 z-[9999] bg-[#1F2937]/95 border border-[#b91c1c]/50 backdrop-blur-md px-3 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-mono text-on-surface"
    >
      <span class="flex items-center gap-1 font-bold text-[#ffb4ab] px-2">
        <span class="w-2 h-2 rounded-full bg-[#b91c1c] animate-pulse" />
        DEMO SWITCHER
      </span>
      <select
        value={pathname}
        onChange={(e) => {
          if (e.target.value) router.push(e.target.value);
        }}
        class="bg-[#0A0A0A] border border-[#374151] text-on-surface text-xs rounded-full px-3 py-1 focus:outline-none focus:border-[#b91c1c] cursor-pointer"
      >
        <optgroup label="⚡ Geral Multi-Tenant">
          <option value="/gracie-barra-matriz/login">🔑 Login Academia</option>
          <option value="/gracie-barra-matriz/cadastro">📝 Cadastro Aluno (URL Única)</option>
          <option value="/campeonato/1">🏆 Campeonato Bracket Live</option>
        </optgroup>
        <optgroup label="🥋 Professor / Admin Academia">
          <option value="/professor/dashboard">📊 Dashboard Professor</option>
          <option value="/professor/aprovacao">⏳ Moderação Alunos (Pendente)</option>
          <option value="/professor/alunos">👥 Gestão de Alunos</option>
          <option value="/professor/financeiro">💵 Planilha Financeira</option>
          <option value="/professor/campeonatos">🥇 Lista de Campeonatos</option>
          <option value="/professor/campeonatos/novo">⚙️ Config. Evento / Pesagem</option>
        </optgroup>
        <optgroup label="👑 Super Admin (SaaS)">
          <option value="/admin/dashboard">🌐 Dashboard Super Admin</option>
        </optgroup>
        <optgroup label="🥋 Aluno">
          <option value="/aluno/perfil">🪪 Perfil & Carteirinha</option>
          <option value="/aluno/pagamentos">💳 Histórico & PIX</option>
        </optgroup>
      </select>
    </div>
  );
}
