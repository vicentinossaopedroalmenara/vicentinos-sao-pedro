"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BeneficiariesPaginationProps {
  page: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (newPage: number) => void;
}

export function BeneficiariesPagination({
  page,
  totalPages,
  loading,
  onPageChange,
}: BeneficiariesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 pt-4">
      <span className="text-xs font-mono text-slate-500">
        Página <strong className="text-slate-900 font-black">{page}</strong> de <strong className="text-slate-900 font-black">{totalPages}</strong>
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
          className="rounded-xl font-bold text-xs gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={page === totalPages || loading}
          onClick={() => onPageChange(page + 1)}
          className="rounded-xl font-bold text-xs gap-1"
        >
          Próximo <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
