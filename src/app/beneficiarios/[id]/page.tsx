"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useBeneficiaryProfile } from "./_hooks/useBeneficiaryProfile";
import { RegisterDeliveryModal } from "../../_components/RegisterDeliveryModal";
import { ResidentialInfoCard } from "./_components/ResidentialInfoCard";
import { DeliveryHistoryTimeline } from "./_components/DeliveryHistoryTimeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift, Edit3 } from "lucide-react";

export default function BeneficiaryProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const {
    t,
    router,
    data,
    loading,
    modalOpen,
    setModalOpen,
    loadProfile,
    handleRemoveDelivery,
  } = useBeneficiaryProfile(params);

  if (loading || !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full border-3 border-emerald-200 border-t-emerald-500 animate-spin" />
        <span className="text-xs font-mono text-slate-500">Abrindo Dossiê e Histórico de Visitas...</span>
      </div>
    );
  }

  const { beneficiary, deliveries } = data;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Topo / Retorno */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <Link href="/beneficiarios" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold">
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao Catálogo
          </Link>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {beneficiary.fullName}
            </h1>
            <Badge variant={beneficiary.status === "ACTIVE" ? "active" : "inactive"} withPulse={beneficiary.status === "ACTIVE"}>
              {beneficiary.status === "ACTIVE" ? t("statusActive") : t("statusInactive")}
            </Badge>
          </div>
          <span className="text-xs font-mono text-slate-500 block">
            Dossiê ID: #{beneficiary.id} • CPF/Doc: <strong className="text-slate-700">{beneficiary.document}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            onClick={() => setModalOpen(true)}
            size="lg"
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 text-white font-black shadow-md rounded-2xl gap-2"
          >
            <Gift className="h-5 w-5 stroke-[2.5]" />
            <span>Registrar Visita</span>
          </Button>
          <Button
            onClick={() => router.push(`/beneficiarios/cadastro?id=${beneficiary.id}`)}
            variant="secondary"
            size="icon"
            className="h-11 w-11 rounded-2xl"
            title="Editar Dossiê"
          >
            <Edit3 className="h-5 w-5 text-amber-500" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Componente Modular Residencial */}
        <ResidentialInfoCard beneficiary={beneficiary} />

        {/* Componente Modular da Timeline */}
        <DeliveryHistoryTimeline
          deliveries={deliveries}
          onRemove={handleRemoveDelivery}
          t={t}
        />
      </div>

      {/* Modal Reativo de Registro Rápido */}
      <RegisterDeliveryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        beneficiaryId={beneficiary.id}
        beneficiaryName={beneficiary.fullName}
        onSuccess={() => loadProfile()}
      />
    </div>
  );
}
