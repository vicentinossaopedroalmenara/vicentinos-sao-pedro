import type { ExportStrategy, ExportData } from "../types";

/**
 * Estratégia de compartilhamento via WhatsApp.
 * Monta um texto formatado com os dados do beneficiário e abre o wa.me.
 */
export class WhatsappBeneficiaryExport implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    const lines: string[] = [];

    lines.push(`*${data.title || "Relatório de Beneficiários"}*`);
    lines.push(`Data: ${new Date().toLocaleDateString("pt-BR")}`);
    lines.push("");

    for (const b of data.beneficiaries) {
      lines.push(`*Família:* ${b.fullName}`);

      if (b.document) lines.push(`Doc: ${b.document}`);
      if (b.phone) lines.push(`Tel: ${b.phone}`);
      if (b.birthDate) lines.push(`Nasc: ${b.birthDate.split("-").reverse().join("/")}`);
      lines.push(`Status: ${b.status === "ACTIVE" ? "Ativo" : "Inativo"}`);
      lines.push("");

      lines.push(`*Endereço:*`);
      lines.push(`${b.street}, nº ${b.number}`);
      lines.push(`${b.neighborhood} - ${b.city}/${b.state}`);
      lines.push(`CEP: ${b.zipCode}`);
      if (b.complement) lines.push(`Comp: ${b.complement}`);
      if (b.referencePoint) lines.push(`Ref: ${b.referencePoint}`);
      lines.push("");

      if (b.notes) {
        lines.push(`*Obs:* ${b.notes}`);
        lines.push("");
      }
    }

    if (data.deliveries && data.deliveries.length > 0) {
      lines.push(`*Histórico de Visitas (${data.deliveries.length}):*`);
      lines.push("");

      for (const d of data.deliveries) {
        const dateStr = typeof d.deliveredAt === "string" ? d.deliveredAt : d.deliveredAt.toISOString();
        const formattedDate = dateStr.split("T")[0].split("-").reverse().join("/");
        lines.push(`• ${d.referenceMonth} | ${d.beneficiaryName || "Família"} | ${formattedDate} | ${d.deliveredBy} | ${d.basketsQuantity} cesta(s)`);
        if (d.description) lines.push(`  _${d.description}_`);
      }
    }

    lines.push("");
    lines.push("_Vicentinos São Pedro_");

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }
}
