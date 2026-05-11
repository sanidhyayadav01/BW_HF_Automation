/// <reference types = 'cypress' />

beforeEach(function () {

  cy.visit("https://betterwin.com/");

  cy.viewport(1440, 900);
});

describe("Validating SignUp & Login Happy Flow", function () {

  it("Signs up with new user and logs in using same creds", function () {

    // SIGNUP
    cy.signup();

    cy.wait(4000);


    // LOGOUT
    cy.get("body").then(($body) => {

      if ($body.find(".z-10 > .absolute > svg > path").length > 0) {

        cy.get(".z-10 > .absolute > svg > path")
          .click({ force: true });

        cy.wait(2000);

        cy.logout();

        cy.wait(3000);
      }
    });


    // LOGIN USING GENERATED CREDS
    cy.login();

    cy.wait(4000);

    cy.log("✔ Signup + Login successful with dynamic user");
  });
});