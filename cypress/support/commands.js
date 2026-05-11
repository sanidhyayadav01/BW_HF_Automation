// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("signup", () => {
  const randomId = Math.floor(100000 + Math.random() * 900000);

  const username = `test${randomId}`;
  const email = `${username}@gmail.com`;
  const password = "Tester@001";

  // save runtime creds
  cy.writeFile("cypress/fixtures/runtimeUser.json", {
    username,
    password,
  });

  cy.get(".text-primary-foreground").click();

  cy.get('[name="userName"]').type(username);

  cy.get('.duration-200 > [name="email"]').type(email);

  cy.get('[name="password"]').type(password);

  cy.get(".style_btnAll_login__us0__").click();

  cy.log(`✔ Created User: ${username}`);
});

Cypress.Commands.add("login", () => {
  cy.fixture("runtimeUser").then((user) => {
    cy.contains("Login").click({ force: true });

    cy.get('[name="userName"]').type(user.username);

    cy.get('[name="password"]').type(user.password);

    cy.get(":nth-child(3) > .gap-2").click();

    cy.log(`✔ Logged in as: ${user.username}`);
  });
});

Cypress.Commands.add("logout", () => {
  cy.get(".outline-none > .w-\\[3rem\\]").click({ force: true });
  cy.contains("Logout").click({ force: true });
  cy.get(".relative > .flex > .shadow").click();
});
