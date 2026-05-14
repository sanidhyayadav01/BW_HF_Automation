/// <reference types="cypress" />

describe('FAQ Page - UI Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  beforeEach(() => {

    cy.intercept('POST', '**/user/login*').as('loginAPI')

    cy.visit('https://www.betterwin.com/')

    cy.login()

    cy.wait('@loginAPI', { timeout: 30000 })

    cy.visit('https://www.betterwin.com/faq')
  })


  it('Validate FAQ page visibility and content', () => {

    // -----------------------------
    // Main container visibility
    // -----------------------------
    cy.get('.bg-blackBg3 > .max-w-\\[104\\.375rem\\]', { timeout: 20000 })
      .should('be.visible')


    // -----------------------------
    // FAQ title check
    // -----------------------------
    cy.get('.text-2xl', { timeout: 20000 })
      .should('be.visible')
      .and(($el) => {
        const text = $el.text()
        expect(text.toLowerCase()).to.include('faq')
      })


    // -----------------------------
    // Safe body fallback validation
    // -----------------------------
    cy.get('body').then(($body) => {

      const hasFAQ = $body.text().includes('FAQ')

      cy.log(`FAQ text present: ${hasFAQ}`)

      expect(hasFAQ).to.eq(true)
    })

  })

})