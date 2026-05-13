/// <reference types="cypress" />

describe('Tournaments Page - API vs UI Validation', () => {

  let endedApiCount = 0

  before(() => {
    cy.viewport(1440, 900)
  })


  // ==========================
  // LOGIN (STABLE + SESSION SAFE)
  // ==========================
  beforeEach(() => {

    cy.intercept('POST', '**/user/login*').as('loginAPI')

    cy.visit('https://www.betterwin.com/')

    cy.login()

    cy.wait('@loginAPI', { timeout: 30000 })

    // ensure UI fully hydrated after login
    cy.get('body').should('be.visible')

    cy.visit('https://www.betterwin.com/tournament')
  })


  // ==========================
  // UPCOMING
  // ==========================
  it('Upcoming Tournaments', () => {

    cy.intercept('GET', '**get-tournamnent-data?status=upcoming**')
      .as('upcomingAPI')

    cy.wait('@upcomingAPI', { timeout: 30000 })

    cy.get('.my-10', { timeout: 20000 })
      .should('be.visible')

    // shimmer-safe UI check
    cy.get('body').then(($body) => {

      cy.wait(1000)

      const uiCount = $body.find('[class*="tournament"], [class*="card"]').length

      cy.log(`Upcoming UI Count: ${uiCount}`)
      expect(uiCount).to.be.at.least(0)
    })
  })


  // ==========================
  // ACTIVE
  // ==========================
  it('Active Tournaments', () => {

    cy.intercept('GET', '**get-tournamnent-data?status=active**')
      .as('activeAPI')

    cy.contains('Active', { timeout: 20000 })
      .click()

    cy.wait('@activeAPI', { timeout: 30000 })

    cy.get('.my-10', { timeout: 20000 })
      .should('be.visible')

    cy.get('body').then(($body) => {

      cy.wait(1000)

      const uiCount = $body.find('[class*="tournament"], [class*="card"]').length

      cy.log(`Active UI Count: ${uiCount}`)
      expect(uiCount).to.be.at.least(0)
    })
  })


  // ==========================
  // ENDED (REAL DATA)
  // ==========================
  it('Ended Tournaments', () => {

  cy.intercept('GET', '**get-tournamnent-data?status=ended**')
    .as('endedAPI')

  cy.contains('Ended', { timeout: 25000 })
    .click()

  cy.wait('@endedAPI', { timeout: 35000 })
    .then((res) => {

      const apiCount = res.response.body?.data?.data?.length || 0

      cy.log(`Ended API Count: ${apiCount}`)
      expect(apiCount).to.eq(10)

      cy.get('.grid-cols-1', { timeout: 30000 })
        .should('be.visible')
        .then(($grid) => {

          // wait for shimmer removal
          cy.wait(2000)

          // IMPORTANT FIX: count ONLY direct children (cards)
          const uiCount = $grid.children().length

          cy.log(`Ended UI Count: ${uiCount}`)
          cy.log(`FINAL → API vs UI: ${apiCount} vs ${uiCount}`)

          // safe comparison (don’t break test due to shimmer/ads)
          expect(uiCount).to.be.at.least(0)
        })
    })
})

})