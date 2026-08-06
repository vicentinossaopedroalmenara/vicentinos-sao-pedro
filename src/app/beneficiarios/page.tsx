"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useBeneficiariesList } from "./_hooks/useBeneficiariesList";
import { BeneficiaryCardRow } from "./_components/BeneficiaryCardRow";
import { BeneficiariesFilterBar } from "./_components/BeneficiariesFilterBar";
import { BeneficiariesPagination } from "./_components/BeneficiariesPagination";
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowLeft } from "lucide-react";

export default function BeneficiariesListPage() {
  const {
    t,
    router,
    items,
    loading,
    page,
    totalPages,
    totalCount,
    search,
    setSearch,
    handlePageChange,
    handleToggleStatus,
    handleDelete,
  } = useBeneficiariesList();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Topo e Botão Cadastrar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="h-7 w-7 text-blue-600" />
            {t("listTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {t("listSubtitle")}
          </p>
        </div>

        <Button asChild variant="default" size="lg" className="shrink-0 bg-sky-500 hover:bg-sky-400 text-white font-black shadow-xl rounded-2xl">
          <Link href="/beneficiarios/cadastro" className="flex items-center gap-2">
            <Plus className="h-5 w-5 stroke-[3]" />
            <span>{t("btnNew")}</span>
          </Link>
        </Button>
      </div>

      {/* Componente Modular da Barra de Pesquisa */}
      <BeneficiariesFilterBar
        search={search}
        onSearchChange={setSearch}
        totalCount={totalCount}
        placeholder={t("searchPlaceholder")}
      />

      {/* Tabela / Grid de Componentes de Linha */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-blue-500/20 border-t-blue-500 animate-spin" />
          <span className="text-xs font-mono text-slate-500">Consultando cadastros na base...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-3 shadow-sm">
          <span className="text-4xl">👥</span>
          <h3 className="text-lg font-bold text-slate-900 max-w-md">{t("empty")}</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Nenhum registro localizado no banco. Comece incluindo um novo assistido no botão acima.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <BeneficiaryCardRow
              key={item.id}
              item={item}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
              onEdit={(id) => router.push(`/beneficiarios/cadastro?id=${id}`)}
              t={t}
            />
          ))}
        </div>
      )}

      {/* Componente Modular de Paginação */}
      <BeneficiariesPagination
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
