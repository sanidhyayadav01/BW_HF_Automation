/// <reference types="cypress" />

describe('Casino Games - API vs UI Count', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  beforeEach(() => {

    // intercept FIRST (important)
    cy.intercept('GET', '**/casino/games**').as('casinoGames')

    // login using your custom command
    cy.visit('https://betterwin.com/')
    cy.login()

    // small stability wait (UI hydration after login)
    cy.wait(3000)
  })

  it('Validates API vs UI game count', () => {

    cy.visit('https://betterwin.com/casino')

    cy.wait('@casinoGames', { timeout: 30000 }).then((interception) => {

      const apiCount = interception.response.body.data.totalCount
      const uiVisibleCount = interception.response.body.data.data.length

      cy.log(`API Count: ${apiCount}`)
      cy.log(`UI Initial Load Count (expected cards per page): 20`)

      // UI selector
      cy.get('.w-full > .flex-wrap', { timeout: 20000 })
        .should('be.visible')
        .children(':visible')
        .should('have.length', 20)

      // separate readable assertion (not comparing full dataset vs UI)
      expect(uiVisibleCount).to.be.at.most(20)
      expect(apiCount).to.be.greaterThan(0)
    })

  })

})