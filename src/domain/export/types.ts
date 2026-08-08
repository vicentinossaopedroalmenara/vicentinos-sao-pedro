/**
 * Contratos e tipos do módulo de Exportação de Dados.
 * Define a interface Strategy e os tipos de dados compartilhados entre os exportadores.
 */

export enum ExportFormat {
  PDF = "PDF",
  DOCX = "DOCX",
  WHATSAPP = "WHATSAPP",
}

export interface ExportBeneficiaryData {
  id: number;
  fullName: string;
  document?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string | null;
  referencePoint?: string | null;
  status: string;
  notes?: string | null;
}

export interface ExportDeliveryData {
  id: number;
  referenceMonth: string;
  deliveredAt: string | Date;
  deliveredBy: string;
  basketsQuantity: number;
  description?: string | null;
  beneficiaryName?: string;
}

export interface ExportData {
  beneficiaries: ExportBeneficiaryData[];
  deliveries?: ExportDeliveryData[];
  title?: string;
}

/**
 * Interface Strategy — cada exportador implementa este contrato.
 * Princípio Open/Closed: para adicionar um novo formato (CSV, Excel, etc),
 * basta criar uma nova classe sem modificar as existentes.
 */
export interface ExportStrategy {
  export(data: ExportData): Promise<void>;
}
