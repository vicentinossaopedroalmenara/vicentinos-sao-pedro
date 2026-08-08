"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { HeartHandshake, LayoutDashboard, Users, Clock, LogOut, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "@/auth/client";
import { useEffect, useState } from "react";

export function Header() {
  const t = useTranslations("Common");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Evita Hydration Mismatch: aguarda montagem no cliente antes de renderizar
  // elementos que dependem de estado client-side (session, cookies)
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const navLinks = [
    { href: "/dashboard", label: t("navDashboard"), icon: LayoutDashboard },
    { href: "/beneficiarios", label: t("navBeneficiaries"), icon: Users },
    { href: "/pendentes", label: t("navPending"), icon: Clock, highlight: true },
  ];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  // Lógica baseada apenas em pathname (safe para SSR)
  const isLoginPage = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl transition-all duration-300 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-3">

        {/* Marca / Logo — href fixo no servidor, atualizado no cliente após mount */}
        <Link
          href={mounted && session ? "/dashboard" : "/"}
          className="group flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90"
        >
          <img 
            src="/sao_vincente.png" 
            alt="São Vicente" 
            className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-2xl object-cover shadow-sm border border-slate-200"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl font-black tracking-wide text-slate-900 flex items-center gap-1.5 font-sans truncate">
              {t("appName").toUpperCase()}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-blue-600 font-semibold truncate">
              {t("tagline")}
            </span>
          </div>
        </Link>

        {/* Links do Menu — renderizados apenas após montagem no cliente e apenas fora do login */}
        {mounted && !isLoginPage && (
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/dashboard" && pathname.startsWith(link.href));
              return (
                <Link key={link.href} href={link.href}>
                  <span
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm lg:text-base font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    } ${link.highlight && !isActive ? "text-amber-600 hover:text-amber-500" : ""}`}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${link.highlight ? "text-amber-500" : "text-blue-600"}`} />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* Área de autenticação — renderizada apenas após mount para evitar mismatch */}
        <div className="flex items-center gap-2 shrink-0">
          {!mounted ? (
            // Placeholder SSR — tamanho igual ao estado real para evitar layout shift
            <div className="h-8 w-24 rounded-xl bg-slate-100 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-mono text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 truncate max-w-[170px] shadow-sm">
                👤 {session.user?.name || session.user?.email || "Voluntário"}
              </span>
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
                className="rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-600 border border-slate-200 transition-all"
                title={t("logout")}
              >
                <LogOut className="h-3.5 w-3.5 text-red-500 shrink-0 mr-1" />
                <span className="hidden sm:inline">{t("logout")}</span>
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Barra de navegação móvel — apenas após mount e fora do login */}
      {mounted && !isLoginPage && (
        <div className="flex md:hidden items-center justify-around border-t border-slate-200 px-2 py-1.5 bg-slate-50">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className="flex-1 text-center">
                <div className={`flex flex-col items-center py-2 px-1 rounded-lg ${isActive ? "text-blue-700 bg-blue-50 font-bold border border-blue-200" : "text-slate-500"}`}>
                  <Icon className={`h-6 w-6 ${link.highlight ? "text-amber-500" : ""}`} />
                  <span className="text-xs sm:text-sm tracking-tight mt-1">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
