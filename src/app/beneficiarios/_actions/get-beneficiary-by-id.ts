"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { deliveryHistory } from "@/db/schema/delivery_history";
import { eq, desc } from "drizzle-orm";
import { checkVolunteerAuth } from "@/auth/guard";
import { unstable_cache } from "next/cache";

const getCachedBeneficiaryById = unstable_cache(
  async (id: number) => {
    const [beneficiary] = await db
      .select()
      .from(beneficiaries)
      .where(eq(beneficiaries.id, id))
      .limit(1);

    if (!beneficiary) {
      return { success: false, error: "Beneficiado não encontrado no sistema." };
    }

    const deliveries = await db
      .select()
      .from(deliveryHistory)
      .where(eq(deliveryHistory.beneficiaryId, id))
      .orderBy(desc(deliveryHistory.referenceMonth), desc(deliveryHistory.deliveredAt));

    return {
      success: true,
      beneficiary,
      deliveries,
    };
  },
  ["beneficiary-by-id"],
  {
    revalidate: 300,
    tags: ["beneficiaries", "deliveries"],
  }
);

export async function getBeneficiaryById(id: number) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Você precisa efetuar login como voluntário para consultar dossiês.", unauthorized: true };
  }

  try {
    return await getCachedBeneficiaryById(id);
  } catch (error) {
    console.error("Error getBeneficiaryById:", error);
    return { success: false, error: "Erro interno na leitura do dossiê." };
  }
}
