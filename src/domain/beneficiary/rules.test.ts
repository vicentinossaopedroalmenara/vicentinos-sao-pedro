import {
  isInactiveForTwoMonths,
  cleanDocument,
  formatTitleCase,
  getReferenceMonth,
} from "./rules";

describe("Regras do Domínio - Vicentinos São Pedro", () => {
  describe("isInactiveForTwoMonths (Detecção de Inatividade de 2+ meses sem cesta)", () => {
    it("deve retornar true quando a data da última entrega for nula ou indefinida (nunca recebeu cesta)", () => {
      expect(isInactiveForTwoMonths(null)).toBe(true);
      expect(isInactiveForTwoMonths(undefined)).toBe(true);
    });

    it("deve retornar true quando a última entrega ocorreu há 2 ou mais meses atrás", () => {
      const oldDate = new Date();
      oldDate.setMonth(oldDate.getMonth() - 2);
      oldDate.setDate(oldDate.getDate() - 5); // 2 meses e 5 dias atrás
      expect(isInactiveForTwoMonths(oldDate)).toBe(true);
    });

    it("deve retornar false quando a última entrega ocorreu recentemente (menos de 2 meses)", () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 15); // 15 dias atrás
      expect(isInactiveForTwoMonths(recentDate)).toBe(false);
    });
  });

  describe("cleanDocument (Higienização do CPF)", () => {
    it("deve remover pontos, traços, barras e espaços do documento", () => {
      expect(cleanDocument("123.456.789-00")).toBe("12345678900");
      expect(cleanDocument(" 456 / 789 - 10 ")).toBe("45678910");
    });

    it("deve retornar string vazia se documento for nulo ou vazio", () => {
      expect(cleanDocument("")).toBe("");
      expect(cleanDocument(undefined as any)).toBe("");
    });
  });

  describe("formatTitleCase (Formatação de Nomes)", () => {
    it("deve capitalizar corretamente nomes próprios mantendo preposições minúsculas", () => {
      expect(formatTitleCase("JOSE DA SILVA rodrigues")).toBe("Jose da Silva Rodrigues");
      expect(formatTitleCase("maria dos santos e souza")).toBe("Maria dos Santos e Souza");
    });
  });

  describe("getReferenceMonth (Competência Mensal)", () => {
    it("deve retornar a string do mês no formato YYYY-MM para uma data informada", () => {
      const testDate = new Date("2026-08-15T12:00:00Z");
      expect(getReferenceMonth(testDate)).toBe("2026-08");
    });
  });
});
