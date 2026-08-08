import { z } from "zod";
import { cpf } from "cpf-cnpj-validator";

/**
 * Zod Schema oficial do domínio de Beneficiados do projeto Vicentinos São Pedro.
 * Valida os dados de cadastro e garante a legitimidade do CPF e endereço completo.
 */
export const beneficiarySchema = z.object({
  fullName: z
    .string()
    .min(3, "O nome completo deve ter pelo menos 3 caracteres.")
    .max(255, "O nome excede o limite permitido de caracteres."),
  document: z
    .string()
    .optional()
    .default("")
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const cleaned = val.replace(/\D/g, "");
      return cleaned.length === 11 ? cpf.isValid(cleaned) : true;
    }, { message: "O CPF informado é inválido. Verifique os números digitados." }),
  phone: z.string().optional().default(""),
  birthDate: z.string().optional().default("")
    .refine((val) => {
      if (!val || val.trim() === "") return true;
      const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!regex.test(val)) return false;
      const [, d, m, y] = val.match(regex)!;
      const day = parseInt(d, 10);
      const month = parseInt(m, 10);
      const year = parseInt(y, 10);
      const currentYear = new Date().getFullYear();
      if (month < 1 || month > 12) return false;
      if (day < 1 || day > 31) return false;
      if (year < 1900 || year > currentYear) return false;
      const daysInMonth = new Date(year, month, 0).getDate();
      return day <= daysInMonth;
    }, { message: "Data de nascimento inválida (use DD/MM/AAAA entre 1900 e hoje)." }),
  street: z.string().min(1, "O endereço (rua/avenida) é obrigatório.").max(255),
  number: z.string().min(1, "O número do imóvel é obrigatório.").max(50),
  neighborhood: z.string().min(1, "O bairro é fundamental para o mapeamento das entregas.").max(100),
  city: z.string().min(1, "A cidade é obrigatória.").max(100).default("Almenara"),
  state: z.string().length(2, "A UF deve ter 2 caracteres.").default("MG"),
  zipCode: z.string().min(1, "O CEP é obrigatório.").max(20),
  complement: z.string().optional().default(""),
  referencePoint: z.string().optional().default(""),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  notes: z.string().max(3000, "As observações socioeconômicas não devem exceder 3000 caracteres.").optional().default(""),
});

export type BeneficiaryInput = z.infer<typeof beneficiarySchema>;
