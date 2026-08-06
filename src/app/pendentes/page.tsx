"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { usePendingDeliveries } from "./_hooks/usePendingDeliveries";
import { RegisterDeliveryModal } from "../_components/RegisterDeliveryModal";
import { MonthSelector } from "@/components/ui/month-selector";
import { BeneficiariesFilterBar } from "../beneficiarios/_components/BeneficiariesFilterBar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, UserCheck, Search, ArrowLeft, MapPin, Phone } from "lucide-react";

export default function PendingDeliveriesPage() {
  const {
    t,
    selectedMonth,
    setSelectedMonth,
    loading,
    filterText,
    setFilterText,
    pendingList,
    filteredItems,
    modalOpen,
    setModalOpen,
    activeBeneficiary,
    openModal,
    reloadCurrentMonth,
  } = usePendingDeliveries();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Barra de Topo e Navegação Retornar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Clock className="h-7 w-7 text-amber-500 animate-pulse" />
            {t("pendingTitle")}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {t("pendingSubtitle")}
          </p>
        </div>

        {/* Seletor de Competência (Mês/Ano) */}
        <MonthSelector 
          label={t("monthSelector")}
          value={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>

      {/* Filtro Rápido em Tempo Real */}
      <BeneficiariesFilterBar
        search={filterText}
        onSearchChange={setFilterText}
        placeholder="Buscar família..."
        counterElement={
          <>
            Exibindo: <strong className="text-amber-600 font-black">{filteredItems.length}</strong> de{" "}
            <strong className="text-slate-900">{pendingList.length}</strong> famílias pendentes
          </>
        }
      />

      {/* Grid de Famílias Faltantes */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 rounded-full border-3 border-amber-500/20 border-t-amber-500 animate-spin" />
          <span className="text-xs font-mono text-slate-500">Procurando famílias não visitadas em {selectedMonth}...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50 border border-slate-200 rounded-3xl space-y-3 shadow-sm">
          <div className="p-4 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
            <CheckCircle2 className="h-10 w-10 animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 max-w-md">{t("emptyPending")}</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Nenhuma pendência para o mês <strong className="text-amber-600">{selectedMonth}</strong> com este filtro.
          </p>
          {filterText && (
            <Button size="sm" variant="ghost" onClick={() => setFilterText("")} className="mt-2 text-xs text-blue-600 font-bold">
              Limpar Filtro de Busca
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-300 transition-all flex flex-col justify-between p-5 rounded-2xl group shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg truncate group-hover:text-amber-600 transition-colors">
                      {item.fullName}
                    </h3>
                    <span className="text-sm font-mono text-slate-600 font-semibold block mt-0.5">
                      CPF: {item.document}
                    </span>
                  </div>

                </div>

                <div className="text-sm text-slate-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                    <span className="truncate font-semibold">Bairro: {item.neighborhood}</span>
                  </div>
                  {item.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item.phone}</span>
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs text-slate-500 line-clamp-2 italic pt-1 border-t border-slate-100">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Botão de Ação Rápida */}
              <div className="pt-4 mt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <Button asChild variant="ghost" size="sm" className="text-sm text-slate-500 hover:text-slate-900 px-3 py-5">
                  <Link href={`/beneficiarios/${item.id}`}>Ver Perfil</Link>
                </Button>
                <Button
                  onClick={() => openModal(item.id, item.fullName)}
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black px-5 py-5 rounded-xl shadow-md shadow-amber-500/20 text-sm gap-2"
                >
                  <UserCheck className="h-5 w-5 shrink-0" />
                  Registrar Visita
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Reativo de Registro da Entrega */}
      {activeBeneficiary && (
        <RegisterDeliveryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          beneficiaryId={activeBeneficiary.id}
          beneficiaryName={activeBeneficiary.fullName}
          onSuccess={reloadCurrentMonth}
        />
      )}
    </div>
  );
}
