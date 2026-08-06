"use server";

import { db } from "@/db";
import { deliveryHistory } from "@/db/schema/delivery_history";
import { deliverySchema, type DeliveryInput } from "@/domain/delivery";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkVolunteerAuth } from "@/auth/guard";

export async function registerDelivery(formData: DeliveryInput) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Apenas voluntários com sessão ativa podem registrar visitas.", unauthorized: true };
  }

  try {
    const parsed = deliverySchema.safeParse(formData);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Dados de entrega inválidos.";
      return { error: errorMsg };
    }

    const { beneficiaryId, referenceMonth, deliveredAt, description, deliveredBy, basketsQuantity } = parsed.data;

    const existing = await db
      .select()
      .from(deliveryHistory)
      .where(
        and(
          eq(deliveryHistory.beneficiaryId, beneficiaryId),
          eq(deliveryHistory.referenceMonth, referenceMonth)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { error: `Esta família já possui registro de visita para o mês ${referenceMonth}.` };
    }

    const [created] = await db
      .insert(deliveryHistory)
      .values({
        beneficiaryId,
        referenceMonth,
        deliveredAt: new Date(`${deliveredAt}T12:00:00.000Z`),
        basketsQuantity,
        description: description || "Visita mensal",
        deliveredBy: deliveredBy || "Voluntário Vicentino",
      })
      .returning();

    revalidatePath("/", "layout");
    return { success: true, delivery: created };
  } catch (error) {
    console.error("Error registerDelivery:", error);
    return { error: "Erro na conexão com o banco ao registrar a visita." };
  }
}
