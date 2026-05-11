/// <reference types="cypress" />

describe('Support Page - UI Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
})

beforeEach(() => {
    cy.visit('https://betterwin.com/support')
    cy.login()
  })


  it('Validate Support page content safely', () => {

    // -------------------------
    // Page load safety
    // -------------------------
    cy.get('body', { timeout: 20000 })
      .should('be.visible')


    // -------------------------
    // Email Support section
    // -------------------------
    cy.contains('Email Support', { timeout: 20000 })
      .should('be.visible')

    cy.contains('15 minutes', { timeout: 20000 })
      .should('be.visible')


    // -------------------------
    // Support email validation
    // -------------------------
    cy.contains('support@betterwin.com', { timeout: 20000 })
      .should('be.visible')


    // -------------------------
    // Optional structure check (safe)
    // -------------------------
    cy.get('body').then(($body) => {

      const hasEmailText = $body.text().includes('support@betterwin.com')
      const hasSupportText = $body.text().includes('Email Support')

      cy.log(`Support email found: ${hasEmailText}`)
      cy.log(`Email support section found: ${hasSupportText}`)

      expect(hasEmailText).to.eq(true)
      expect(hasSupportText).to.eq(true)
    })

  })

})