import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base_tourism, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base_tourism}${testIds.url_home}`)
  })

  it('should render the homepage components', () => {
    cy.getByData(testIds.homepage_appTitle).should('be.visible')
    cy.getByData(testIds.homepage_appDescription).should('be.visible')
    cy.getByData(testIds.searchInput_container).should('be.visible')
    cy.getByData(testIds.homepage_footer).should('be.visible')
  })

  it('should render the app title & description', () => {
    cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Travel Experience')
    cy.getByData(testIds.homepage_appDescription).should(
      'contain.text',
      "A global marketplace to discover anything you need. Just type where you want to go and we'll take care of the rest."
    )
    cy.getByData(testIds.homepage_searchInput).should('have.attr', 'placeholder', 'Search For Travel Location')
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.homepage_searchInput).click()
    cy.getByData(testIds.loaction_list).type('Manali')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
    cy.getByData(testIds.homepage_searchInput).should('have.value', 'Manali, Himachal Pradesh, India')
    cy.getByData(testIds.homepage_search_button).click()
    // cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=Manali`)
  })
})
