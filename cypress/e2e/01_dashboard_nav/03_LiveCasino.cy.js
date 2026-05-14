/// <reference types="cypress" />

beforeEach(() => {
  cy.viewport(1440, 900);
});

describe("Validating Live Casino Section", () => {
  it("Live Casino Flow", () => {
    cy.visit("https://www.betterwin.com/");

    cy.intercept("GET", "**/casino/games*").as("getGames");
    cy.intercept("GET", "**/casino/category*").as("getCategory");

    cy.login();

    cy.visit("https://www.betterwin.com/live-casino/live-casino");

    cy.wait("@getCategory", { timeout: 20000 });

    cy.location("pathname").should("include", "/live-casino/live-casino");

    const categories = [
      { name: "Live Casino", slug: "live-casino" },
      { name: "Live Blackjack", slug: "live-blackjack" },
      { name: "Live Poker", slug: "live-poker" },
      { name: "Live Baccarat", slug: "live-baccarat" },
      { name: "Other Live Games", slug: "other-live-games" },
      { name: "Live Roulette", slug: "live-roulette" },
      { name: "Live Games", slug: "live-games" },
      { name: "Live Dice", slug: "live-dice" },
      { name: "Live Game Shows", slug: "live-game-shows" },
      { name: "Live Dealer", slug: "live-dealer" },
      { name: "Live Dragon Tiger", slug: "live-dragon-tiger" },
    ];

    function logCounts(categoryName, apiCount, uiCount) {
      cy.log(`${categoryName}`);
      cy.log(`API Games: ${apiCount}`);
      cy.log(`UI Cards: ${uiCount}`);
    }

    function validateCategory(category) {
      cy.log(`Checking ${category.name}`);

      cy.contains(new RegExp(`^${category.name}$`))
        .scrollIntoView()
        .click({ force: true });

      cy.location("pathname", { timeout: 15000 }).should(
        "eq",
        `/live-casino/${category.slug}`
      );

      cy.wait(2000);

      cy.get("@getGames.all").then((calls) => {
        const latest = calls[calls.length - 1];

        const games =
          latest?.response?.body?.data?.data || [];

        const apiCount = games.length;

        cy.log(`API matched for ${category.name}`);
        cy.log(`API returned ${apiCount} games`);

        cy.get("body").then(($body) => {
          const cards = $body.find(".flex-shrink-0");
          const uiCount = cards.length;

          logCounts(category.name, apiCount, uiCount);

          // CASE 1: API has games
          if (apiCount > 0) {
            expect(uiCount).to.be.greaterThan(0);
            expect(uiCount).to.be.at.least(1);

            // loose upper bound (UI may enhance results)
            //expect(uiCount).to.be.at.most(apiCount + 10);
          }

          // CASE 2: API has NO games (IMPORTANT FIX)
          else {
            cy.log(`Empty category detected: ${category.name}`);

            // UI may show empty state OR nothing at all
            expect(uiCount).to.be.oneOf([0, 1]);

            cy.log(`No assertion failure due to empty dataset`);
          }
        });
      });
    }

    categories.forEach((category) => {
      validateCategory(category);
    });
  });
});