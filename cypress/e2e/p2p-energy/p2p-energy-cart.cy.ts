import { testIds } from '../../../shared/dataTestIds'

describe('Open spark Cart Page Tests in p2p-energy', () => {
  beforeEach(() => {
    cy.visit(testIds.url_base)
    cy.getByData(testIds.clickable_card_open_spark).click()
    cy.wait(2000)
    cy.intercept('POST', '**/search', {
      fixture: 'P2P/searchResponse.json'
    }).as('searchResponse')
    cy.getByData(testIds.P2P_hompage_button).click()
    cy.wait(2000)
    cy.url().should('include', `${testIds.url_search}?searchTerm`)

    cy.getByData(testIds.searchpage_products).first().click()
    cy.url().should('include', testIds.url_product)
    cy.intercept('POST', '/select', { fixture: 'P2P/selectResult.json' }).as('selectCall')
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.wait('@selectCall')
  })
  afterEach(() => {
    cy.clearAllLocalStorage()
  })
  context('should render When there are Items in Cart', () => {
    it('should render and display cart page with result', () => {
      cy.getByData(testIds.cartpage_itemImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_itemName).should('be.visible')
      cy.getByData(testIds.cartpage_productPrice).should('be.visible')
      cy.getByData(testIds.cartpage_trashButton).should('be.visible')
      cy.getByData(testIds.cartpage_incrementButton).should('be.visible')
      cy.getByData(testIds.cartpage_input).should('have.value', '1')
      cy.url().should('include', testIds.url_cart)
    })
    it('should render and display cart page Order Summary ', () => {
      cy.getByData(testIds.cartpage_orderSummaryText).should('contain.text', 'Order Summary')
      cy.getByData(testIds.cartpage_totalQuantityText).should('contain.text', 'Total Quantity')
      cy.getByData(testIds.cartpage_totalAmountText).should('contain.text', 'Total Amount')
    })

    it('should render the cart page when counter is one and trash button is clicked', () => {
      cy.getByData(testIds.cartpage_trashButton).click()
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(testIds.cartpage_emptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Shop')
    })
    it('increments the counter and updates the total amount when the increment button is clicked', () => {
      cy.getByData(testIds.cartpage_incrementButton).click()
      cy.getByData(testIds.cartpage_input).should('have.value', '2')
    })
    it('decrement the counter and updates the total amount when the decrement button is clicked', () => {
      cy.getByData(testIds.cartpage_incrementButton).click()
      cy.getByData(testIds.cartpage_input).should('have.value', '2')
      cy.getByData(testIds.cartpage_decrementButton).click()
      cy.getByData(testIds.cartpage_input).should('have.value', '1')
    })
    it('Should conatin order Button and click on it render it on checkout page', () => {
      cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Proceed')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
  })
})
