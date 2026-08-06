/**
 * Regra de Domínio: Normalização de Bairros e Cidades
 * Garante padronização nas listagens para que buscas por bairro (ex: "vila São PEDRO") fiquem homogêneas.
 */
export function formatTitleCase(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed
    .toLowerCase()
    .split(" ")
    .map((word) => {
      if (["da", "de", "do", "das", "dos", "e"].includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

/**
 * Remove caracteres especiais do documento (CPF/RG) deixando apenas números ou padrão limpo.
 */
export function cleanDocument(raw?: string | null): string {
  if (!raw) return "";
  return raw.replace(/[^\d]/g, "");
}

/**
 * Retorna a formatação de mês de referência no padrão YYYY-MM a partir de uma data real do calendário.
 */
export function getReferenceMonth(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

/**
 * Regra de Negócio Crítica (Alerta 2 do Dashboard):
 * Verifica se o beneficiado está há 2 ou mais meses completos sem receber NENHUMA cesta básica.
 * @param lastDeliveryDate Data da última entrega de cesta feita a ele (ou null caso nunca tenha recebido)
 * @param currentDate Data atual do sistema para cálculo comparativo
 */
export function isInactiveForTwoMonths(
  lastDeliveryDate?: Date | string | null,
  currentDate: Date = new Date()
): boolean {
  if (!lastDeliveryDate) return true; // Se nunca recebeu cesta, está na zona de atenção
  const last = typeof lastDeliveryDate === "string" ? new Date(lastDeliveryDate) : lastDeliveryDate;
  if (isNaN(last.getTime())) return true;

  const diffYears = currentDate.getFullYear() - last.getFullYear();
  const diffMonths = currentDate.getMonth() - last.getMonth() + diffYears * 12;
  
  return diffMonths >= 2;
}
