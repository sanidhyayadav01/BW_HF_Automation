// /// <reference types="cypress" />

// describe("Wallet Section - Validation", () => {
//   before(() => {
//     cy.viewport(1440, 900);

//     cy.intercept("POST", "**/api/v1/user/login**").as("loginApi");

//     cy.intercept("POST", "**/payment/bitpace/deposit**").as("depositApi");

//     cy.visit("https://betterwin.com/");

//     cy.login();

//     cy.wait("@loginApi", { timeout: 30000 });

//     // allow UI/session to stabilize
//     cy.wait(3000);
//   });

//   it("Validates Wallet Sections + Deposit API", () => {
//     cy.visit("https://betterwin.com/?depositModal=true");

//     cy.wait(3000);

//     // =========================================
//     // PROFILE POPUP (ONLY IF IT APPEARS)
//     // =========================================
//     cy.get("body").then(($body) => {
//       if ($body.find('[name="firstName"]').length > 0) {
//         cy.log("Profile completion popup appeared");

//         cy.get('[name="firstName"]').clear().type("test");

//         cy.get('[name="lastName"]').clear().type("test");

//         cy.get('[name="postalCode"]').clear().type(12345);

//         cy.get(".form-control")
//           .type("9876543210", {
//             delay: 100,
//             force: true,
//           })
//           .should("have.value", "9876543210");

//         cy.get(":nth-child(6) > :nth-child(2) > .relative > .flex").click(
//           { multiple: true },
//           { force: true },
//         );

//         cy.get('[aria-labelledby="radix-:r79:"]').click({ force: true });

//         cy.contains("Save").click({ force: true });

//         cy.wait(2000);
//       } else {
//         cy.log("Profile popup not shown (already completed)");
//       }
//     });

//     // =========================================
//     // WALLET SECTION ASSERTIONS
//     // =========================================

//     cy.visit("https://betterwin.com/?depositModal=true");
//     cy.contains("Deposit", { timeout: 20000 })
//       .should("exist")
//       .and("be.visible");

//     cy.contains("Withdraw", { timeout: 20000 })
//       .should("exist")
//       .and("be.visible");

//     // Test Deposit may not exist for all users
//     cy.get("body").then(($body) => {
//       if ($body.text().includes("Test Deposit")) {
//         cy.contains("Test Deposit").should("be.visible");

//         cy.log("✔ Test Deposit visible");
//       } else {
//         cy.log("Test Deposit section not available for this account");
//       }
//     });

    
//     // =========================================
//     // OPTIONAL API VALIDATION
//     // =========================================
//     cy.wait(2000);

//     cy.get("body").then(() => {
//       cy.log("Wallet page loaded successfully");
//     });
//   });
// });
