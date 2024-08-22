import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
  })

  it('should render the homepage components', () => {
    cy.getByData(testIds.homepage_appTitle).should('be.visible')
    cy.getByData(testIds.homepage_appDescription).should('be.visible')
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.homepage_footer).should('be.visible')
  })

  it('should render the app title & description', () => {
    cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Localee Open')
    cy.getByData(testIds.homepage_appDescription).should(
      'contain.text',
      "A global marketplace to discover and buy anything you need. Just type what you want to buy and we'll take care of the rest."
    )
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.searchInput).type('cake')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=cake`)
  })
  it('should perform navigate on click serach store by location', () => {
    cy.getByData(testIds.search_By_Location_Text).click()
    cy.url().should('include', `${testIds.url_search_StoreBy_Location}`)
  })
})
