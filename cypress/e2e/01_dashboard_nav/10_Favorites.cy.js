/// <reference types="cypress" />

describe('Favorites - API vs UI Validation', () => {

  before(() => {
    cy.viewport(1440, 900)
  })

  beforeEach(() => {

    cy.intercept('GET', '**/casino/get-favourite-game**')
      .as('favoritesAPI')

    cy.visit('https://www.betterwin.com/')

    cy.login()

    cy.wait(3000)
  })

  it('Validates Favorites page correctly (API + UI)', () => {

    cy.visit('https://www.betterwin.com/favorites')

    cy.wait(4000)

    // =========================================
    // CHECK IF API WAS FIRED
    // =========================================
    cy.get('@favoritesAPI.all').then((calls) => {

      // =====================================
      // CASE 1 → API NEVER FIRED
      // =====================================
      if (!calls || calls.length === 0) {

        cy.log('No favorites API triggered')

        cy.contains(/no favorites|no favourite|empty/i, {
          timeout: 15000
        })
          .should('exist')
          .and('be.visible')

        cy.log('✔ Empty favorites state validated')

        return
      }

      // =====================================
      // CASE 2 → API FIRED
      // =====================================
      const interception = calls[calls.length - 1]

      const favGames =
        interception.response?.body?.data?.favouriteGames || []

      const apiCount = favGames.length

      cy.log(`API Favorites Count: ${apiCount}`)

      // =====================================
      // UI VALIDATION
      // =====================================
      cy.get('body').then(($body) => {

        const cards = $body.find(
          '[class*="card"], [class*="game"], [class*="favourite"]'
        )

        const uiCount = cards.length

        cy.log(`UI Favorites Count: ${uiCount}`)

        // =================================
        // EMPTY FAVORITES
        // =================================
        if (apiCount === 0) {

          cy.contains(/no favorites|no favourite|empty/i)
            .should('exist')

          cy.log('✔ Empty favorites UI validated')
        }

        // =================================
        // FAVORITES EXIST
        // =================================
        else {

          expect(uiCount).to.be.greaterThan(0)

          cy.log('✔ Favorites displayed correctly')
        }

      })

    })

  })

})