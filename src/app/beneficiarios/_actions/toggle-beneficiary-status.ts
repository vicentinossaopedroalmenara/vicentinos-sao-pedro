"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkVolunteerAuth } from "@/auth/guard";

export async function toggleBeneficiaryStatus(id: number, currentStatus: "ACTIVE" | "INACTIVE") {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Sem credenciais autenticadas de voluntário para alterar situação do assistido.", unauthorized: true };
  }

  try {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await db
      .update(beneficiaries)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(beneficiaries.id, id));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error toggleBeneficiaryStatus:", error);
    return { error: "Falha ao alterar situação do assistido." };
  }
}
