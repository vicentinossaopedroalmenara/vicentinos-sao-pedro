"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit3, Trash2, MapPin } from "lucide-react";

interface BeneficiaryCardRowProps {
  item: any;
  onToggleStatus: (id: number, currentStatus: "ACTIVE" | "INACTIVE") => void;
  onDelete: (id: number, name: string) => void;
  onEdit: (id: number) => void;
  t: (key: string) => string;
}

export function BeneficiaryCardRow({
  item,
  onToggleStatus,
  onDelete,
  onEdit,
  t,
}: BeneficiaryCardRowProps) {
  return (
    <Card className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 min-w-0 flex-1">
        <div className="min-w-0 space-y-1 flex-1">
          <div className="flex items-center gap-2">
            <Link href={`/beneficiarios/${item.id}`} className="font-extrabold text-base sm:text-lg text-slate-900 hover:text-blue-600 transition-colors truncate block">
              {item.fullName}
            </Link>
            <Badge variant={item.status === "ACTIVE" ? "active" : "inactive"} withPulse={item.status === "ACTIVE"}>
              {item.status === "ACTIVE" ? t("statusActive") : t("statusInactive")}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 mt-1">
            <span className="font-mono text-slate-600 font-semibold">CPF: {item.document}</span>
            <span className="flex items-center gap-1.5 text-slate-500 truncate">
              <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
              {item.street}, {item.number} - {item.neighborhood}
            </span>
            {item.phone && <span className="text-emerald-600 font-mono font-medium">📱 {item.phone}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 sm:pt-0 border-t border-slate-100 sm:border-none shrink-0">
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 gap-1.5"
        >
          <Link href={`/beneficiarios/${item.id}`}>
            <Eye className="h-3.5 w-3.5 text-blue-500" />
            <span>Visitas</span>
          </Link>
        </Button>
        <Button
          onClick={() => onEdit(item.id)}
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl hover:bg-slate-100"
          title="Editar dados cadastrais"
        >
          <Edit3 className="h-4 w-4 text-amber-400" />
        </Button>
        <Button
          onClick={() => onToggleStatus(item.id, item.status)}
          variant="outline"
          size="sm"
          className="rounded-xl text-[10px] font-bold px-2.5 h-9"
          title="Alternar Ativo / Inativo"
        >
          {item.status === "ACTIVE" ? "Desativar" : "Reativar"}
        </Button>
        <Button
          onClick={() => onDelete(item.id, item.fullName)}
          variant="destructive"
          size="icon"
          className="h-9 w-9 rounded-xl border-none bg-red-50 text-red-600 hover:bg-red-100"
          title="Remover Cadastro"
        >
          <Trash2 className="h-4 w-4 text-red-400" />
        </Button>
      </div>
    </Card>
  );
}
