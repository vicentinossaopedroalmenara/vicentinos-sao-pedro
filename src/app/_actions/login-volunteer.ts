"use server";

import { auth } from "@/auth/server";
import { cookies } from "next/headers";
import { z } from "zod";

const passwordSchema = z.object({
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres.")
    .max(128, "Senha muito longa."),
});

export type LoginResult =
  | { success: true }
  | { error: string; unauthorized?: boolean };

import { headers } from "next/headers";

export async function loginVolunteer(
  formData: { password: string }
): Promise<LoginResult> {
  const email = process.env.VOLUNTEER_EMAIL;

  if (!email) {
    console.error("[loginVolunteer] VOLUNTEER_EMAIL não configurado no ambiente.");
    return { error: "Configuração do servidor incompleta. Contate o administrador." };
  }

  const parsed = passwordSchema.safeParse(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Senha inválida." };
  }

  try {
    const reqHeaders = await headers();
    
    const result = await auth.api.signInEmail({
      body: { email, password: parsed.data.password },
      headers: reqHeaders
    });

    if (!result?.token) {
      return { error: "Falha na autenticação. Tente novamente." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("[loginVolunteer] Erro inesperado:", error);
    
    if (
      error?.statusCode === 401 ||
      error?.status === "UNAUTHORIZED" ||
      error?.status === 403 ||
      error?.message?.includes("Invalid email or password") ||
      error?.body?.message?.includes("Invalid email or password")
    ) {
      return { error: "Credenciais incorretas ou usuário não encontrado. Tente novamente.", unauthorized: true };
    }
    
    return { error: "Erro interno. Tente novamente em alguns instantes." };
  }
}
