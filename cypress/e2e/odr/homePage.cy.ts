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

  it('should open the selectInput dropdown when clicked', () => {
    cy.getByData(testIds.select_input).click()
    cy.getByData(testIds.dropdown_item).should('be.visible')
  })

  it('should render the app title & description', () => {
    cy.getByData(testIds.homepage_appTitle).should('contain.text', 'LegalEase')
    cy.getByData(testIds.homepage_appDescription).should(
      'contain.text',
      'LegalEase allows anyone to discover lawyers, online dispute resolution (ODR) service providers, paralegals and other legal services and information in a quick and seamless manner'
    )
  })
  it('should select an item from the dropdown', () => {
    const itemToSelect = 'Financial Disputes'

    cy.getByData(testIds.select_input).click()
    cy.getByData(testIds.dropdown_item_list).eq(1).click()
    cy.getByData(testIds.select_input).should('contain.text', itemToSelect)
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.select_input).click()
    cy.getByData(testIds.dropdown_item_list).eq(1).click()
    cy.getByData(testIds.searchInput).type('mediation')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=mediation&selectedItem=financial-dispute`)
  })

  it('should handle address conversion based on coordinates', () => {
    cy.getByData(testIds.location).should('contain.text', 'Test Address, Test City, Test Country')
  })
})
