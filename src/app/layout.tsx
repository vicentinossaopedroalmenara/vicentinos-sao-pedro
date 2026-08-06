import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { Header } from "./_components/Header";
import common from "@/i18n/common/pt.json";
import dashboard from "@/i18n/dashboard/pt.json";
import beneficiary from "@/i18n/beneficiary/pt.json";
import delivery from "@/i18n/delivery/pt.json";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vicentinos São Pedro | Controle de Cestas Básicas",
  description: "Sistema de monitoramento e armazenamento de entregas de cestas básicas pela conferência vicentina.",
  icons: {
    icon: "/sao_vincente.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = {
    Common: common,
    Dashboard: dashboard,
    Beneficiary: beneficiary,
    Delivery: delivery,
  };

  return (
    <html
      lang="pt-BR"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <NextIntlClientProvider locale="pt" messages={messages}>
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {children}
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
