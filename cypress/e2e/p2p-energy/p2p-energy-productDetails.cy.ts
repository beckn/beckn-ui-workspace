import { testIds } from '../../../shared/dataTestIds'

describe('p2p energy product details Page Tests', () => {
  before(() => {
    cy.visit(testIds.url_base)
    cy.getByData(testIds.clickable_card_open_spark).click()
    cy.getByData(testIds.P2P_hompage_button).click()
    cy.intercept('POST', '**/search', {
      fixture: 'P2P/searchResponse.json'
    }).as('searchResponse')
    cy.wait(1000)
    cy.url().should('include', `${testIds.url_search}?searchTerm`)
    cy.getByData(testIds.searchpage_products).first().click()
  })

  it('should render details of selected product', () => {
    cy.getByData(testIds.item_title).should('contain.text', 'energy')
    cy.getByData(testIds.item_rating).eq(4)
    cy.getByData(testIds.item_description).should('contain.text', 'Big Leela Energy Company')
    cy.getByData(testIds.P2P_productpage_price_text).should('be.visible')
    cy.getByData(testIds.item_price).should('contain.text', '₹7.00 per unit')
    cy.getByData(testIds.P2P_productpage_energyUnit_text).should('be.visible')
    cy.getByData(testIds.P2P_productpage_input).should('be.visible')
  })
  it('should edit the input value', () => {
    cy.getByData(testIds.P2P_productpage_input).should('have.value', '1')
    cy.getByData(testIds.P2P_productpage_input).clear({ force: true }).type('02').should('have.value', '2')
    cy.getByData(testIds.P2P_productpage_input).clear().type('01').should('have.value', '1')
  })
  it('should navigate to cart on order button click', () => {
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_cart)
  })
})
