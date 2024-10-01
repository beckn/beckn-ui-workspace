import { testIds } from '../../../shared/dataTestIds'
describe('Cart Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })
  context('When there are no items in cart', () => {
    const searchTerm = 'Java'
    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.performSearch(searchTerm, {
        fixture: 'DSEP/searchPage/searchResults.json'
      })
      cy.getByData(testIds.cartButton).click()
    })

    it('should render the cart page with no items', () => {
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'No Course!')
      cy.getByData(testIds.cartpage_emptySubHeading).should('contain.text', `Seems like you haven't selected a course`)
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Search Courses')
    })
  })
  context('should render When there are Items in Cart', () => {
    const searchTerm = 'Java'
    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.performSearch(searchTerm, {
        fixture: 'DSEP/searchPage/searchResults.json'
      })
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.intercept('POST', '/select', { fixture: 'DSEP/cart/selectResult.json' }).as('selectCall')
      cy.getByData(testIds.cartButton).click()
      cy.wait('@selectCall')
    })

    it('should render the cart page when counter is one and trash button is clicked', () => {
      cy.getByData(testIds.cartpage_trashButton).click()
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'No Course!')
      cy.getByData(testIds.cartpage_emptySubHeading).should('contain.text', `Seems like you haven't selected a course`)
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Search Courses')
      cy.getByData(testIds.cartpage_emptyButton).click()
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
    })

    it('should render and display cart page with result', () => {
      cy.getByData(testIds.cartpage_itemImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_itemName).should('be.visible')
      cy.getByData('item-price').should('be.visible')
      cy.url().should('include', testIds.url_cart)
    })
    it('should render and display cart page Order Summary ', () => {
      cy.getByData(testIds.cartpage_orderSummaryText).should('contain.text', 'Order Summary')
      cy.getByData(testIds.cartSubTotal_Text).should('contain.text', 'Sub-Total')
      cy.getByData(testIds.cartpage_totalAmountText).should('contain.text', 'Total')
    })

    it('Should conatin order Button and click on it render it on checkout page', () => {
      cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Checkout')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
  })

  context('should Click on Check for Scholarship', () => {
    const searchTerm = 'Java'
    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.performSearch(searchTerm, {
        fixture: 'DSEP/searchPage/searchResults.json'
      })
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.intercept('POST', '/select', { fixture: 'DSEP/cart/selectResult.json' }).as('selectCall')
      cy.getByData(testIds.cartButton).click()
      cy.wait('@selectCall')
    })

    it('Should Click on Check for Scholarship and Navigate to myScholarship page', () => {
      cy.getByData(testIds.myScholarship_button).click()
      cy.url().should('include', '/myScholarship')
    })
  })
})
