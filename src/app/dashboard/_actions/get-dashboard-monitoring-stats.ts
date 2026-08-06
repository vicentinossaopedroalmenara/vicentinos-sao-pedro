"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { deliveryHistory } from "@/db/schema/delivery_history";
import { isInactiveForTwoMonths } from "@/domain/beneficiary/rules";
import { count, eq, sql } from "drizzle-orm";
import { checkVolunteerAuth } from "@/auth/guard";
import { unstable_cache } from "next/cache";

const getCachedStats = unstable_cache(
  async (targetMonth: string) => {

    const [{ value: totalActive }] = await db
      .select({ value: count() })
      .from(beneficiaries)
      .where(eq(beneficiaries.status, "ACTIVE"));

    const [{ value: deliveredThisMonth }] = await db
      .select({ value: count() })
      .from(deliveryHistory)
      .where(eq(deliveryHistory.referenceMonth, targetMonth));

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    const inactiveAlertList = await db
      .select({
        id: beneficiaries.id,
        fullName: beneficiaries.fullName,
        neighborhood: beneficiaries.neighborhood,
        phone: beneficiaries.phone,
        lastDeliveryDate: sql<string | null>`MAX(${deliveryHistory.deliveredAt})`,
      })
      .from(beneficiaries)
      .leftJoin(deliveryHistory, eq(beneficiaries.id, deliveryHistory.beneficiaryId))
      .where(eq(beneficiaries.status, "ACTIVE"))
      .groupBy(beneficiaries.id)
      .having(sql`MAX(${deliveryHistory.deliveredAt}) IS NULL OR MAX(${deliveryHistory.deliveredAt}) < ${twoMonthsAgo.toISOString()}`)
      .limit(6);

    const pendingCount = Math.max(0, totalActive - deliveredThisMonth);

    return {
      success: true,
      totalActiveCount: totalActive,
      deliveredThisMonthCount: deliveredThisMonth,
      pendingThisMonthCount: pendingCount,
      referenceMonth: targetMonth,
      inactiveAlertList: inactiveAlertList,
    };
  },
  ["dashboard-stats"],
  {
    revalidate: 300,
    tags: ["dashboard", "beneficiaries", "deliveries"],
  }
);

export async function getDashboardMonitoringStats(month?: string) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return {
      success: false,
      error: "Acesso Negado: Voluntário desautenticado na base cibernética.",
      unauthorized: true,
      totalActiveCount: 0,
      deliveredThisMonthCount: 0,
      pendingThisMonthCount: 0,
      referenceMonth: "2026-08",
      inactiveAlertList: [],
    };
  }

  try {
    const targetMonth = month || new Date().toISOString().substring(0, 7);
    return await getCachedStats(targetMonth);
  } catch (error) {
    console.error("Error getDashboardMonitoringStats:", error);
    return {
      success: false,
      totalActiveCount: 0,
      deliveredThisMonthCount: 0,
      pendingThisMonthCount: 0,
      referenceMonth: "2026-08",
      inactiveAlertList: [],
    };
  }
}
