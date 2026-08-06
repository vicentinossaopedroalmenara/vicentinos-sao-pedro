"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BeneficiariesFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  totalCount?: number;
  placeholder?: string;
  counterElement?: React.ReactNode;
}

export function BeneficiariesFilterBar({
  search,
  onSearchChange,
  totalCount,
  placeholder = "Pesquisar por nome do assistido, CPF ou bairro...",
  counterElement,
}: BeneficiariesFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
      <div className="relative w-full sm:max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-11 rounded-2xl bg-white border-slate-300 text-sm shadow-sm"
        />
      </div>
      <div className="text-xs font-mono text-slate-500 self-end sm:self-center">
        {counterElement ? (
          counterElement
        ) : (
          <>Total de cadastros: <strong className="text-blue-600 font-black">{totalCount}</strong> assistido(s)</>
        )}
      </div>
    </div>
  );
}
