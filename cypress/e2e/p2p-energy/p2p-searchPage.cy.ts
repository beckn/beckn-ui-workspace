import { testIds } from '../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  //   before(() => {
  //     cy.visit(testIds.url_base)
  //   })

  context('When there are no search results', () => {
    beforeEach(() => {
      cy.visit(testIds.url_base)
      cy.getByData(testIds.clickable_card_open_spark).click()
      cy.getByData(testIds.P2P_hompage_button).click()
      cy.intercept('POST', '**/search', {
        fixture: 'P2P/emptySearchResults.json'
      }).as('emptySearchResults')
      cy.url().should('include', `${testIds.url_search}?searchTerm`)
    })

    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no items available in this category at the moment. Please check back soon for updates!'
      )
    })
  })

  context('When there are search results', () => {
    beforeEach(() => {
      cy.visit(testIds.url_base)
      cy.getByData(testIds.clickable_card_open_spark).click()
      cy.getByData(testIds.P2P_hompage_button).click()
      cy.intercept('POST', '**/search', {
        fixture: 'P2P/searchResponse.json'
      }).as('searchResponse')
      cy.wait(1000)
      cy.url().should('include', `${testIds.url_search}?searchTerm`)
    })

    it('should perform search and display results', () => {
      cy.url().should('include', `${testIds.url_search}?searchTerm`)
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })

    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
    })
  })
})
