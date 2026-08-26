"use client";

import { useState } from "react";
import Header from "@/components/ui/Header";
import Toast from "@/components/ui/Toast";
import DemoSwitcher from "@/components/ui/DemoSwitcher";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  belt: string;
  maxWeight: string;
  gender: string;
  ageGroup: string;
}

export default function TournamentConfigPage() {
  const [activeTab, setActiveTab] = useState<"geral" | "categorias" | "atletas">("geral");

  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Adulto Azul Médio", belt: "azul", maxWeight: "82.3 kg", gender: "Masculino", ageGroup: "Adulto" },
    { id: "2", name: "Adulto Branca Leve", belt: "branca", maxWeight: "76.0 kg", gender: "Masculino", ageGroup: "Adulto" },
  ]);

  const [newCatName, setNewCatName] = useState("");
  const [newCatBelt, setNewCatBelt] = useState("branca");
  const [newCatWeight, setNewCatWeight] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    const newCat: Category = {
      id: String(categories.length + 1),
      name: newCatName,
      belt: newCatBelt,
      maxWeight: newCatWeight ? `${newCatWeight} kg` : "Livre",
      gender: "Masculino",
      ageGroup: "Adulto",
    };

    setCategories([...categories, newCat]);
    setNewCatName("");
    setNewCatWeight("");
    setToastMessage(`⚡ Categoria '${newCat.name}' adicionada ao evento!`);
  };

  return (
    <main className="min-h-screen bg-background text-on-surface pb-16 pt-20">
      <Header />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant my-4">
          <Link href="/professor/dashboard" className="hover:text-primary transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/professor/campeonatos" className="hover:text-primary transition-colors">
            Campeonatos Internos
          </Link>
          <span>/</span>
          <span className="text-on-surface font-bold">Configurar Evento</span>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="font-display font-bold text-2xl text-on-surface">1º Torneio Interno Forja 2026</h1>
            <p className="text-xs text-on-surface-variant">Configuração de categorias, pesagem e montagem de chaves.</p>
          </div>
          <Link
            href="/campeonato/1"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1 shadow cursor-pointer"
          >
            <span>Ver Chave ao Vivo</span>
            <span className="material-symbols-outlined text-sm">play_arrow</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-outline-variant/30 mb-6 gap-4 font-bold text-xs">
          <button
            onClick={() => setActiveTab("geral")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 ${
              activeTab === "geral"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            1. Informações Gerais
          </button>
          <button
            onClick={() => setActiveTab("categorias")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 ${
              activeTab === "categorias"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            2. Categorias ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("atletas")}
            className={`pb-3 px-2 transition-all cursor-pointer border-b-2 ${
              activeTab === "atletas"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            3. Alunos Inscritos & Pesagem
          </button>
        </div>

        {/* Tab 1: Info Geral */}
        {activeTab === "geral" && (
          <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-6 shadow-xl space-y-4 animate-fade-in">
            <h3 className="font-bold text-base text-on-surface">Dados do Torneio Interno</h3>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">Título do Campeonato</label>
              <input
                type="text"
                defaultValue="1º Torneio Interno Forja 2026"
                className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2.5 px-3 text-xs text-on-surface outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Data do Evento</label>
                <input
                  type="date"
                  defaultValue="2026-09-15"
                  className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2.5 px-3 text-xs text-on-surface outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-1">Local no Tatame</label>
                <input
                  type="text"
                  defaultValue="Tatame Principal - Academia HQ"
                  className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg py-2.5 px-3 text-xs text-on-surface outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant mb-1">Regras Especiais</label>
              <textarea
                rows={3}
                defaultValue="Regras oficiais IBJJF. Lutas de 5 minutos. Obrigatório kimono limpo e unhas cortadas."
                className="w-full bg-surface-dim border border-outline-variant/40 rounded-lg p-3 text-xs text-on-surface outline-none"
              />
            </div>
            <button
              onClick={() => setToastMessage("Salvo com sucesso!")}
              className="bg-primary-container text-white font-bold text-xs px-6 py-2.5 rounded-lg hover:bg-secondary-container transition-all cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        )}

        {/* Tab 2: Categorias */}
        {activeTab === "categorias" && (
          <div className="space-y-6 animate-fade-in">
            {/* Form Nova Categoria */}
            <form onSubmit={handleAddCategory} className="bg-surface-container border border-outline-variant/40 rounded-xl p-5 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-on-surface">+ Adicionar Nova Categoria</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nome da Categoria (ex: Azul Leve)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="bg-surface-dim border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-on-surface outline-none"
                />
                <select
                  value={newCatBelt}
                  onChange={(e) => setNewCatBelt(e.target.value)}
                  className="bg-surface-dim border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-on-surface outline-none"
                >
                  <option value="branca">Faixa Branca</option>
                  <option value="azul">Faixa Azul</option>
                  <option value="roxa">Faixa Roxa</option>
                  <option value="marrom">Faixa Marrom</option>
                  <option value="preta">Faixa Preta</option>
                </select>
                <input
                  type="text"
                  placeholder="Peso Máximo (ex: 82.3)"
                  value={newCatWeight}
                  onChange={(e) => setNewCatWeight(e.target.value)}
                  className="bg-surface-dim border border-outline-variant/40 rounded-lg py-2 px-3 text-xs text-on-surface outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-container text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-secondary-container transition-all cursor-pointer"
              >
                Adicionar Categoria
              </button>
            </form>

            {/* Lista de Categorias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="bg-surface-container border border-outline-variant/40 rounded-xl p-4 shadow-lg flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-on-surface">{c.name}</h4>
                    <p className="text-xs text-on-surface-variant">
                      Faixa {c.belt} • Limite: {c.maxWeight}
                    </p>
                  </div>
                  <span className="text-[10px] bg-primary-container/20 text-primary px-2.5 py-1 rounded font-mono font-bold">
                    Ativa
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Atletas & Pesagem */}
        {activeTab === "atletas" && (
          <div className="bg-surface-container border border-outline-variant/40 rounded-xl p-6 shadow-xl space-y-4 animate-fade-in">
            <h3 className="font-bold text-base text-on-surface">Confirmação de Pesagem no Tatame</h3>
            <p className="text-xs text-on-surface-variant">Marque a pesagem realizada antes de gerar as chaves.</p>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface-dim rounded-lg border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/40 flex items-center justify-center font-bold text-xs">
                    L
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Lucas Almeida Silva</div>
                    <div className="text-[10px] text-on-surface-variant">Categoria: Adulto Azul Médio</div>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-500/40 font-bold">
                  🟢 Peso OK (81.2 kg)
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-surface-dim rounded-lg border border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container border border-outline-variant/40 flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <div>
                    <div className="font-bold text-xs text-on-surface">Matheus Henrique</div>
                    <div className="text-[10px] text-on-surface-variant">Categoria: Adulto Branca Leve</div>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded border border-emerald-500/40 font-bold">
                  🟢 Peso OK (75.1 kg)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <Toast message={toastMessage} isOpen={!!toastMessage} onClose={() => setToastMessage("")} />
      <DemoSwitcher />
    </main>
  );
}
