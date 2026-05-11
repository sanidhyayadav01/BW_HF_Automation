/// <reference types="cypress" />

describe("Language Selection - Italiano Switch", () => {
  before(() => {
    cy.viewport(1440, 900);
  });

  beforeEach(() => {
    cy.intercept("POST", "**/user/login*").as("loginAPI");

    cy.visit("https://betterwin.com/");

    cy.login();

    cy.wait("@loginAPI", { timeout: 30000 });
  });

  it("Switch language to Italiano and validates URL and then back to English", () => {
    // Open language dropdown
    cy.get(".w-\\[1\\.5rem\\] > .transition-transform", { timeout: 20000 })
      .should("be.visible")
      .click();

    // Select Italiano
    cy.contains("Italiano", { timeout: 20000 }).click({ force: true });

    // Assert URL change (MAIN ASSERTION)
    cy.url({ timeout: 20000 }).should("include", "/it");

    cy.get(".w-\\[1\\.5rem\\] > .transition-transform", { timeout: 20000 })
      .should("be.visible")
      .click();
    
    cy.contains("English", { timeout: 20000 }).click({ force: true });
    // Optional sanity check
    //cy.get('body').should('be.visible')

    cy.log("✔ Language successfully switched to Italiano (/it)");
  });
});
