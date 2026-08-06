"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { count, ilike, or, desc, eq, and } from "drizzle-orm";
import { checkVolunteerAuth } from "@/auth/guard";
import { unstable_cache } from "next/cache";

const getCachedBeneficiaries = unstable_cache(
  async (page: number, pageSize: number, search: string, status: string | undefined) => {
    const offset = (page - 1) * pageSize;

    let whereClause = undefined;
    const searchConditions = [];

    if (search.trim()) {
      searchConditions.push(
        ilike(beneficiaries.fullName, `%${search.trim()}%`),
        ilike(beneficiaries.document, `%${search.trim()}%`),
        ilike(beneficiaries.neighborhood, `%${search.trim()}%`)
      );
    }

    const conditions = [];

    if (status) {
      conditions.push(eq(beneficiaries.status, status));
    }
    if (searchConditions.length > 0) {
      conditions.push(or(...searchConditions));
    }

    whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select()
      .from(beneficiaries)
      .where(whereClause)
      .orderBy(desc(beneficiaries.createdAt))
      .limit(pageSize)
      .offset(offset);

    const [{ value: totalCount }] = await db
      .select({ value: count() })
      .from(beneficiaries)
      .where(whereClause);

    return {
      success: true,
      items,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
  ["beneficiaries-list"],
  {
    revalidate: 300,
    tags: ["beneficiaries"],
  }
);

interface GetBeneficiariesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export async function getBeneficiaries({
  page = 1,
  pageSize = 10,
  search = "",
  status,
}: GetBeneficiariesParams = {}) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Voluntário não autenticado na base.", unauthorized: true, items: [], totalCount: 0, totalPages: 0 };
  }

  try {
    return await getCachedBeneficiaries(page, pageSize, search, status);
  } catch (error) {
    console.error("Error getBeneficiaries:", error);
    return { success: false, items: [], totalCount: 0, totalPages: 0 };
  }
}
