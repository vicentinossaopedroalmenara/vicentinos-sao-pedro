"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { deliveryHistory } from "@/db/schema/delivery_history";
import { eq, inArray, and } from "drizzle-orm";
import { checkVolunteerAuth } from "@/auth/guard";

export type ExportFilterType = "ALL" | "VISITED";

export async function getExportData(referenceMonth: string, filterType: ExportFilterType) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado", unauthorized: true };
  }

  try {
    // 1. Fetch active beneficiaries
    const allActiveBeneficiaries = await db
      .select()
      .from(beneficiaries)
      .where(eq(beneficiaries.status, "ACTIVE"));

    // 2. Fetch deliveries for the selected month
    const monthDeliveries = await db
      .select()
      .from(deliveryHistory)
      .where(eq(deliveryHistory.referenceMonth, referenceMonth));

    // 3. Map deliveries by beneficiary ID
    const deliveriesMap = new Map<number, typeof monthDeliveries[0]>();
    monthDeliveries.forEach(d => {
      deliveriesMap.set(d.beneficiaryId, d);
    });

    let finalBeneficiaries = [];
    let finalDeliveries = [];

    for (const b of allActiveBeneficiaries) {
      const delivery = deliveriesMap.get(b.id);

      if (filterType === "VISITED") {
        if (delivery) {
          finalBeneficiaries.push(b);
          finalDeliveries.push({
            ...delivery,
            beneficiaryName: b.fullName,
          });
        }
      } else {
        // ALL
        finalBeneficiaries.push(b);
        if (delivery) {
          finalDeliveries.push({
            ...delivery,
            beneficiaryName: b.fullName,
          });
        }
      }
    }

    return {
      success: true,
      data: {
        beneficiaries: finalBeneficiaries,
        deliveries: finalDeliveries,
        title: filterType === "VISITED" 
          ? `Relatório de Visitas — ${referenceMonth}` 
          : `Relatório de Beneficiários Ativos`,
      }
    };
  } catch (error) {
    console.error("Error getExportData:", error);
    return { success: false, error: "Erro ao gerar os dados de exportação" };
  }
}
