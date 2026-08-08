"use server";

import { db } from "@/db";
import { beneficiaries } from "@/db/schema/beneficiary";
import { beneficiarySchema, cleanDocument } from "@/domain/beneficiary";
import { eq, ne, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { checkVolunteerAuth } from "@/auth/guard";

export async function updateBeneficiary(id: number, formData: unknown) {
  const { authenticated } = await checkVolunteerAuth();
  if (!authenticated) {
    return { success: false, error: "Acesso Negado: Você precisa estar logado como Voluntário para editar dados assistenciais.", unauthorized: true };
  }

  try {
    const parsed = beneficiarySchema.safeParse(formData);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Dados de edição inválidos.";
      return { error: firstError };
    }

    const data = parsed.data;
    const cleanDoc = data.document && data.document.trim() !== "" ? cleanDocument(data.document) : null;

    if (cleanDoc) {
      const existing = await db
        .select()
        .from(beneficiaries)
        .where(and(eq(beneficiaries.document, cleanDoc), ne(beneficiaries.id, id)))
        .limit(1);

      if (existing.length > 0) {
        return { error: "Este CPF já pertence a outra família assistida em nosso cadastro." };
      }
    }

    const now = new Date();

    const [updated] = await db
      .update(beneficiaries)
      .set({
        fullName: data.fullName,
        document: cleanDoc,
        phone: data.phone || null,
        birthDate: data.birthDate ? data.birthDate.split('/').reverse().join('-') : null,
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
        updatedAt: now,
      })
      .where(eq(beneficiaries.id, id))
      .returning();

    revalidatePath("/", "layout");
    return { success: true, beneficiary: updated };
  } catch (error) {
    console.error("Error updateBeneficiary:", error);
    return { error: "Falha técnica ao atualizar dados cadastrais no PostgreSQL." };
  }
}
