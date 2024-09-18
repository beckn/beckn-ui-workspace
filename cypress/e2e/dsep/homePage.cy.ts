import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })
  it('should render the homepage components', () => {
    cy.getByData(testIds.homepage_appTitle).should('be.visible')
    cy.getByData(testIds.homepage_appDescription).should('be.visible')
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.homepage_footer).should('be.visible')
  })

  it('should render the app title & description', () => {
    cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Skill Up')
    cy.getByData(testIds.homepage_appDescription).should(
      'contain.text',
      'Discover diverse online resources, scholarships, and job opportunities in one convenient platform, enhancing your expertise across multiple fields.'
    )
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.searchInput).type('java')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=java`)
  })
})
