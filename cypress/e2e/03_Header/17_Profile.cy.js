/// <reference types = "cypress"/>

describe("Validating User Profile Section", function () {

  before(() => {

    cy.viewport(1440, 900);

    cy.intercept('POST', '**/api/v1/user/login**')
      .as('loginApi');

    cy.visit('https://betterwin.com/');

    cy.login();

    cy.wait('@loginApi', { timeout: 20000 });

    cy.wait(3000);
  });


  // =========================================
  // Helper
  // =========================================
  const openMenuAndClick = (text) => {

    cy.get(".outline-none > .w-\\[3rem\\]")
      .should('be.visible')
      .click({ force: true });

    cy.contains(text, { timeout: 10000 })
      .should('exist')
      .then(($el) => {

        cy.wrap($el)
          .click({ force: true });
      });

    cy.wait(2000);
  };


  it("Validating profile flow", function () {

    openMenuAndClick('Profile');

    openMenuAndClick('Verification');

    openMenuAndClick('Responsible Gaming');

    openMenuAndClick('Deposit');

    openMenuAndClick('Withdraw');

    openMenuAndClick('Refer a Friend');

    openMenuAndClick('Transaction');

    openMenuAndClick('Logout');

    cy.get(".relative > .flex > .shadow")
      .click({ force: true });
  });
});