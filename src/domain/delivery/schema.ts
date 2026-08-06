import { z } from "zod";

/**
 * Zod Schema oficial do domínio de Entregas de Cestas Básicas.
 * Valida datas do fornecimento, mês de competência da doação e registro de responsabilidade.
 */
export const deliverySchema = z.object({
  beneficiaryId: z
    .number({ message: "Selecione uma família para registrar a visita." })
    .positive("O código da família é obrigatório."),
  deliveredAt: z.string().min(1, "A data da visita deve ser preenchida."),
  referenceMonth: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "O mês de referência deve obedecer o formato YYYY-MM (ex: 2026-08)."),
  basketsQuantity: z.number().int().min(0, "A quantidade de cestas não pode ser negativa.").default(1),
  description: z.string().max(1000, "A descrição não deve ultrapassar 1000 caracteres.").optional().default(""),
  deliveredBy: z.string().min(1, "Informe quem foi o voluntário da visita.").max(255),
});

export type DeliveryInput = z.infer<typeof deliverySchema>;
