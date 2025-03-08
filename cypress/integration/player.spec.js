describe('Player', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/episodes', { fixture: 'episodes.json' }).as('getEpisodes')
    cy.visit('http://localhost:3000')
    cy.wait('@getEpisodes')
    // Start playing first episode
    cy.get('[class*="latestEpisodes"] li:first-child button').click()
  })

  it('should display correct episode information', () => {
    cy.get('[class*="playerContainer"]')
      .should('be.visible')
      .within(() => {
        cy.get('[class*="currentEpisode"]').within(() => {
          cy.contains('Test Podcast Episode 1').should('be.visible')
          cy.contains('John Doe').should('be.visible')
          cy.get('img').should('be.visible')
        })
      })
  })

  it('should have working playback controls', () => {
    cy.get('[class*="playerContainer"]').within(() => {
      // Play/Pause button
      cy.get('[class*="playButton"]')
        .should('be.visible')
        .click()
        .find('img[alt="Play"]')
        .should('be.visible')
      
      // Shuffle button
      cy.get('button img[alt="Shuffle"]')
        .should('be.visible')
        .parent()
        .click()
        .should('have.class', 'isActive')

      // Repeat button
      cy.get('button img[alt="Repeat"]')
        .should('be.visible')
        .parent()
        .click()
        .should('have.class', 'isActive')
    })
  })

  it('should show progress bar', () => {
    cy.get('[class*="playerContainer"]')
      .find('[class*="progress"]')
      .should('be.visible')
      .within(() => {
        cy.get('[class*="slider"]').should('be.visible')
        // Check for time display
        cy.get('span').should('have.length', 2)
      })
  })

  it('should navigate between episodes', () => {
    cy.get('[class*="playerContainer"]').within(() => {
      // Click next episode
      cy.get('button img[alt="Next"]')
        .parent()
        .click()

      // Verify episode changed
      cy.get('[class*="currentEpisode"]')
        .contains('Test Podcast Episode 2')
        .should('be.visible')

      // Click previous episode
      cy.get('button img[alt="Previous"]')
        .parent()
        .click()

      // Verify back to first episode
      cy.get('[class*="currentEpisode"]')
        .contains('Test Podcast Episode 1')
        .should('be.visible')
    })
  })
}) 