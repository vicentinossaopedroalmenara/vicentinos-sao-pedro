"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Gift, Calendar, UserCheck, Trash2 } from "lucide-react";

interface DeliveryHistoryTimelineProps {
  deliveries: any[];
  onRemove: (delId: number, month: string) => void;
  t: (key: string) => string;
}

export function DeliveryHistoryTimeline({
  deliveries,
  onRemove,
  t,
}: DeliveryHistoryTimelineProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock className="h-6 w-6 text-amber-500" />
          {t("historyTitle")}
        </h2>
        <Badge variant="info" className="font-mono">
          Visitas: {deliveries.length}
        </Badge>
      </div>

      {deliveries.length === 0 ? (
        <Card className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center space-y-3 shadow-inner">
          <Gift className="h-12 w-12 text-slate-300 animate-pulse" />
          <h4 className="text-base font-bold text-slate-600">{t("noHistory")}</h4>
          <p className="text-xs text-slate-500 max-w-sm">
            Utilize o botão <strong className="text-emerald-600">Registrar Visita</strong> no topo para inaugurar o histórico assistencial desta família.
          </p>
        </Card>
      ) : (
        <div className="relative border-l-2 border-emerald-500/30 ml-3 sm:ml-4 space-y-6 pb-2">
          {deliveries.map((record: any) => {
            const dateObj = new Date(record.deliveredAt);
            const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toISOString().split("T")[0].split("-").reverse().join("/") : "Data Inválida";
            return (
              <div key={record.id} className="relative pl-6 sm:pl-8 group">
                <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-emerald-500 border-3 border-white shadow-sm shadow-emerald-500/50 group-hover:scale-125 transition-transform" />
                
                <Card className="p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="active" className="font-mono font-black text-xs">
                        Mês: {record.referenceMonth}
                      </Badge>
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                        {formattedDate}
                      </span>
                    </div>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onRemove(record.id, record.referenceMonth)}
                      className="h-7 w-7 rounded-lg hover:bg-red-50 self-end sm:self-auto"
                      title="Excluir este registro do histórico"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>

                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold">
                      <UserCheck className="h-4 w-4 shrink-0" />
                      <span>Voluntário: <strong className="text-slate-900">{record.deliveredBy}</strong></span>
                    </div>
                    {record.basketsQuantity > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                        <Gift className="h-4 w-4 shrink-0" />
                        <span>Cestas Entregues: <strong className="text-slate-900">{record.basketsQuantity}</strong></span>
                      </div>
                    )}
                    <p className="text-slate-600 font-sans leading-relaxed pt-1">
                      {record.description || "Nenhuma observação ou item adicional registrado."}
                    </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
