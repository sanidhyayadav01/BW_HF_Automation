/// <reference types="cypress" />

beforeEach(function () {
  cy.viewport(1440, 900);
});

describe("Validating different sections of Casino", function () {
  it("Validating Casino Flow", function () {
    cy.visit("https://betterwin.com/");

    cy.intercept("GET", "**/casino/games*").as("getGames");

    cy.login();
    cy.wait(2000);

    cy.contains("Casino").click();

    function checkGames(categoryName, slug) {
      cy.log(`Checking ${categoryName}`);

      cy.contains(categoryName)
        .scrollIntoView()
        .click({ force: true });

      cy.url().should("include", slug);

      cy.wait("@getGames", { timeout: 20000 }).then((interception) => {
        const requestUrl = interception.request.url;

        expect(requestUrl).to.include(`categorySlug=${slug}`);

        const games = interception.response?.body?.data?.data || [];
        const apiCount = games.length;

        cy.log(`API returned ${apiCount} games for ${categoryName}`);

        cy.wait(1000);

        cy.get("body").should("exist").then(($body) => {

          // STRICT FIX: only real visible cards
          const uiElements = $body.find(".flex-shrink-0");

          const uiCount = Cypress.$(uiElements)
            .filter((_, el) => Cypress.$(el).is(":visible"))
            .filter((_, el) => {
              // remove nested/duplicate wrappers
              return Cypress.$(el).children(".flex-shrink-0").length === 0;
            })
            .length;

          cy.log("====================================");
          cy.log(`Category: ${categoryName}`);
          cy.log(`API Count: ${apiCount}`);
          cy.log(`UI Count: ${uiCount}`);
          cy.log("====================================");

          // ---------------- CASE 1: API has games ----------------
          if (apiCount > 0) {
            expect(uiCount).to.be.greaterThan(0);

            // allow UI duplication safely (carousel, lazy load, etc.)
            expect(uiCount).to.be.at.least(1);
            expect(uiCount).to.be.at.most(apiCount * 5);
          }

          // ---------------- CASE 2: API has NO games ----------------
          else {
            expect(uiCount).to.be.lte(1);
          }
        });
      });
    }

    const categories = [
      { name: "Top Games", slug: "top-games" },
      { name: "New Games", slug: "new-games" },
      { name: "Bingo", slug: "bingo" },
      { name: "Blackjack", slug: "blackjack" },
      { name: "Roulette", slug: "roulette" },
      { name: "Drops & Wins", slug: "drops-wins" },
      { name: "Bonus Buy", slug: "bonus-buy" },
      { name: "Hold & Win", slug: "hold-win" },
      { name: "Megaways", slug: "megaways" },
      { name: "Slots Deluxe", slug: "slots-deluxe" },
      { name: "Jackpots", slug: "jackpots" },
      { name: "Books Library", slug: "books-library" },
      { name: "Classics", slug: "classics" },
      { name: "Vegas Slots", slug: "vegas-slots" },
      { name: "Mythology", slug: "mythology" },
      { name: "Egyptian", slug: "egyptian" },
      { name: "Hot & Cold", slug: "hot-cold" },
      { name: "Table Games", slug: "table-games" },
      { name: "Video Slots", slug: "video-slots" },
      { name: "Baccarat", slug: "baccarat" },
      { name: "Poker", slug: "poker" },
      { name: "Other Table Games", slug: "other-table-games" },
      { name: "Dice", slug: "dice" },
      { name: "Lottery", slug: "lottery" },
      { name: "Wheel of Fortune", slug: "wheel-of-fortune" },
      { name: "Minigame", slug: "minigame" },
      { name: "Slot Game Providers", slug: "slot-game-providers" },
      { name: "Shop", slug: "shop" },
    ];

    categories.forEach((category) => {
      checkGames(category.name, category.slug);
    });
  });
});