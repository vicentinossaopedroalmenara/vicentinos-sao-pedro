"use client";

import React from "react";
import { useLoginForm } from "./_hooks/useLoginForm";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeartHandshake, LogIn, Lock, ShieldCheck, KeyRound } from "lucide-react";

export default function HomeLoginPage() {
  const { password, setPassword, loading, error, handleLogin } = useLoginForm();

  return (
    <div className="flex flex-col items-center justify-center min-h-[78vh] p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/95 border-slate-200 shadow-2xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center space-y-2.5 z-10 relative">
          <img src="/sao_vincente.png" alt="Logo" className="h-16 w-16 rounded-2xl object-cover shadow-sm border border-slate-200 mb-2" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Acesso de Voluntário
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Vincentinos São Pedro Almenara <br />
            <span className="text-blue-600 font-semibold">
              Sistema de Controle de Cestas Básicas
            </span>
          </p>
        </div>

        {/* Identificação visual da conta (sem expor o email ao DOM público) */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="h-9 w-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <KeyRound className="h-4 w-4 text-blue-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest font-bold text-slate-500">
              Conta Administrativa
            </p>
            <p className="text-sm font-bold text-slate-900 truncate">
              Vincentinos São Pedro Almenara
            </p>
          </div>
          <div className="ml-auto h-2 w-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
        </div>

        {/* Erro */}
        {error && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
            ⚠️ <span>{error}</span>
          </div>
        )}

        {/* Formulário — apenas senha */}
        <form onSubmit={handleLogin} className="space-y-4 z-10 relative">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="h-3.5 w-3.5 text-amber-500" />
              Senha de Acesso
            </label>
            <Input
              type="password"
              required
              autoFocus
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl bg-slate-50 border-slate-200 text-base font-mono focus:border-blue-500 tracking-widest text-slate-900"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-95 text-white font-black text-base shadow-xl shadow-blue-500/20 gap-2 mt-2 transition-all"
          >
            <LogIn className="h-5 w-5 stroke-[2.5]" />
            {loading ? "Verificando..." : "Acessar Plataforma"}
          </Button>
        </form>

        <div className="pt-5 border-t border-slate-200 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 font-medium z-10 relative">
          <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
          <span>Autenticação segura — identidade verificada no servidor.</span>
        </div>
      </Card>
    </div>
  );
}
