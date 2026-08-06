"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Link } from "@/i18n/routing";
import { useBeneficiaryForm } from "./_hooks/useBeneficiaryForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Save, ArrowLeft, MapPin, FileText, CheckCircle2, ShieldAlert } from "lucide-react";

function BeneficiaryFormContent() {
  const {
    t,
    router,
    editId,
    loading,
    initialLoading,
    errorMessage,
    successMessage,
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
  } = useBeneficiaryForm();

  if (initialLoading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-full border-3 border-blue-500/20 border-t-blue-600 animate-spin" />
        <span className="text-xs font-mono text-slate-500">Carregando informações da família...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Topo e Retornar */}
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-4">
        <Link href="/beneficiarios" className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-bold w-fit">
          <ArrowLeft className="h-3.5 w-3.5" /> Voltar para lista
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <UserPlus className="h-7 w-7 text-emerald-600" />
            {editId ? t("formTitleEdit") : t("formTitleNew")}
          </h1>
          <Badge variant="info">{editId ? `ID: #${editId}` : "Novo Cadastro"}</Badge>
        </div>
          Preencha o endereço e o CPF para o controle único das visitas.
      </div>

      {successMessage ? (
        <div className="p-8 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
          <CheckCircle2 className="h-12 w-12 text-emerald-600 animate-bounce" />
          <h3 className="text-xl font-black text-slate-900">{successMessage}</h3>
          <p className="text-xs text-slate-500">Redirecionando para a lista de famílias...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500 shrink-0" />
              <span>⚠️ {errorMessage}</span>
            </div>
          )}

          {/* SECÇÃO 1: Dados Pessoais e CPF */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm rounded-3xl space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                👤 {t("formPersonal")}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nome Completo do Responsável *</label>
                <Input
                  type="text"
                  placeholder="Ex: Maria da Silva Rodrigues"
                  {...register("fullName")}
                  variant={errors.fullName ? "error" : "default"}
                />
                {errors.fullName && <span className="text-[11px] text-red-500 font-semibold">{errors.fullName.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CPF / Documento *</label>
                <Input
                  type="text"
                  placeholder="Apenas números (11 dígitos)"
                  {...register("document")}
                  variant={errors.document ? "error" : "mono"}
                />
                {errors.document && <span className="text-[11px] text-red-500 font-semibold">{errors.document.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Telefone / WhatsApp para contato</label>
                <Input
                  type="text"
                  placeholder="(11) 99999-9999"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Data de Nascimento (Opcional)</label>
                <Input
                  type="date"
                  {...register("birthDate")}
                  className="w-full font-mono text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Situação na Conferência Vicentina</label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full h-11 rounded-xl bg-white border border-slate-200 px-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ACTIVE" className="bg-white text-emerald-600 font-bold">🟢 Ativo (Recebe Visita Mensal)</option>
                      <option value="INACTIVE" className="bg-white text-amber-500 font-bold">🟡 Inativo / Desligado</option>
                    </select>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* SECÇÃO 2: Endereço Completo */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm rounded-3xl space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" /> {t("formAddress")}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">CEP *</label>
                <Input
                  type="text"
                  placeholder="00000-000"
                  {...register("zipCode")}
                  variant={errors.zipCode ? "error" : "mono"}
                />
                {errors.zipCode && <span className="text-[11px] text-red-500 font-semibold">{errors.zipCode.message}</span>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Rua / Avenida / Travessa *</label>
                <Input
                  type="text"
                  placeholder="Ex: Rua das Flores"
                  {...register("street")}
                  variant={errors.street ? "error" : "default"}
                />
                {errors.street && <span className="text-[11px] text-red-500 font-semibold">{errors.street.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Número do Imóvel *</label>
                <Input
                  type="text"
                  placeholder="Ex: 124-B ou S/N"
                  {...register("number")}
                  variant={errors.number ? "error" : "default"}
                />
                {errors.number && <span className="text-[11px] text-red-500 font-semibold">{errors.number.message}</span>}
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Bairro / Comunidade *</label>
                <Input
                  type="text"
                  placeholder="Ex: Vila São Pedro"
                  {...register("neighborhood")}
                  variant={errors.neighborhood ? "error" : "default"}
                />
                {errors.neighborhood && <span className="text-[11px] text-red-500 font-semibold">{errors.neighborhood.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Complemento (Casa 2, Bloco, etc)</label>
                <Input
                  type="text"
                  placeholder="Opcional"
                  {...register("complement")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Cidade *</label>
                <Input
                  type="text"
                  {...register("city")}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Estado (UF) *</label>
                <Input
                  type="text"
                  maxLength={2}
                  {...register("state")}
                  className="uppercase font-mono"
                />
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Ponto de Referência para a Visita</label>
                <Input
                  type="text"
                  placeholder="Ex: Em frente à mercearia do Seu Joaquim, portão azul."
                  {...register("referencePoint")}
                />
              </div>
            </div>
          </Card>

          {/* SECÇÃO 3: Anotações Socioeconômicas */}
          <Card className="border-slate-200 bg-white p-6 shadow-sm rounded-3xl space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" /> {t("formNotes")}
              </h3>
            </div>
            <textarea
              {...register("notes")}
              placeholder="Descreva a composição familiar (ex: 3 crianças pequenas, idoso acamado), ou outras condições constatadas pela visita dos voluntários."
              className="w-full min-h-[120px] rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all resize-y font-sans leading-relaxed shadow-inner"
            />
          </Card>

          {/* Botões de Submissão */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push("/beneficiarios")}
              disabled={loading}
              className="rounded-2xl px-6 font-bold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:opacity-90 text-white font-black px-8 rounded-2xl shadow-md gap-2"
            >
              <Save className="h-5 w-5 stroke-[2.5]" />
              {loading ? "Gravando no Banco..." : editId ? "Salvar Alterações" : "Concluir Cadastro"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function BeneficiaryFormPage() {
  return (
    <React.Suspense fallback={<div className="py-24 text-center">Carregando...</div>}>
      <BeneficiaryFormContent />
    </React.Suspense>
  );
}
