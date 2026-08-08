"use client";

import React, { useState } from "react";
import { Download, FileText, FileType, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MonthSelector } from "@/components/ui/month-selector";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { getExportData, type ExportFilterType } from "../_actions/get-export-data";
import { ExportFormat, createExportStrategy } from "@/domain/export";

interface ExportConfigModalProps {
  onClose: () => void;
}

export function ExportConfigModal({ onClose }: ExportConfigModalProps) {
  const [month, setMonth] = useState(new Date().toISOString().substring(0, 7));
  const [filterType, setFilterType] = useState<ExportFilterType>("ALL");
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(format);
    
    try {
      const result = await getExportData(month, filterType);
      
      if (!result.success || !result.data) {
        alert(result.error || "Erro ao buscar dados para exportação.");
        return;
      }

      if (result.data.beneficiaries.length === 0) {
        alert("Nenhum registro encontrado para estes filtros.");
        return;
      }

      const strategy = createExportStrategy(format);
      await strategy.export(result.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro inesperado ao gerar a exportação.");
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <ResponsiveModal isOpen={true} onClose={onClose} title="Exportar Relatório" className="sm:max-w-md">
      <div className="space-y-6">
        
        {/* Mês Selector */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Mês de Referência</label>
          <div className="flex">
            <MonthSelector value={month} onChange={setMonth} />
          </div>
        </div>

        {/* Filtro */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700">Filtro de Dados</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="radio" 
                name="filterType"
                value="ALL"
                checked={filterType === "ALL"}
                onChange={() => setFilterType("ALL")}
                className="mt-1"
              />
              <div>
                <div className="font-semibold text-slate-800 text-sm">Todas as Famílias</div>
                <div className="text-xs text-slate-500 mt-0.5">Exporta o cadastro de todas as famílias ativas, com ou sem visita no mês.</div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
              <input 
                type="radio" 
                name="filterType"
                value="VISITED"
                checked={filterType === "VISITED"}
                onChange={() => setFilterType("VISITED")}
                className="mt-1"
              />
              <div>
                <div className="font-semibold text-slate-800 text-sm">Apenas Visitadas</div>
                <div className="text-xs text-slate-500 mt-0.5">Exporta apenas as famílias que possuem registro de entrega de cesta no mês selecionado.</div>
              </div>
            </label>
          </div>
        </div>

      </div>

      {/* Footer (Ações) */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
        <Button 
          variant="default" 
          onClick={() => handleExport(ExportFormat.PDF)}
          disabled={isExporting !== null}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 justify-start px-4"
        >
          <FileText className="h-5 w-5 mr-3" />
          {isExporting === ExportFormat.PDF ? "Gerando..." : "Gerar PDF"}
        </Button>

        <Button 
          variant="default" 
          onClick={() => handleExport(ExportFormat.DOCX)}
          disabled={isExporting !== null}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 justify-start px-4"
        >
          <FileType className="h-5 w-5 mr-3" />
          {isExporting === ExportFormat.DOCX ? "Gerando..." : "Gerar Word (.docx)"}
        </Button>

        <Button 
          variant="default" 
          onClick={() => handleExport(ExportFormat.WHATSAPP)}
          disabled={isExporting !== null}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-11 justify-start px-4"
        >
          <MessageCircle className="h-5 w-5 mr-3" />
          {isExporting === ExportFormat.WHATSAPP ? "Gerando..." : "Compartilhar WhatsApp"}
        </Button>
      </div>
    </ResponsiveModal>
  );
}
