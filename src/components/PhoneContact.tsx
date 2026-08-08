import React from "react";
import { Copy, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface PhoneContactProps {
  phone: string;
  className?: string;
  icon?: boolean;
}

export function PhoneContact({ phone, className, icon = true }: PhoneContactProps) {
  const cleanPhone = phone.replace(/\D/g, "");

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(phone);
    alert("Copiado!");
  };

  return (
    <div className={cn("flex items-center gap-2 text-emerald-600 font-mono text-sm", className)}>
      {icon ? <Phone className="h-4 w-4 shrink-0" /> : <span>📱</span>}
      <span>{phone}</span>
      <div className="flex items-center gap-1 ml-1">
        <a
          href={`https://wa.me/55${cleanPhone}`}
          target="_blank"
          rel="noreferrer"
          title="Abrir WhatsApp"
          className="text-emerald-500 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-1.5 rounded-md transition-colors cursor-pointer"
        >
          <MessageCircle className="h-3.5 w-3.5" />
        </a>
        <button
          onClick={handleCopy}
          title="Copiar número"
          className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-md transition-colors cursor-pointer"
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
