"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { deliveryHistory } from "@/db/schema/delivery_history";
import { eq } from "drizzle-orm";
import { checkVolunteerAuth } from "@/auth/guard";
import { unstable_cache } from "next/cache";

const getCachedPendingDeliveries = unstable_cache(
  async (month: string) => {
    const deliveredRows = await db
      .select({ beneficiaryId: deliveryHistory.beneficiaryId })
      .from(deliveryHistory)
      .where(eq(deliveryHistory.referenceMonth, month));

    const deliveredIds = deliveredRows
      .map(r => r.beneficiaryId)
      .filter((id): id is number => id !== null);

    let items;
    if (deliveredIds.length > 0) {
      items = await db
        .select()
        .from(beneficiaries)
        .where(eq(beneficiaries.status, "ACTIVE"))
        .then(res => res.filter(b => !deliveredIds.includes(b.id)));
    } else {
      items = await db
        .select()
        .from(beneficiaries)
        .where(eq(beneficiaries.status, "ACTIVE"));
    }

    return {
      success: true,
      items,
      count: items.length,
    };
  },
  ["pending-deliveries"],
  {
    revalidate: 300,
    tags: ["deliveries", "beneficiaries"],
  }
);

export async function getPendingMonthlyDeliveries(month: string) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Faça login para consultar relatórios de cestas pendentes.", unauthorized: true, items: [], count: 0 };
  }

  try {
    return await getCachedPendingDeliveries(month);
  } catch (error) {
    console.error("Error getPendingMonthlyDeliveries:", error);
    return { success: false, items: [], count: 0 };
  }
}
