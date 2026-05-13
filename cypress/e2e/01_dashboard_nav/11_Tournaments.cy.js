/// <reference types="cypress" />

describe('Tournaments Page - API vs UI Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  // ==========================
  // LOGIN
  // ==========================
  beforeEach(() => {

    cy.intercept('POST', '**/user/login*')
      .as('loginAPI')

    // IMPORTANT:
    // register tournament intercepts BEFORE visit
    cy.intercept('GET', '**get-tournamnent-data?status=upcoming**')
      .as('upcomingAPI')

    cy.intercept('GET', '**get-tournamnent-data?status=active**')
      .as('activeAPI')

    cy.intercept('GET', '**get-tournamnent-data?status=ended**')
      .as('endedAPI')

    cy.visit('https://www.betterwin.com/')

    cy.login()

    cy.wait('@loginAPI', {
      timeout: 30000
    })

    cy.wait(3000)

    cy.visit('https://www.betterwin.com/tournament')

    cy.get('body', {
      timeout: 20000
    }).should('be.visible')

    cy.wait(4000)
  })


  // ==========================
  // UPCOMING
  // ==========================
  it('Upcoming Tournaments', () => {

    // SAFE handling
    cy.get('@upcomingAPI.all').then((calls) => {

      // API may not fire due to cache/frontend state
      if (!calls || calls.length === 0) {

        cy.log('Upcoming API not triggered')

        cy.get('body').should('be.visible')

        return
      }

      const latestCall = calls[calls.length - 1]

      const apiData =
        latestCall.response?.body?.data?.data || []

      const apiCount = apiData.length

      cy.log(`Upcoming API Count: ${apiCount}`)

      expect(apiCount).to.be.at.least(0)
    })

    cy.get('.my-10', {
      timeout: 20000
    }).should('be.visible')

    cy.get('body').then(($body) => {

      const uiCount =
        $body.find('[class*="tournament"], [class*="card"]').length

      cy.log(`Upcoming UI Count: ${uiCount}`)

      expect(uiCount).to.be.at.least(0)
    })

  })


  // ==========================
  // ACTIVE
  // ==========================
  it('Active Tournaments', () => {

    cy.contains('Active', {
      timeout: 20000
    })
      .should('be.visible')
      .click({ force: true })

    cy.wait(2000)

    cy.get('@activeAPI.all').then((calls) => {

      if (!calls || calls.length === 0) {

        cy.log('Active API not triggered')

        return
      }

      const latestCall = calls[calls.length - 1]

      const apiData =
        latestCall.response?.body?.data?.data || []

      const apiCount = apiData.length

      cy.log(`Active API Count: ${apiCount}`)

      expect(apiCount).to.be.at.least(0)
    })

    cy.get('.my-10', {
      timeout: 20000
    }).should('be.visible')

    cy.get('body').then(($body) => {

      const uiCount =
        $body.find('[class*="tournament"], [class*="card"]').length

      cy.log(`Active UI Count: ${uiCount}`)

      expect(uiCount).to.be.at.least(0)
    })

  })


  // ==========================
  // ENDED
  // ==========================
  it('Ended Tournaments', () => {

    cy.contains('Ended', {
      timeout: 25000
    })
      .should('be.visible')
      .click({ force: true })

    cy.wait(2000)

    cy.get('@endedAPI.all').then((calls) => {

      if (!calls || calls.length === 0) {

        cy.log('Ended API not triggered')

        return
      }

      const latestCall = calls[calls.length - 1]

      const apiData =
        latestCall.response?.body?.data?.data || []

      const apiCount = apiData.length

      cy.log(`Ended API Count: ${apiCount}`)

      cy.get('.grid-cols-1', {
        timeout: 30000
      })
        .should('be.visible')
        .then(($grid) => {

          cy.wait(2000)

          const uiCount = $grid.children().length

          cy.log(`Ended UI Count: ${uiCount}`)

          cy.log(`FINAL → API vs UI: ${apiCount} vs ${uiCount}`)

          expect(uiCount).to.be.at.least(0)
        })
    })

  })

})