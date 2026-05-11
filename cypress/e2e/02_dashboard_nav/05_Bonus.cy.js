/// <reference types="cypress" />

describe('Bonus Page Validation', () => {

  before(() => {

    cy.viewport(1440, 900)

    cy.intercept('POST', '**/api/v1/user/login**').as('loginApi')

    cy.visit('https://betterwin.com/')

    // login via custom command
    cy.login()

    // wait for login API + small buffer for UI state update
    cy.wait('@loginApi', { timeout: 20000 })
    cy.wait(3000)

  })

  beforeEach(() => {

    cy.visit('https://betterwin.com/')

    cy.wait(3000)

    /**
     * FIX:
     * selector returns multiple elements → we force single stable one
     */
    cy.get(':nth-child(5) > .flex > .font-medium')
      .should('have.length.greaterThan', 0)
      .first()
      .should('be.visible')
      .click({ force: true })

    // ensure navigation completes
    cy.url({ timeout: 15000 }).should('include', '/bonus')

    cy.wait(4000)

  })

  it('Validates Bonus Sections & Cards', () => {

    cy.get('.style_bonus_main_div__R4qah > :nth-child(2)', {
      timeout: 25000
    })
      .should('exist')

    cy.wait(2000)

    cy.get('.style_bonus_main_div__R4qah > :nth-child(2)')
      .children(':visible')
      .should('have.length.at.least', 3)

    cy.contains(/General Bonus/i, { timeout: 15000 })
      .should('be.visible')

    cy.contains(/My Bonus/i, { timeout: 15000 })
      .should('be.visible')

    cy.contains(/Cashback|Rakeback/i, { timeout: 15000 })
      .should('be.visible')

  })

})