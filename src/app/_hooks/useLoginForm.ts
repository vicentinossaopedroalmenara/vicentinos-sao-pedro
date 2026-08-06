"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { loginVolunteer } from "@/app/_actions/login-volunteer";

export function useLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      // Apenas a senha é enviada ao servidor — o email é lido do process.env no servidor
      const result = await loginVolunteer({ password });

      if ("error" in result) {
        setError(result.error);
      } else {
        // Sessão criada com sucesso — redireciona ao painel
        router.push("/dashboard");
        router.refresh(); // Garante que o proxy.ts reconheça a nova sessão
      }
    });
  };

  return {
    password,
    setPassword,
    loading: isPending,
    error,
    handleLogin,
  };
}
