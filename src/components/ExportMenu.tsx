"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, FileType, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportFormat, createExportStrategy, type ExportData } from "@/domain/export";

interface ExportMenuProps {
  data: ExportData;
  label?: string;
}

const exportOptions = [
  { format: ExportFormat.PDF, label: "Exportar PDF", icon: FileText, color: "text-red-500" },
  { format: ExportFormat.DOCX, label: "Exportar Word", icon: FileType, color: "text-blue-500" },
  { format: ExportFormat.WHATSAPP, label: "Compartilhar WhatsApp", icon: MessageCircle, color: "text-emerald-500" },
];

export function ExportMenu({ data, label = "Exportar" }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    setOpen(false);
    try {
      const strategy = createExportStrategy(format);
      await strategy.export(data);
    } catch (err) {
      console.error("Erro ao exportar:", err);
      alert("Erro ao gerar exportação. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        onClick={() => setOpen(!open)}
        variant="secondary"
        size="sm"
        disabled={exporting}
        className="rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 gap-1.5 px-3"
      >
        <Download className="h-4 w-4 text-slate-500" />
        {exporting ? "Gerando..." : label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {exportOptions.map((opt) => (
            <button
              key={opt.format}
              onClick={() => handleExport(opt.format)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <opt.icon className={`h-4 w-4 ${opt.color}`} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
