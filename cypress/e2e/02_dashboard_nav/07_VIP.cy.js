/// <reference types="cypress" />

describe('VIP Program - Tier Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  let apiTiers = []
  let uiTiersCount = 0

  beforeEach(() => {

    cy.intercept('GET', '**/gamification.betterwin.com/api/v1/user/vip/info/**')
      .as('vipInfo')

    cy.visit('https://betterwin.com/')

    cy.login()

    cy.wait(3000)
  })

  it('Validate VIP tiers one by one', () => {

    cy.contains('VIP Program', { timeout: 20000 })
      .should('be.visible')
      .click()

    cy.wait('@vipInfo', { timeout: 30000 })
      .then((interception) => {

        apiTiers = interception.response.body.data.data.allTiers

        cy.log(`API tiers received: ${apiTiers.length}`)

        // UI container
        cy.get('.max-w-\\[104\\.375rem\\] .grid', { timeout: 20000 })
          .should('exist')

        cy.get('.max-w-\\[104\\.375rem\\] .grid .bg-bggray1', { timeout: 20000 })
          .should('exist')
          .then(($uiTiers) => {

            uiTiersCount = $uiTiers.length

            cy.log(`UI tiers found: ${uiTiersCount}`)

            // -------------------------------
            // STEP-BY-STEP VALIDATION
            // -------------------------------

            apiTiers.forEach((tier, index) => {

              cy.log(`Validating Tier ${index + 1}: ${tier.name}`)

              cy.contains(tier.name, { timeout: 20000 })
                .should('be.visible')
            })

            // FINAL ASSERTIONS
            expect(uiTiersCount).to.eq(4)
            expect(apiTiers.length).to.eq(4)

            cy.log('VIP Tier Validation Completed Successfully')
          })
      })
  })

})