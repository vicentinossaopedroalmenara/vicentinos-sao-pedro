"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, ShieldCheck } from "lucide-react";

interface ResidentialInfoCardProps {
  beneficiary: any;
}

export function ResidentialInfoCard({ beneficiary }: ResidentialInfoCardProps) {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card className="p-5 rounded-3xl bg-white border-slate-200 space-y-4 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-2 border-b border-slate-100 pb-2">
          <MapPin className="h-4 w-4" /> Endereço Residencial
        </h3>
        <div className="space-y-1.5 text-xs text-slate-600 font-sans leading-relaxed">
          <p className="text-sm font-bold text-slate-900">
            {beneficiary.street}, nº {beneficiary.number}
          </p>
          <p className="text-slate-500">Bairro: <strong className="text-slate-700">{beneficiary.neighborhood}</strong></p>
          <p className="text-slate-500">Cidade/UF: {beneficiary.city} - {beneficiary.state}</p>
          <p className="font-mono text-emerald-600">CEP: {beneficiary.zipCode}</p>
          {beneficiary.complement && <p className="text-slate-500 italic">Comp: {beneficiary.complement}</p>}
          {beneficiary.referencePoint && (
            <div className="pt-2 mt-2 border-t border-slate-100">
              <span className="text-[11px] uppercase font-bold text-slate-400 block">Ponto de Referência:</span>
              <span className="text-slate-600 text-sm italic">"{beneficiary.referencePoint}"</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5 rounded-3xl bg-white border-slate-200 space-y-3 shadow-sm">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-2 border-b border-slate-100 pb-2">
          <ShieldCheck className="h-4 w-4" /> Situação Social
        </h3>
        <div className="text-xs text-slate-600 space-y-2">
          {beneficiary.phone && (
            <div className="flex items-center gap-2 text-emerald-600 font-mono text-sm">
              <Phone className="h-4 w-4 shrink-0" />
              <span>{beneficiary.phone}</span>
            </div>
          )}
          {beneficiary.birthDate && (
            <p className="text-slate-500">Nascido(a) em: <strong className="text-slate-900 font-mono">{beneficiary.birthDate.split("-").reverse().join("/")}</strong></p>
          )}
          <div className="pt-2">
            <span className="text-[11px] uppercase font-bold text-slate-400 block mb-1">Notas e Comentários:</span>
            <p className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 italic text-sm leading-relaxed">
              {beneficiary.notes || "Nenhuma observação socioeconômica anotada pelos voluntários."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
