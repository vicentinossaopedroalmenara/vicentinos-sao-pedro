describe("Jornada Assistencial dos Vicentinos São Pedro", () => {
  it("Deve carregar a Home de Login, autenticar-se e entrar no Dashboard Principal", () => {
    // 0. Acesso à Home raiz (que agora é a própria tela de Login do Voluntários)
    cy.visit("/");
    cy.contains("Acesso de Voluntário", { matchCase: false }).should("exist");
    cy.contains("Área Restrita", { matchCase: false }).should("exist");
    
    // 1. Preenchendo credenciais e autenticando via Better-Auth
    cy.get('input[type="email"]').type("voluntario@vicentinossaopedro.org");
    cy.get('input[type="password"]').type("admin_vicentino");
    cy.contains("button", "Acessar Plataforma").click();

    // 2. Comprovação do Redirecionamento Pós-Login para o Dashboard em /dashboard
    cy.url().should("include", "/dashboard");
    cy.contains("Monitoramento Vicentino", { matchCase: false }).should("exist");
    cy.contains("Competência Vigente:", { matchCase: false }).should("exist");

    // 3. Navegação para a lista de Faltam Receber no Mês
    cy.contains("Ver Lista").click();
    cy.url().should("include", "/pendentes");
    cy.contains("Faltam Receber no Mês", { matchCase: false }).should("exist");

    // 4. Navegação de Retorno ao Dashboard e em seguida ao Catálogo
    cy.contains("Voltar ao Dashboard").click();
    cy.url().should("include", "/dashboard");
    cy.visit("/beneficiarios");
    cy.contains("Catálogo de Beneficiários", { matchCase: false }).should("exist");

    // 5. Clique em incluir novo assistido
    cy.contains("Incluir Família", { matchCase: false }).click();
    cy.url().should("include", "/beneficiarios/cadastro");

    // 6. Validação da renderização do formulário reativo de cadastro
    cy.contains("Nome Completo do Assistido", { matchCase: false }).should("exist");
    cy.get('input[name="document"]').should("exist");
    cy.get('input[name="zipCode"]').should("exist");
  });

  it("Deve repeliu e redirecionar para a Home (Login) ao tentar acessar rotas privadas deslogado", () => {
    cy.clearCookies();
    cy.visit("/beneficiarios", { failOnStatusCode: false });
    cy.url().should("not.include", "/beneficiarios");
    // Como a Home "/" é a tela do Login, deve nos colocar no endereço base com Acesso de Voluntário
    cy.contains("Acesso de Voluntário").should("exist");
    cy.contains("E-mail Vicentino").should("exist");
  });
});
