"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useDashboardMonitoring } from "./_hooks/useDashboardMonitoring";
import { DashboardStats } from "../_components/DashboardStats";
import { RegisterDeliveryModal } from "../_components/RegisterDeliveryModal";
import { MonthSelector } from "@/components/ui/month-selector";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, ShieldAlert, Sparkles, MapPin, Phone } from "lucide-react";

interface InactiveItem {
  id: number;
  fullName: string;
  neighborhood: string;
  phone: string;
  lastDeliveryDate: string | null;
}

export default function DashboardPage() {
  const {
    t,
    selectedMonth,
    setSelectedMonth,
    stats,
    loading,
    modalOpen,
    setModalOpen,
    selectedBeneficiary,
    openModalFor,
    loadData,
  } = useDashboardMonitoring();

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-3">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-500/20 border-t-emerald-500 animate-spin" />
        <span className="text-xs uppercase font-bold text-slate-500 tracking-widest">
          Carregando informações...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Cabeçalho de Boas Vindas */}
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="active" withPulse>Dashboard: {stats.referenceMonth}</Badge>
          </div>
          <MonthSelector 
            label="Mês de Referência"
            value={selectedMonth}
            onChange={setSelectedMonth}
          />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          {t("title")} <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
        </h1>
        <p className="text-sm sm:text-base text-slate-500 max-w-3xl">
          {t("subtitle")}
        </p>
      </div>

      {/* Cartões de Estatísticas e Progresso (Resumo Mensal) */}
      <DashboardStats
        totalActive={stats.totalActiveCount}
        deliveredCount={stats.deliveredThisMonthCount}
        pendingCount={stats.pendingThisMonthCount}
      />

      {/* ALERTA 1: Entregas Pendentes do Mês em Curso */}
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-200/50 blur-3xl pointer-events-none" />
        <div className="flex items-start gap-4 z-10">
          <div className="p-3 rounded-2xl bg-amber-100 border border-amber-200 text-amber-600 shrink-0 mt-1 sm:mt-0">
            <Clock className="h-7 w-7 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              {t("alertPendingTitle")}
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700 font-mono border border-amber-200">
                {stats.pendingThisMonthCount} pendente(s)
              </span>
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed max-w-2xl">
              {t("alertPendingText")} <strong className="text-amber-600 underline decoration-amber-400/40">{stats.referenceMonth}</strong>.
              Acesse a lista para planejar suas visitas.
            </p>
          </div>
        </div>
        <div className="shrink-0 z-10">
          <Button asChild variant="warning" size="lg" className="w-full sm:w-auto font-black shadow-xl rounded-2xl">
            <Link href="/pendentes" className="flex items-center justify-center gap-2">
              <span>{t("btnSeePending")}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* ALERTA 2: Famílias em Risco (Inatividade de 2 ou mais meses sem cesta) */}
      <Card className="border-red-200 bg-red-50/50 shadow-md overflow-hidden">
        <CardHeader className="border-b border-red-100 bg-red-50 sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-100 text-red-600 border border-red-200">
              <ShieldAlert className="h-6 w-6 animate-bounce" />
            </div>
            <div>
              <CardTitle className="text-red-700 flex items-center gap-2 text-lg sm:text-xl">
                {t("alertInactiveTitle")}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 font-mono font-black">
                  {stats.inactiveAlertList.length} família(s) em alerta
                </span>
              </CardTitle>
              <p className="text-xs sm:text-sm text-red-500/80 mt-0.5">
                {t("alertInactiveText")}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white font-bold shrink-0 text-base py-5 px-4">
            <Link href="/beneficiarios">
              Ver Famílias
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {stats.inactiveAlertList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-4xl mb-2">🎉</span>
              <span className="text-sm font-bold text-emerald-600">{t("noInactive")}</span>
              <span className="text-xs text-slate-500 mt-1">Todas as famílias foram visitadas recentemente.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.inactiveAlertList.map((item: InactiveItem) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-2xl bg-white border border-red-200 hover:border-red-400 transition-all flex flex-col justify-between gap-3 relative overflow-hidden group shadow-sm"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base truncate group-hover:text-red-600 transition-colors">
                        {item.fullName}
                      </h4>
                      <Badge variant="destructive" className="shrink-0 text-[10px] uppercase font-mono">
                        Crítico
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                        <span className="truncate">Bairro: {item.neighborhood || "Não informado"}</span>
                      </div>
                      {item.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{item.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-red-600 font-medium">
                      Última visita: <strong className="text-slate-900 font-mono">{item.lastDeliveryDate ? item.lastDeliveryDate.split("-").reverse().join("/") : "Nenhuma"}</strong>
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => openModalFor(item.id, item.fullName)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-9 px-4 rounded-xl shadow-lg shadow-emerald-500/20 text-sm"
                      >
                        Registrar Visita
                      </Button>
                      <Button asChild variant="secondary" size="icon" className="h-9 w-9 rounded-xl" title="Ver Família">
                        <Link href={`/beneficiarios/${item.id}`}>📁</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Reativo de Registro Rápido */}
      {selectedBeneficiary && (
        <RegisterDeliveryModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          beneficiaryId={selectedBeneficiary.id}
          beneficiaryName={selectedBeneficiary.fullName}
          onSuccess={() => loadData()}
        />
      )}
    </div>
  );
}
