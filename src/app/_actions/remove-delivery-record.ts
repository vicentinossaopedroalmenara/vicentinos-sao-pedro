"use server";

import { db } from "@/db";
import { deliveryHistory } from "@/db/schema/delivery_history";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkVolunteerAuth } from "@/auth/guard";

export async function removeDeliveryRecord(id: number) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Apenas voluntários autenticados podem apagar registros de visita.", unauthorized: true };
  }

  try {
    await db.delete(deliveryHistory).where(eq(deliveryHistory.id, id));

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error removeDeliveryRecord:", error);
    return { error: "Erro ao remover registro de visita da base." };
  }
}
