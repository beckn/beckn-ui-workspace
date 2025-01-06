import { testIds } from '../../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
  })

  it('should handle address conversion based on coordinates', () => {
    cy.getByData(testIds.location).should('be.visible')
  })
  it('should render the homepage components', () => {
    cy.getByData(testIds.homePage_Image).should('be.visible')
    cy.getByData('search-bar-main-container').should('be.visible')
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.searchButton).should('be.visible')
    cy.getByData(testIds.Frequently_Accessed).should('be.visible')
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.searchInput).type('sylhet')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}`)
  })
  it('should Show Frequently Accessed card', () => {
    cy.getByData(testIds.searchInput).type('sylhet')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.performSearch('floodprediction', {
      fixture: 'Climate-resilience/HARMONIAIDS/searchPage/searchResults.json'
    })
    cy.url().should('include', `${testIds.url_search}`)
    cy.getByData(testIds.searchpage_products).first().click()
    cy.url().should('include', `${testIds.url_product}`)
    cy.getByData('home-icon').click()
    cy.url().should('include', `${testIds.url_home}`)
    cy.getByData(testIds.Frequently_Accessed_Card).should('be.visible')
    cy.getByData(testIds.Frequently_Accessed_image).should('be.visible')
    cy.getByData(testIds.Frequently_Accessed_item_name).should('be.visible')
    cy.getByData(testIds.Frequently_Accessed_provider_name).should('be.visible').scrollIntoView()
    cy.getByData(testIds.Frequently_Accessed_productInfo).should('be.visible')
    cy.getByData('item-price').should('be.visible')
  })
  it('should redirect to product page when click on Frequently Accessed Card ', () => {
    cy.getByData(testIds.Frequently_Accessed_Card).click()
    cy.url().should('include', `${testIds.url_product}`)
  })
})
