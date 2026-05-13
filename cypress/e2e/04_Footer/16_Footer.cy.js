/// <reference types="cypress" />

describe("Footer Links Validation", () => {
  beforeEach(() => {
    cy.viewport(1440, 900);

    cy.intercept("POST", "**/api/v1/user/login**").as("loginApi");

    cy.visit("https://www.betterwin.com/");

    cy.login();

    cy.wait("@loginApi", { timeout: 30000 });

    cy.wait(3000);

    cy.scrollTo("bottom");
  });

  // =========================================
  // Helper Function
  // =========================================
  const validateFooterLink = (text, expectedUrl) => {
    cy.get("footer")
      .contains(text, { timeout: 20000 })
      .filter(":visible")
      .first()
      .scrollIntoView()
      .should("be.visible")
      .then(($el) => {
        const href = $el.prop("href");

        // =========================
        // HANDLE REAL LINKS
        // =========================
        if (href && href !== "#") {
          cy.visit(href, {
            failOnStatusCode: false,
          });
        }

        // =========================
        // FALLBACK CLICK
        // =========================
        else {
          cy.wrap($el).click({ force: true });
        }
      });

    cy.wait(3000);

    cy.url().should("include", expectedUrl);

    cy.log(`✔ ${text} → ${expectedUrl}`);

    cy.go("back");

    cy.wait(3000);

    cy.scrollTo("bottom");
  };

  // =========================================
  // CASINO
  // =========================================
  it("Validate Casino Footer Links", () => {
    validateFooterLink("Casino Games", "/casino");

    validateFooterLink("Live Casino", "/live-casino");

    validateFooterLink("Crash Games", "/crash-games");

    validateFooterLink("Table Games", "/table-games");

    validateFooterLink("Providers", "/provider");
  });

  // =========================================
  // SUPPORT
  // =========================================
  it("Validates Support Footer Links", () => {
    //validateFooterLink("Support", "/support");

    validateFooterLink("Contact Us", "/support");

    validateFooterLink("Email Us", "/support");

    validateFooterLink(
      "Responsible Gaming",
      "responsible-gambling-and-self-exclusion-policy",
    );

    validateFooterLink("FAQ", "/faq");
  });

  // =========================================
  // ABOUT
  // =========================================
  it("Validates About Footer Links", () => {
    validateFooterLink("Privacy Policy", "/privacy-policy");

    validateFooterLink("Terms and Conditions", "/terms-and-conditions");

    validateFooterLink(
      "Responsible Gambling and Self-Exclusion Policy",
      "/responsible-gambling-and-self-exclusion-policy",
    );

    validateFooterLink("AML KYC Policy", "/aml-kyc-policy");

    validateFooterLink("About Us", "/about-us");
  });

  // =========================================
  // PROMOS
  // =========================================
  it("Validates Promos Footer Links", () => {
    validateFooterLink("VIP Club", "/vip");

    validateFooterLink("Promotions", "/promotion");

    validateFooterLink("Bonus", "/bonus");

    validateFooterLink("Refer a Friend", "/refer-friend");

    validateFooterLink("Affiliate", "/refer-friend");
  });

  // =========================================
  // COMMUNITY
  // =========================================
  it("Validates Community Footer Links Presence", () => {
    cy.contains("Telegram").scrollIntoView().should("exist").and("be.visible");

    cy.contains("Instagram").scrollIntoView().should("exist").and("be.visible");

    cy.contains("Facebook").scrollIntoView().should("exist").and("be.visible");

    cy.log("✔ Community footer links are visible");
  });
});
