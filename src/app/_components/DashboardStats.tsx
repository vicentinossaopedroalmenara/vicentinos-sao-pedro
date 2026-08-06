"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { HeartHandshake, CheckCircle2, AlertCircle } from "lucide-react";

interface DashboardStatsProps {
  totalActive: number;
  deliveredCount: number;
  pendingCount: number;
}

export function DashboardStats({ totalActive, deliveredCount, pendingCount }: DashboardStatsProps) {
  const t = useTranslations("Dashboard");
  const percentComplete = totalActive > 0 ? Math.round((deliveredCount / totalActive) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
        {/* Cartão de Meta / Total */}
        <Card variant="stat" className="p-4 sm:p-6 border-blue-100 bg-blue-50 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-600 block">
              {t("statTotalActive")}
            </span>
            <div className="p-2 rounded-xl bg-blue-100 border border-blue-200 text-blue-600">
              <HeartHandshake className="h-5 w-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-4xl font-black font-mono text-slate-900 mt-2 block">
            {totalActive} <span className="text-xs font-sans font-semibold text-slate-500 ml-1">famílias ativas</span>
          </span>
        </Card>

        {/* Entregues no Mês */}
        <Card variant="stat" className="p-4 sm:p-6 border-emerald-100 bg-emerald-50 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 block">
              {t("statDeliveredThisMonth")}
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-4xl font-black font-mono text-emerald-600 mt-2 block">
            {deliveredCount} <span className="text-xs font-sans font-semibold text-emerald-600/80 ml-1">concluídas</span>
          </span>
        </Card>

        {/* Pendentes / Falta Receber */}
        <Card variant="stat" className={`p-4 sm:p-6 shadow-sm relative overflow-hidden transition-colors ${
          pendingCount > 0 
            ? "border-amber-200 bg-amber-50" 
            : "border-slate-200 bg-white"
        }`}>
          <div className="flex items-center justify-between z-10 relative">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 block">
              {t("statPendingThisMonth")}
            </span>
            <div className={`p-2 rounded-xl border ${pendingCount > 0 ? "bg-amber-100 border-amber-200 text-amber-600 animate-pulse" : "bg-slate-100 border-slate-200 text-slate-400"}`}>
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <span className="text-2xl sm:text-4xl font-black font-mono text-amber-600 mt-2 block">
            {pendingCount} <span className="text-xs font-sans font-semibold text-amber-600/80 ml-1">aguardando</span>
          </span>
        </Card>
      </div>


    </div>
  );
}
