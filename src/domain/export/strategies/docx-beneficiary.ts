import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType } from "docx";
import { saveAs } from "file-saver";
import type { ExportStrategy, ExportData } from "../types";

/**
 * Estratégia de exportação em DOCX usando a lib docx.
 * Gera um documento Word estruturado com dados pessoais, endereço e tabela de entregas.
 */
export class DocxBeneficiaryExport implements ExportStrategy {
  async export(data: ExportData): Promise<void> {
    const children: Paragraph[] = [];

    // Título
    children.push(
      new Paragraph({
        text: data.title || "Relatório de Beneficiários",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
        children: [
          new TextRun({
            text: `Vicentinos São Pedro • Gerado em ${new Date().toLocaleDateString("pt-BR")}`,
            size: 18,
            color: "888888",
            italics: true,
          }),
        ],
      })
    );

    for (const b of data.beneficiaries) {
      // Nome
      children.push(
        new Paragraph({
          spacing: { before: 300, after: 100 },
          children: [
            new TextRun({ text: b.fullName, bold: true, size: 28 }),
            new TextRun({ text: `  (${b.status === "ACTIVE" ? "Ativo" : "Inativo"})`, size: 20, color: b.status === "ACTIVE" ? "10B981" : "F59E0B" }),
          ],
        })
      );

      // Dados pessoais
      const personalInfo = [
        b.document ? `CPF: ${b.document}` : null,
        b.phone ? `Telefone: ${b.phone}` : null,
        b.birthDate ? `Nascimento: ${b.birthDate.split("-").reverse().join("/")}` : null,
      ].filter(Boolean).join("  •  ");

      if (personalInfo) {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [new TextRun({ text: personalInfo, size: 20 })],
          })
        );
      }

      // Endereço
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Endereço: ", bold: true, size: 20 }),
            new TextRun({ text: `${b.street}, nº ${b.number} - ${b.neighborhood}, ${b.city}/${b.state} - CEP: ${b.zipCode}`, size: 20 }),
          ],
        })
      );

      if (b.complement) {
        children.push(new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Complemento: ", bold: true, size: 20 }),
            new TextRun({ text: b.complement, size: 20 }),
          ],
        }));
      }

      if (b.referencePoint) {
        children.push(new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({ text: "Ponto de Referência: ", bold: true, size: 20 }),
            new TextRun({ text: b.referencePoint, size: 20, italics: true }),
          ],
        }));
      }

      if (b.notes) {
        children.push(new Paragraph({
          spacing: { after: 100 },
          children: [
            new TextRun({ text: "Observações: ", bold: true, size: 20 }),
            new TextRun({ text: b.notes, size: 20, italics: true, color: "666666" }),
          ],
        }));
      }
    }

    // Tabela de Entregas
    const sectionChildren: (Paragraph | Table)[] = [...children];

    if (data.deliveries && data.deliveries.length > 0) {
      sectionChildren.push(
        new Paragraph({
          text: "Histórico de Visitas / Entregas",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        })
      );

      const headerCells = ["Mês Ref.", "Família", "Data Entrega", "Voluntário", "Cestas", "Observação"];
      const noBorder = { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" };
      const borders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

      const headerRow = new TableRow({
        children: headerCells.map((text) =>
          new TableCell({
            borders,
            shading: { type: ShadingType.SOLID, color: "10B981" },
            children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 18, color: "FFFFFF" })] })],
          })
        ),
      });

      const dataRows = data.deliveries.map((d, idx) => {
        const dateStr = typeof d.deliveredAt === "string" ? d.deliveredAt : d.deliveredAt.toISOString();
        const formattedDate = dateStr.split("T")[0].split("-").reverse().join("/");
        const rowShading = idx % 2 === 0 ? undefined : { type: ShadingType.SOLID, color: "F8FAFC" };

        return new TableRow({
          children: [
            d.referenceMonth,
            d.beneficiaryName || "—",
            formattedDate,
            d.deliveredBy,
            String(d.basketsQuantity),
            d.description || "—",
          ].map((text) =>
            new TableCell({
              borders,
              shading: rowShading,
              children: [new Paragraph({ children: [new TextRun({ text, size: 18 })] })],
            })
          ),
        });
      });

      sectionChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [headerRow, ...dataRows],
        })
      );
    }

    const doc = new Document({
      sections: [{ children: sectionChildren }],
    });

    const blob = await Packer.toBlob(doc);
    const filename = data.beneficiaries.length === 1
      ? `ficha_${data.beneficiaries[0].fullName.replace(/\s+/g, "_").toLowerCase()}.docx`
      : `relatorio_beneficiarios_${new Date().toISOString().split("T")[0]}.docx`;

    saveAs(blob, filename);
  }
}
