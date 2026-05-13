/// <reference types="cypress" />

describe('Promotions Page Validation', () => {

  before(() => {

    cy.viewport(1440, 900)

    cy.session('betterwin-session', () => {

      cy.intercept('POST', '**/api/v1/user/login**')
        .as('loginApi')

      cy.visit('https://www.betterwin.com/')

      cy.login()

      cy.wait('@loginApi', { timeout: 20000 })

      // allow auth/session/localStorage/cookies to settle
      cy.wait(2000)

      cy.log('Login session saved successfully')

    })

  })

  beforeEach(() => {

    cy.intercept(
      'GET',
      '**/api/v1/system/promotions?*'
    ).as('getPromotions')

    cy.visit('https://betterwin.com/promotion')

    cy.wait('@getPromotions', { timeout: 20000 })

    // wait for shimmer/loading placeholders to finish rendering
    cy.wait(2000)

  })

  it('Validates Promotions Cards Count', () => {

    cy.get('.space-y-8 > .grid', { timeout: 20000 })
      .should('exist')
      .children()
      .should('have.length.at.least', 5)
      .then(($cards) => {

        const uiCount = $cards.length

        cy.log(`UI Promotions Count: ${uiCount}`)

        expect(uiCount).to.be.greaterThan(0)

      })

  })

})