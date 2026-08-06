"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkVolunteerAuth } from "@/auth/guard";

export async function deleteBeneficiary(id: number) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Sem credenciais autenticadas de voluntário para remover cadastros.", unauthorized: true };
  }

  try {
    await db.delete(beneficiaries).where(eq(beneficiaries.id, id));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error deleteBeneficiary:", error);
    return { error: "Falha ao excluir beneficiado da base." };
  }
}
