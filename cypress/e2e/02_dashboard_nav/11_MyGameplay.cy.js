/// <reference types="cypress" />

describe('My Gameplay - Settings Navigation Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  beforeEach(() => {

    cy.intercept('POST', '**/user/login*').as('loginAPI')

    cy.visit('https://www.betterwin.com/')

    cy.login()

    cy.wait('@loginAPI', { timeout: 30000 })

    cy.visit('https://www.betterwin.com/setting?active=transactionDetail')
  })


  // -----------------------------
  // SAFE NAVIGATION HELPER
  // -----------------------------
  const navigateAndAssert = (label, urlPart) => {

    cy.contains(label, { timeout: 20000 })
      .should('be.visible')
      .scrollIntoView()
      .click({ force: true })

    cy.url({ timeout: 20000 })
      .should('include', urlPart)

    cy.log(`✔ ${label} → ${urlPart}`)
  }


  // -----------------------------
  // TEST CASE
  // -----------------------------
  it('Validate all My Gameplay sections navigation', () => {

    // Default page check
    cy.url().should('include', 'transactionDetail')
    cy.log('✔ Default → transactionDetail')


    // Personal Profile
    navigateAndAssert('Personal Profile', 'general')


    // Account Verification
    navigateAndAssert('Account Verification', 'accountVerification')


    // Responsible Gaming
    navigateAndAssert('Responsible Gaming', 'responsibleGaming')


    // Security
    navigateAndAssert('Security', 'security')


    // Transaction History
    navigateAndAssert('Transaction', 'transactionDetail')


    // Withdrawal History
    navigateAndAssert('Withdrawal', 'withdrawlHistory')


    // Deposit History
    navigateAndAssert('Deposit', 'deposit')


    // Bonuses & Spins
    navigateAndAssert('Bonuses', 'bonus')

  })

})