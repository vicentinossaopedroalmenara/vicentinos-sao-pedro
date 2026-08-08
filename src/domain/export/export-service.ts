import { ExportFormat, type ExportStrategy } from "./types";
import { PdfBeneficiaryExport } from "./strategies/pdf-beneficiary";
import { DocxBeneficiaryExport } from "./strategies/docx-beneficiary";
import { WhatsappBeneficiaryExport } from "./strategies/whatsapp-beneficiary";

/**
 * Factory que retorna a estratégia de exportação correta com base no formato.
 * Princípio Open/Closed: para adicionar um novo formato, basta criar a nova classe
 * e registrar neste factory, sem modificar as estratégias existentes.
 */
export function createExportStrategy(format: ExportFormat): ExportStrategy {
  switch (format) {
    case ExportFormat.PDF:
      return new PdfBeneficiaryExport();
    case ExportFormat.DOCX:
      return new DocxBeneficiaryExport();
    case ExportFormat.WHATSAPP:
      return new WhatsappBeneficiaryExport();
    default:
      throw new Error(`Formato de exportação não suportado: ${format}`);
  }
}
