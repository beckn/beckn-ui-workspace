import { testIds } from '../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  context('When there are no search results', () => {
    const searchTerm = 'assembly'

    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'INDUSTRY4.0/searchPage/emptySearchResults.json'
      })
    })
    it('should render the search page components', () => {
      cy.getByData(testIds.searchPage_container).should('be.visible')
      cy.getByData(testIds.searchPage_input).should('be.visible')
    })
    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })
  })

  context('When there are search results', () => {
    const searchTerm = 'assembly'

    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'INDUSTRY4.0/searchPage/searchResults.json'
      })
    })

    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${searchTerm}`)
      cy.getByData(testIds.search_page_product_image).should('be.visible')
      cy.getByData(testIds.search_page_product_name).should('be.visible')
      cy.getByData(testIds.search_page_product_providerName).should('be.visible')
      cy.getByData(testIds.search_page_product_short_desc).should('be.visible')
      cy.getByData(testIds.search_page_product_rating).should('be.visible')
      cy.getByData(testIds.search_page_product_OnClick).should('be.visible')
    })

    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.search_page_product_OnClick).first().click()
      cy.url().should('include', testIds.url_product)
    })
  })
})
