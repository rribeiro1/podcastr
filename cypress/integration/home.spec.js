describe('Home Page', () => {
  beforeEach(() => {
    // Intercept API calls and return our fixture data
    cy.intercept('GET', '**/episodes', { fixture: 'episodes.json' }).as('getEpisodes')
    cy.visit('http://localhost:3000')
    cy.wait('@getEpisodes')
  })

  it('should display the header correctly', () => {
    cy.get('[class*="headerContainer"]')
      .should('be.visible')
      .within(() => {
        cy.get('img[alt="Podcastr"]').should('be.visible')
        cy.contains('The best content for you, always').should('be.visible')
      })
  })

  it('should display latest episodes section', () => {
    cy.get('[class*="latestEpisodes"]')
      .should('be.visible')
      .within(() => {
        cy.contains('h2', 'Latest Episodes').should('be.visible')
        cy.get('li').should('have.length.at.least', 1)
      })
  })

  it('should display all episodes section', () => {
    cy.get('[class*="allEpisodes"]')
      .should('be.visible')
      .within(() => {
        cy.contains('h2', 'All Episodes').should('be.visible')
        cy.get('table').should('be.visible')
        cy.get('tbody tr').should('have.length.at.least', 1)
      })
  })

  it('should play episode when clicking play button', () => {
    cy.get('[class*="latestEpisodes"] li:first-child button').click()
    cy.get('[class*="playerContainer"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Playing right now').should('be.visible')
        cy.get('audio').should('exist')
      })
  })
}) 