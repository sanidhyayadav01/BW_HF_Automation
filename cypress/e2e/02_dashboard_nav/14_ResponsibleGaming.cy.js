/// <reference types="cypress" />

describe('Responsible Gaming Page - UI Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  beforeEach(() => {

    cy.intercept('POST', '**/user/login*').as('loginAPI')

    cy.visit('https://www.betterwin.com/')

    cy.login()

    cy.wait('@loginAPI', { timeout: 30000 })

    cy.visit('https://www.betterwin.com/setting?active=responsibleGaming')
  })


  it('Validate Responsible Gaming cards visibility', () => {

    // -----------------------------
    // Page container check
    // -----------------------------
    cy.get('body', { timeout: 20000 })
      .should('be.visible')


    // -----------------------------
    // Card validations (safe contains)
    // -----------------------------
    cy.contains('Self-Exclusion Period', { timeout: 20000 })
      .should('be.visible')

    cy.contains('Deposit Limits', { timeout: 20000 })
      .should('be.visible')

    cy.contains('Betting Limits', { timeout: 20000 })
      .should('be.visible')


    // -----------------------------
    // Optional stability check
    // -----------------------------
    // cy.get('body').then(($body) => {

    //   const text = $body.text()

    //   expect(text).to.include('Self-Exclusion Period')
    //   expect(text).to.include('Deposit Limits')
    //   expect(text).to.include('Betting Limits')

    //   cy.log('✔ All Responsible Gaming cards are visible')
    // })

  })

})