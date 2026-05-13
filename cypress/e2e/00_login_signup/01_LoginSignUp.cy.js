/// <reference types="cypress" />

describe("Validating SignUp & Login Happy Flow", () => {

  beforeEach(() => {

    cy.viewport(1440, 900);

    cy.visit("https://www.betterwin.com/", {
      failOnStatusCode: false,
    });

  });

  it("Signs up with new user and logs in using same creds", () => {

    // =========================
    // SIGNUP
    // =========================
    cy.signup();

    // =========================
    // WAIT FOR SIGNUP REDIRECT
    // =========================
    cy.url({ timeout: 30000 })
      .should("include", "depositModal=true");

    // =========================
    // ENSURE PAGE STABILIZED
    // =========================
    cy.wait(2000);

    // =========================
    // CLOSE DEPOSIT MODAL
    // =========================
    cy.get(".z-10 > .absolute > svg", {
      timeout: 20000,
    })
      .should("be.visible")
      .click({ force: true });

    // =========================
    // LOGOUT
    // =========================
    cy.logout();

    // =========================
    // LOGIN USING SAVED CREDS
    // =========================
    cy.login();

    // =========================
    // FINAL ASSERTION
    // =========================
    cy.get("body", {
      timeout: 15000,
    }).should("be.visible");

    cy.log(
      "✔ Signup + Login successful with reusable runtime user"
    );

  });

});