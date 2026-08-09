"use client";

import React from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterDeliveryModal } from "../_hooks/useRegisterDeliveryModal";
import { Calendar, CheckCircle2, UserCheck, FileText } from "lucide-react";

interface RegisterDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiaryId: number;
  beneficiaryName: string;
  onSuccess?: () => void;
}

export function RegisterDeliveryModal({
  isOpen,
  onClose,
  beneficiaryId,
  beneficiaryName,
  onSuccess,
}: RegisterDeliveryModalProps) {
  const {
    t,
    deliveredAt,
    handleDateChange,
    referenceMonth,
    setReferenceMonth,
    basketsQuantity,
    setBasketsQuantity,
    description,
    setDescription,
    deliveredBy,
    setDeliveredBy,
    loading,
    errorMessage,
    warningMessage,
    success,
    handleSubmit,
  } = useRegisterDeliveryModal({ beneficiaryId, onClose, onSuccess });

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Visita"
      className="max-w-lg border-emerald-500/30 shadow-emerald-500/10"
    >
      <div className="text-slate-600 text-sm mb-2 font-sans">
        Preencha os dados da visita e os itens doados para esta família.
      </div>

      {success ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 shadow-sm">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce mb-3" />
          <h4 className="text-lg font-bold text-slate-900">Visita Registrada!</h4>
          <p className="text-xs text-slate-500 mt-1">O histórico da família foi atualizado com sucesso.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 font-sans">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-semibold">
              ⚠️ {errorMessage}
            </div>
          )}



          {/* Nome do Beneficiado (Somente Leitura) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Família Selecionada
            </label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-emerald-600 font-black text-sm sm:text-base tracking-wide flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {beneficiaryName}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Data Exata */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                Data da Visita
              </label>
              <Input
                type="date"
                value={deliveredAt}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                variant="mono"
                className="w-full text-sm font-bold"
              />
            </div>

            {/* Mês de Referência */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Mês de Referência
              </label>
              <Input
                type="month"
                value={referenceMonth}
                onChange={(e) => setReferenceMonth(e.target.value)}
                required
                className="w-full text-sm bg-slate-50 text-amber-600 font-mono"
              />
            </div>

            {/* Quantidade de Cestas */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Cestas Básicas Entregues
              </label>
              <div className="flex items-center gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 w-10 border-slate-200 bg-slate-50 text-slate-900 rounded-xl"
                  onClick={() => setBasketsQuantity(Math.max(0, basketsQuantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="0"
                  value={basketsQuantity}
                  onChange={(e) => setBasketsQuantity(parseInt(e.target.value) || 0)}
                  required
                  className="w-20 text-center text-sm font-bold bg-slate-50 text-emerald-600"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-10 w-10 border-slate-200 bg-slate-50 text-slate-900 rounded-xl"
                  onClick={() => setBasketsQuantity(basketsQuantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>
          </div>

          {/* Voluntário Responsável */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
              Voluntário Responsável
            </label>
            <Input
              type="text"
              placeholder="Quem realizou a visita"
              value={deliveredBy}
              onChange={(e) => setDeliveredBy(e.target.value)}
              required
            />
          </div>

          {/* Anotações Específicas / Doados */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-blue-500" />
              Observações e Outros Itens Doados
            </label>
            <textarea
              className="w-full min-h-[90px] rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all font-sans resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: 2L de leite, pacote de fraldas, conversa sobre saúde..."
            />
          </div>

          {warningMessage && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-xs font-semibold flex flex-col gap-2">
              <span>⚠️ {warningMessage}</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => handleSubmit(undefined, true)}
                disabled={loading}
                className="self-start border-amber-300 hover:bg-amber-100 text-amber-800"
              >
                Registrar nova visita mesmo assim
              </Button>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              className="text-slate-500 hover:text-slate-900 font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-500/25 px-6"
            >
              {loading ? "Registrando..." : "Confirmar Visita"}
            </Button>
          </div>
        </form>
      )}
    </ResponsiveModal>
  );
}
