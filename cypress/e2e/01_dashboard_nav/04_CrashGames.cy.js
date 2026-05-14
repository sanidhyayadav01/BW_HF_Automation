/// <reference types="cypress" />

before(() => {

  cy.viewport(1440, 900);

  cy.visit("https://www.betterwin.com/");

  cy.login();

  // =========================
  // AUTH STABILIZATION
  // =========================
  cy.location("pathname", {
    timeout: 20000,
  }).should("not.include", "login");

  cy.get("body", {
    timeout: 20000,
  }).should("be.visible");

  // BetterWin hydration stabilization
  cy.wait(5000);

  // authenticated UI validation
  cy.contains(/wallet|deposit/i, {
    timeout: 30000,
  }).should("be.visible");

});

describe("Crash Games Happy Flow", () => {

  const categories = [
    { name: "Instant Win Games", slug: "instant-win-games" },
    { name: "Crash Games", slug: "crash-games", parentOnly: true },
    { name: "Scratch Cards", slug: "scratch-cards" },
    { name: "Arcade Games", slug: "arcade-games" },
    { name: "Action Games", slug: "action-games" },
    { name: "Instant Games", slug: "instant-games" },
    { name: "Fishing Games", slug: "fishing-games" },
  ];

  beforeEach(() => {

    cy.intercept("GET", "**/casino/games*")
      .as("games");

    cy.visit("https://www.betterwin.com/casino");

    cy.wait("@games", {
      timeout: 30000,
    });

    // =========================
    // PAGE STABILIZATION
    // =========================
    cy.get("body", {
      timeout: 20000,
    }).should("be.visible");

    cy.wait(3000);

    // =========================
    // OPEN CRASH GAMES ACCORDION
    // =========================
    cy.contains("button", /^Crash Games$/i, {
      timeout: 20000,
    })
      .filter(":visible")
      .first()
      .scrollIntoView()
      .click({ force: true });

    cy.wait(1500);

  });

  categories.forEach((category) => {

    it(`Validate ${category.name}`, () => {

      cy.log(`Checking ${category.name}`);

      // Capture existing API calls
      cy.get("@games.all").then((initialCalls) => {

        const previousLength = initialCalls.length;

        // =========================
        // CATEGORY CLICK
        // =========================
        cy.contains(
          new RegExp(`^${category.name}$`, "i"),
          {
            timeout: 20000,
          }
        )
          .filter(":visible")
          .first()
          .scrollIntoView()
          .click({ force: true });

        cy.wait(1500);

        // =========================
        // PARENT ACCORDION CASE
        // =========================
        if (category.parentOnly) {

          cy.log(`Parent accordion validated`);

          return;
        }

        // =========================
        // URL VALIDATION
        // =========================
        cy.location("pathname", {
          timeout: 15000,
        }).should("include", category.slug);

        // =========================
        // API VALIDATION
        // =========================
        cy.get("@games.all").then((updatedCalls) => {

          const latestLength = updatedCalls.length;

          let apiCount = 0;

          // CASE 1 — Fresh API fired
          if (latestLength > previousLength) {

            const latestCall =
              updatedCalls[updatedCalls.length - 1];

            const games =
              latestCall?.response?.body?.data?.data || [];

            apiCount = games.length;

            cy.log(`Fresh API detected`);
            cy.log(`API Count: ${apiCount}`);

            expect(games).to.be.an("array");

          }

          // CASE 2 — Cached frontend state
          else {

            cy.log(`Cached state detected`);

          }

          // =========================
          // UI VALIDATION
          // =========================
          cy.get("body").then(($body) => {

            const uiCards =
              $body.find(".flex-shrink-0");

            const visibleCards =
              Cypress.$(uiCards)
                .filter((_, el) =>
                  Cypress.$(el).is(":visible")
                )
                .filter((_, el) => {

                  return Cypress.$(el)
                    .children(".flex-shrink-0")
                    .length === 0;

                })
                .length;

            cy.log("====================================");
            cy.log(`Category: ${category.name}`);
            cy.log(`API Count: ${apiCount}`);
            cy.log(`Visible UI Cards: ${visibleCards}`);
            cy.log("====================================");

            // CASE 1 — API HAS GAMES
            if (apiCount > 0) {

              expect(visibleCards)
                .to.be.greaterThan(0);

              expect(visibleCards)
                .to.be.at.least(1);

              // loose upper bound
              expect(visibleCards)
                .to.be.at.most(apiCount * 5);

            }

            // CASE 2 — EMPTY CATEGORY
            else {

              cy.log(`Empty category detected`);

              expect(visibleCards)
                .to.be.oneOf([0, 1]);

              cy.log(
                `No assertion failure for empty dataset`
              );

            }

          });

        });

      });

    });

  });

});