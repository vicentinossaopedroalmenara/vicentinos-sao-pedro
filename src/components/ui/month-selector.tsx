import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, RotateCcw } from "lucide-react";

const MONTHS = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const FULL_MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

interface MonthSelectorProps {
  label?: string;
  value: string; // format YYYY-MM
  onChange: (value: string) => void;
}

export function MonthSelector({ label, value, onChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentYearSelected = parseInt(value.substring(0, 4), 10);
  const currentMonthSelected = parseInt(value.substring(5, 7), 10);
  
  const [viewYear, setViewYear] = useState(currentYearSelected || new Date().getFullYear());
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMonthSelect = (monthIndex: number) => {
    const mm = (monthIndex + 1).toString().padStart(2, "0");
    const yyyy = viewYear.toString();
    onChange(`${yyyy}-${mm}`);
    setIsOpen(false);
  };

  const handlePrevYear = () => {
    if (viewYear > 2020) setViewYear(viewYear - 1);
  };

  const handleNextYear = () => {
    setViewYear(viewYear + 1);
  };
  
  const displayLabel = !isNaN(currentMonthSelected) && !isNaN(currentYearSelected)
    ? `${FULL_MONTHS[currentMonthSelected - 1]} de ${currentYearSelected}`
    : value;

  const currentSystemMonth = new Date().toISOString().substring(0, 7);
  const isNotCurrentMonth = value !== currentSystemMonth;

  const handleResetToCurrent = () => {
    onChange(currentSystemMonth);
    setViewYear(new Date().getFullYear());
  };

  return (
    <div className="flex flex-col items-start sm:items-end shrink-0 gap-1.5" ref={dropdownRef}>
      {label && <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 ml-1">{label}</label>}
      
      <div className="relative flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-48 sm:w-56 flex items-center justify-between px-3.5 py-2.5 text-sm font-bold bg-white text-slate-800 border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="truncate">{displayLabel}</span>
          </div>
          <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
        </button>

        {isNotCurrentMonth && (
          <button
            type="button"
            onClick={handleResetToCurrent}
            title="Voltar ao mês atual"
            className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-600 hover:shadow-sm border border-slate-200 hover:border-amber-200 transition-all"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}

        {isOpen && (
          <div className="absolute left-0 z-50 top-full mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Year Selector */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handlePrevYear} 
                disabled={viewYear <= 2020}
                className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent text-slate-600 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-black text-slate-900 text-base">{viewYear}</span>
              <button 
                onClick={handleNextYear}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-3 gap-2">
              {MONTHS.map((monthStr, index) => {
                const isSelected = viewYear === currentYearSelected && (index + 1) === currentMonthSelected;
                return (
                  <button
                    key={monthStr}
                    onClick={() => handleMonthSelect(index)}
                    className={`
                      py-2.5 px-1 text-xs font-extrabold rounded-xl transition-all cursor-pointer
                      ${isSelected 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-100"
                      }
                    `}
                  >
                    {monthStr}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
