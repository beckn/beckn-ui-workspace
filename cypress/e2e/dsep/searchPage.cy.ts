import { testIds } from '../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  context('When there are no search results', () => {
    const searchTerm = 'java'

    beforeEach(() => {
      cy.visit(testIds.url_base)
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/emptySearchResults.json'
      })
    })

    it('should render the search page components', () => {
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
    })

    it('should render the search page components', () => {
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
    })
    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })

    it('should render the filter section with sort option', () => {
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
      cy.getByData('all').should('be.visible')
      cy.getByData('cheapest').should('be.visible')
      cy.getByData('expensive').should('be.visible')
    })

    it('should render the sort option with default values', () => {
      cy.getByData('all').should('contain.text', 'All')
      cy.getByData('expensive').should('contain.text', 'Expensive')
      cy.getByData('cheapest').should('contain.text', 'Cheapest')
    })
    it('should navigate to cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.url().should('include', testIds.url_cart)
    })
  })

  context('When there are search results', () => {
    const searchTerm = 'java'

    beforeEach(() => {
      cy.visit(testIds.url_base)
      cy.performSearch(searchTerm, {
        fixture: 'DSEP/searchPage/searchResults.json'
      })
    })

    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${searchTerm}`)
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })

    it('should handle sort by All Option', () => {
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'java springboot book One')
    })

    it('should handle sort by Cheapest Option', () => {
      cy.getByData('cheapest').eq(0).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'java springboot book Three')
    })

    it('should handle sort by Expensive Option', () => {
      cy.getByData('expensive').eq(0).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'java springboot book One')
    })

    it('should navigate to cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.url().should('include', testIds.url_cart)
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
    })
  })
})
