"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "./utils";

export interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  className,
}: ResponsiveModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 sm:overflow-y-auto">
      {/* Backdrop overlay with blur */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Responsive Dialog / Drawer Container */}
      <div
        className={cn(
          "relative z-10 w-full bg-white border border-slate-200 shadow-2xl shadow-slate-200/50 text-slate-900 transition-all overflow-hidden flex flex-col",
          "rounded-t-3xl max-h-[92vh] border-b-0 animate-in slide-in-from-bottom duration-300 ease-out",
          "sm:rounded-3xl sm:max-w-3xl sm:max-h-[96vh] sm:border sm:border-slate-200 sm:animate-in sm:fade-in sm:zoom-in-95 sm:duration-200",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="sm:hidden w-12 h-1.5 bg-slate-200 hover:bg-slate-300 rounded-full mx-auto my-3 shrink-0 transition-colors cursor-pointer" 
          onClick={onClose} 
        />

        <div className="flex items-center justify-between px-4 sm:px-6 pt-3 sm:pt-4 pb-2 shrink-0 border-b border-slate-100 sm:border-none">
          {title ? (
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-slate-800 line-clamp-1 flex items-center gap-2">
              {title}
            </h3>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-400 hover:text-slate-600 transition-all hover:scale-105 duration-200 shrink-0 ml-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 pt-3 sm:pt-2 space-y-5 sm:space-y-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
