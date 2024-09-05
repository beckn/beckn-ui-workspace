import { testIds } from '../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base_tourism, testIds.user_validEmail, testIds.user_validPassword)
  })

  context('When there are no search results', () => {
    const searchTerm = 'Manali'

    beforeEach(() => {
      cy.visit(`${testIds.url_base_tourism}${testIds.url_home}`)
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type(searchTerm)
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_search_button).click()
      cy.performSearch(searchTerm, {
        fixture: 'TOURISM/searchPage/emptySearchResults.json'
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
  })

  context('When there are search results', () => {
    const searchTerm = 'Manali'

    beforeEach(() => {
      cy.visit(`${testIds.url_base_tourism}${testIds.url_home}`)
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type(searchTerm)
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_search_button).click()
      cy.performSearch(searchTerm, {
        fixture: 'TOURISM/searchPage/searchResults.json'
      })
    })

    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${searchTerm}`)
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })

    it('should handle sort by price option in filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Hampta Pass Trek - Manali Four')
    })

    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_filterByRating).select(1)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Hampta Pass Trek - Manali Two')
    })

    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_filterByRating).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Hampta Pass Trek - Manali Four')
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Hampta Pass Trek - Manali One')
    })

    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
    })
  })
})
