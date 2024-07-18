import { Urls, UserCredentials, GeneralTestIds, SearchPageTestIds } from '../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  before(() => {
    cy.login(Urls.baseUrl, UserCredentials.validEmail, UserCredentials.validPassword)
  })

  context('When there are no search results', () => {
    const searchTerm = 'sunglass'

    beforeEach(() => {
      cy.visit(Urls.homePageUrl)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/emptySearchResults.json'
      })
    })

    it('should render the search page components', () => {
      cy.getByData(SearchPageTestIds.searchInput).should('be.visible')
      cy.getByData(SearchPageTestIds.searchButton).should('be.visible')
      cy.getByData(SearchPageTestIds.filterContainer).should('be.visible')
    })

    it('should render the filter section with sort & reset options', () => {
      cy.getByData(SearchPageTestIds.filterContainer).should('be.visible')
      cy.getByData(SearchPageTestIds.resetBtn).should('be.visible')
      cy.getByData(SearchPageTestIds.sortByPrice).should('be.visible')
      cy.getByData(SearchPageTestIds.filterByRating).should('be.visible')
      cy.getByData(SearchPageTestIds.applyFilter).should('be.visible')
    })

    it('should render the filter section with default values', () => {
      cy.getByData(SearchPageTestIds.sortByPrice).should('contain.text', 'Price')
      cy.getByData(SearchPageTestIds.filterByRating).should('contain.text', 'Rating')
    })

    it('should render the message if no product to display', () => {
      cy.getByData(GeneralTestIds.noDataAvailable).should('be.visible')
      cy.getByData(GeneralTestIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })

    it('should navigate to cart on cart icon click', () => {
      cy.getByData(GeneralTestIds.cartButton).click()
      cy.url().should('include', Urls.cartPageUrl)
    })
  })

  context('When there are search results', () => {
    const searchTerm = 'sunglass'

    beforeEach(() => {
      cy.visit(Urls.homePageUrl)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/searchResults.json'
      })
    })

    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${searchTerm}`)
      cy.getByData(SearchPageTestIds.products).should('have.length.greaterThan', 0)
    })

    it('should handle sort by price option in filter', () => {
      cy.getByData(SearchPageTestIds.sortByPrice).select(2)
      cy.getByData(SearchPageTestIds.applyFilter).click()
      cy.getByData(SearchPageTestIds.products).eq(0).should('contain.text', 'sunglass Four')
    })

    it('should handle filter by rating option in filter', () => {
      cy.getByData(SearchPageTestIds.filterByRating).select(1)
      cy.getByData(SearchPageTestIds.applyFilter).click()
      cy.getByData(SearchPageTestIds.products).eq(0).should('contain.text', 'sunglass Two')
    })

    it('should handle reset applied filter', () => {
      cy.getByData(SearchPageTestIds.sortByPrice).select(2)
      cy.getByData(SearchPageTestIds.filterByRating).select(2)
      cy.getByData(SearchPageTestIds.applyFilter).click()
      cy.getByData(SearchPageTestIds.products).eq(0).should('contain.text', 'sunglass Four')
      cy.getByData(SearchPageTestIds.resetBtn).click()
      cy.getByData(SearchPageTestIds.products).eq(0).should('contain.text', 'sunglass One')
    })

    it('should navigate to product details on item click', () => {
      cy.getByData(SearchPageTestIds.products).first().click()
      cy.url().should('include', Urls.productPageUrl)
    })
  })
})
