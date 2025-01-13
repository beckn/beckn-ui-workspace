import { testIds } from '../../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  context('When there are no search results', () => {
    const searchTerm = 'data'

    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'forest-conservation/ENVIROGROWTH/searchPage/emptySearchResults.json'
      })
    })

    it('should render the search page components', () => {
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.searchButton).should('be.visible')
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
    })

    it('should render the filter section with sort & reset options', () => {
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
      cy.getByData(testIds.searchpage_resetBtn).should('be.visible')
      cy.getByData(testIds.searchpage_sortByPrice).should('be.visible')
      cy.getByData(testIds.searchpage_filterByRating).should('be.visible')
      cy.getByData(testIds.searchpage_applyFilter).should('be.visible')
    })

    it('should render the filter section with default values', () => {
      cy.getByData(testIds.searchpage_sortByPrice).should('contain.text', 'Price')
      cy.getByData(testIds.searchpage_filterByRating).should('contain.text', 'Rating')
    })

    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })

    it('should navigate to cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.url().should('include', testIds.url_cart)
    })
  })

  context('When there are search results', () => {
    const searchTerm = 'data'

    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'forest-conservation/ENVIROGROWTH/searchPage/searchResults.json'
      })
    })

    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${searchTerm}`)
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })

    it('should handle sort by price option in filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).click()
      cy.getByData(`${testIds.searchpage_sortByPrice}-menu-list`).should('be.visible')
      cy.getByData(`${testIds.searchpage_sortByPrice}-menu-list`).within(() => {
        cy.getByData('menu-item-2').click()
      })
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products)
        .eq(0)
        .should('contain.text', 'Digital soil data map of IndiaProvided by')
    })

    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_filterByRating).click()
      cy.getByData(`${testIds.searchpage_filterByRating}-menu-list`).should('be.visible')
      cy.getByData(`${testIds.searchpage_filterByRating}-menu-list`).within(() => {
        cy.getByData('menu-item-1').click()
      })
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Archive of climate and weather data')
    })

    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Archive of climate and weather data')
    })

    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
    })
  })
})
