"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { beneficiarySchema, cleanDocument } from "@/domain/beneficiary";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkVolunteerAuth } from "@/auth/guard";

export async function createBeneficiary(formData: unknown) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Sessão não autorizada para cadastrar novas famílias no banco.", unauthorized: true };
  }

  try {
    const parsed = beneficiarySchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dados de cadastro inválidos.";
      return { error: firstError };
    }

    const data = parsed.data;
    const cleanDoc = cleanDocument(data.document);

    const existing = await db
      .select()
      .from(beneficiaries)
      .where(eq(beneficiaries.document, cleanDoc))
      .limit(1);

    if (existing.length > 0) {
      return { error: "Já existe uma família assistida cadastrada com este Documento (CPF)." };
    }

    const now = new Date();

    const [created] = await db
      .insert(beneficiaries)
      .values({
        fullName: data.fullName,
        document: cleanDoc,
        phone: data.phone || null,
        birthDate: data.birthDate || null,
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state.toUpperCase(),
        zipCode: data.zipCode,
        complement: data.complement || null,
        referencePoint: data.referencePoint || null,
        status: data.status,
        notes: data.notes || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    revalidatePath("/", "layout");
    return { success: true, beneficiary: created };
  } catch (error) {
    console.error("Error createBeneficiary:", error);
    return { error: "Erro de conexão ao salvar beneficiado na base do PostgreSQL." };
  }
}
