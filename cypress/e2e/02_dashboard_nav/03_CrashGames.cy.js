/// <reference types="cypress" />

before(() => {

  cy.viewport(1440, 900);

  cy.visit("https://betterwin.com/");

  cy.login();

  // Wait for auth state hydration
  cy.wait(3000);

  cy.reload();

  // Verify authenticated UI loaded
  cy.contains("Wallet", {
    timeout: 20000,
  }).should("exist");
});

describe("Crash Games Happy Flow", () => {

  const categories = [
    { name: "Instant Win Games", slug: "instant-win-games" },
    { name: "Crash Games", slug: "crash-games", parentOnly: true },
    { name: "Scratch Cards", slug: "scratch-cards" },
    { name: "Arcade Games", slug: "arcade-games" },
    { name: "Crash Game", slug: "crash-game" },
    { name: "Action Games", slug: "action-games" },
    { name: "Instant Games", slug: "instant-games" },
    { name: "Fishing Games", slug: "fishing-games" },
  ];

  beforeEach(() => {

    cy.intercept("GET", "**/casino/games*").as("games");

    cy.visit("https://betterwin.com/casino");

    cy.wait("@games", { timeout: 20000 });

    // Open Crash Games Accordion
    cy.get(':nth-child(3) > .w-full', {
      timeout: 15000,
    })
      .should("exist")
      .click({ force: true });

    cy.wait(1500);
  });

  categories.forEach((category) => {

    it(`Validate ${category.name}`, () => {

      cy.log(`Checking ${category.name}`);

      // Capture existing API calls
      cy.get("@games.all").then((initialCalls) => {

        const previousLength = initialCalls.length;

        // Exact category match (important for Crash Game vs Crash Games)
        cy.contains(
          new RegExp(`^${category.name}$`, "i"),
          {
            timeout: 20000,
          }
        )
          .should("exist")
          .scrollIntoView()
          .click({ force: true });

        cy.wait(1000);

        // Parent accordion only
        if (category.parentOnly) {

          cy.log(`Parent accordion validated`);

          return;
        }

        // URL Validation
        cy.location("pathname", {
          timeout: 15000,
        }).should("include", category.slug);

        // Detect fresh API vs cached state
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

          // Common UI validation
          cy.get("body").then(($body) => {

            const uiCards = $body.find(".flex-shrink-0");

            const visibleCards = Cypress.$(uiCards)
              .filter((_, el) => Cypress.$(el).is(":visible"))
              .filter((_, el) => {
                return Cypress.$(el)
                  .children(".flex-shrink-0").length === 0;
              })
              .length;

            cy.log("====================================");
            cy.log(`Category: ${category.name}`);
            cy.log(`API Count: ${apiCount}`);
            cy.log(`Visible UI Cards: ${visibleCards}`);
            cy.log("====================================");

            // CASE 1 — API has games
            if (apiCount > 0) {

              expect(visibleCards).to.be.greaterThan(0);

              expect(visibleCards).to.be.at.least(1);

              // loose upper bound for lazy/carousel rendering
              expect(visibleCards).to.be.at.most(apiCount * 5);
            }

            // CASE 2 — Empty category
            else {

              cy.log(`Empty category detected`);

              expect(visibleCards).to.be.oneOf([0, 1]);

              cy.log(`No assertion failure for empty dataset`);
            }
          });
        });
      });
    });
  });
});