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
    cy.getByData(testIds.homepage_image).should('be.visible')
    cy.getByData(testIds.homepge_text).should('be.visible')
    cy.getByData(testIds.homepge_text).should(
      'contain.text',
      'To proceed with creating your workflow, please set your location and search for services.'
    )
    cy.getByData(testIds.search_bar_main_container).should('be.visible')
    cy.getByData(testIds.search_input).should('be.visible')
    cy.getByData(testIds.search_button).should('be.visible')
  })
  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.search_input).type('assembly')
    cy.getByData(testIds.search_button).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=assembly`)
  })
})
