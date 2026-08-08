import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ExportStrategy, ExportData } from "../types";

/**
 * Estratégia de exportação em PDF usando jsPDF.
 * Gera um documento PDF com cabeçalho, dados pessoais, endereço e tabela de entregas.
 */
export class PdfBeneficiaryExport implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(data.title || "Relatório de Beneficiários", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120);
    doc.text(`Vicentinos São Pedro • Gerado em ${new Date().toLocaleDateString("pt-BR")}`, pageWidth / 2, 27, { align: "center" });
    doc.setTextColor(0);

    let currentY = 35;

    for (const beneficiary of data.beneficiaries) {
      // Verifica se precisa de nova página
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }

      // Seção: Dados Pessoais
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(beneficiary.fullName, 14, currentY);
      currentY += 6;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      const info = [
        beneficiary.document ? `CPF: ${beneficiary.document}` : null,
        beneficiary.phone ? `Tel: ${beneficiary.phone}` : null,
        beneficiary.birthDate ? `Nasc: ${beneficiary.birthDate.split("-").reverse().join("/")}` : null,
        `Status: ${beneficiary.status === "ACTIVE" ? "Ativo" : "Inativo"}`,
      ].filter(Boolean).join("  •  ");

      doc.text(info, 14, currentY);
      currentY += 5;

      // Endereço
      const address = `${beneficiary.street}, nº ${beneficiary.number} - ${beneficiary.neighborhood}, ${beneficiary.city}/${beneficiary.state} - CEP: ${beneficiary.zipCode}`;
      doc.text(address, 14, currentY);
      currentY += 5;

      if (beneficiary.complement) {
        doc.text(`Complemento: ${beneficiary.complement}`, 14, currentY);
        currentY += 5;
      }

      if (beneficiary.referencePoint) {
        doc.text(`Ref: ${beneficiary.referencePoint}`, 14, currentY);
        currentY += 5;
      }

      if (beneficiary.notes) {
        doc.setFontSize(8);
        doc.setTextColor(80);
        const noteLines = doc.splitTextToSize(`Obs: ${beneficiary.notes}`, pageWidth - 28);
        doc.text(noteLines, 14, currentY);
        currentY += noteLines.length * 4 + 2;
        doc.setTextColor(0);
      }

      currentY += 3;
    }

    // Tabela de Entregas (se houver)
    if (data.deliveries && data.deliveries.length > 0) {
      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Histórico de Visitas / Entregas", 14, currentY);
      currentY += 4;

      autoTable(doc, {
        startY: currentY,
        head: [["Mês Ref.", "Família", "Data Entrega", "Voluntário", "Cestas", "Observação"]],
        body: data.deliveries.map((d) => {
          const dateStr = typeof d.deliveredAt === "string" ? d.deliveredAt : d.deliveredAt.toISOString();
          const formattedDate = dateStr.split("T")[0].split("-").reverse().join("/");
          return [
            d.referenceMonth,
            d.beneficiaryName || "—",
            formattedDate,
            d.deliveredBy,
            String(d.basketsQuantity),
            d.description || "—",
          ];
        }),
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });
    }

    // Download
    const filename = data.beneficiaries.length === 1
      ? `ficha_${data.beneficiaries[0].fullName.replace(/\s+/g, "_").toLowerCase()}.pdf`
      : `relatorio_beneficiarios_${new Date().toISOString().split("T")[0]}.pdf`;

    doc.save(filename);
  }
}
