Cypress.Commands.add("signup", () => {
  const randomId = Math.floor(100000 + Math.random() * 900000);

  const runtimeUser = {
    email: `test${randomId}@gmail.com`,
    password: "Tester@001",
  };

  cy.writeFile("cypress/fixtures/runtimeUser.json", runtimeUser);

  cy.get(".text-primary-foreground").click();

  cy.get('.duration-200 > [name="email"]').type(runtimeUser.email);

  cy.get('[name="password"]').type(runtimeUser.password);

  cy.get(".style_btnAll_login__us0__").click();

  cy.log(`✔ Created User: ${runtimeUser.email}`);
});

Cypress.Commands.add("login", () => {
  cy.fixture("runtimeUser").then((user) => {
    cy.contains("Login").click({ force: true });

    cy.get('[name="loginInput"]').type(user.email);

    cy.get('[name="password"]').type(user.password);

    cy.get(":nth-child(3) > .gap-2").click();
  });
});

Cypress.Commands.add("logout", () => {
  cy.get(".outline-none > .w-\\[3rem\\]").click({ force: true });

  cy.contains("Logout").click({ force: true });

  cy.get(".relative > .flex > .shadow").click();
});