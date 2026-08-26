"use client";

import { useState } from "react";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Modal from "@/components/ui/Modal";
import Toast from "@/components/ui/Toast";

export default function SuperAdminDashboard() {
  const [academies, setAcademies] = useState([
    { id: "1", name: "Gracie Barra Matriz", slug: "gracie-barra-matriz", teams: 4, professors: 3, students: 85, status: "Ativo" },
    { id: "2", name: "Alliance São Paulo", slug: "alliance-sp", teams: 3, professors: 2, students: 60, status: "Ativo" },
    { id: "3", name: "Checkmat Sede", slug: "checkmat-sede", teams: 2, professors: 2, students: 42, status: "Ativo" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAcademyName, setNewAcademyName] = useState("");
  const [newAcademyPhone, setNewAcademyPhone] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleAddAcademy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcademyName) return;

    const slug = generateSlug(newAcademyName);
    const newAcad = {
      id: String(academies.length + 1),
      name: newAcademyName,
      slug: slug,
      teams: 1,
      professors: 1,
      students: 0,
      status: "Ativo",
    };

    setAcademies([...academies, newAcad]);
    setIsModalOpen(false);
    setNewAcademyName("");
    setNewAcademyPhone("");
    setToastMessage(`Academia '${newAcad.name}' criada com URL: forja.app/${slug}`);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface p-4 md:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-black italic tracking-tighter text-primary">FORJA</h1>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold">
              Super Admin SaaS
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">Gestão Central de Academias, Equipes e Licenças</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container hover:bg-secondary-container text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary-container/20"
        >
          <span className="material-symbols-outlined text-lg">add_business</span>
          <span>+ Nova Academia</span>
        </button>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase">Academias Parceria</span>
            <span className="material-symbols-outlined text-primary text-xl">domain</span>
          </div>
          <div className="text-3xl font-bold font-display text-on-surface">{academies.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Ativas</div>
        </div>

        <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase">Equipes / Horários</span>
            <span className="material-symbols-outlined text-tertiary text-xl">groups</span>
          </div>
          <div className="text-3xl font-bold font-display text-on-surface">
            {academies.reduce((acc, curr) => acc + curr.teams, 0)}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">Distribuídas na rede</div>
        </div>

        <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase">Professores</span>
            <span className="material-symbols-outlined text-secondary text-xl">sports_martial_arts</span>
          </div>
          <div className="text-3xl font-bold font-display text-on-surface">
            {academies.reduce((acc, curr) => acc + curr.professors, 0)}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-1">Com acesso autorizado</div>
        </div>

        <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-lg">
          <div className="flex justify-between items-center text-on-surface-variant mb-2">
            <span className="text-xs font-bold uppercase">Alunos Ativos</span>
            <span className="material-symbols-outlined text-emerald-400 text-xl">person_add</span>
          </div>
          <div className="text-3xl font-bold font-display text-on-surface">
            {academies.reduce((acc, curr) => acc + curr.students, 0)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">+12% este mês</div>
        </div>
      </div>

      {/* Table of Academies */}
      <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-6 shadow-xl">
        <h2 className="font-display font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">store</span>
          Academias Cadastradas & URLs Exclusivas (Multi-Tenant)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase font-mono">
                <th className="py-3 px-4">Academia</th>
                <th className="py-3 px-4">URL Exclusiva (Slug)</th>
                <th className="py-3 px-4">Equipes</th>
                <th className="py-3 px-4">Professores</th>
                <th className="py-3 px-4">Alunos</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {academies.map((acad) => (
                <tr key={acad.id} className="hover:bg-surface-variant/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-on-surface text-sm">{acad.name}</td>
                  <td className="py-4 px-4 font-mono text-primary">
                    <span className="bg-surface-dim px-2.5 py-1 rounded border border-outline-variant/30">
                      forja.app/{acad.slug}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-on-surface-variant">{acad.teams} equipes</td>
                  <td className="py-4 px-4 text-on-surface-variant">{acad.professors} profs</td>
                  <td className="py-4 px-4 font-bold text-on-surface">{acad.students} alunos</td>
                  <td className="py-4 px-4">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {acad.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <a
                      href={`/${acad.slug}/login`}
                      className="text-xs bg-surface-variant hover:bg-surface-bright text-on-surface px-3 py-1.5 rounded-lg border border-outline-variant/40 inline-flex items-center gap-1 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      <span>Acessar Portal</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Academia */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="⚡ Cadastrar Nova Academia">
        <form onSubmit={handleAddAcademy} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Nome da Academia</label>
            <input
              type="text"
              required
              placeholder="Ex: Gracie Barra Centro"
              value={newAcademyName}
              onChange={(e) => setNewAcademyName(e.target.value)}
              className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2.5 px-3 text-sm text-on-surface outline-none focus:border-primary-container"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Prévia da URL Gerada</label>
            <div className="bg-surface-dim p-3 rounded-lg border border-outline-variant/40 text-xs font-mono text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">link</span>
              <span>forja.app/{newAcademyName ? generateSlug(newAcademyName) : "slug-da-academia"}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Telefone do Responsável</label>
            <input
              type="tel"
              placeholder="(11) 99999-0000"
              value={newAcademyPhone}
              onChange={(e) => setNewAcademyPhone(e.target.value)}
              className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2.5 px-3 text-sm text-on-surface outline-none focus:border-primary-container"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-container text-white font-bold py-3 rounded-lg mt-4 hover:bg-secondary-container transition-all cursor-pointer shadow-lg shadow-primary-container/20"
          >
            Cadastrar & Gerar Portal Exclusivo
          </button>
        </form>
      </Modal>

      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
