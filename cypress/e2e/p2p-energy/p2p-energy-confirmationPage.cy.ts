import { testIds } from '../../../shared/dataTestIds'
describe('P2P Energy Order Confirmation Page', () => {
  context('should render Homepage when user click on go back to home button', () => {
    before(() => {
      cy.clearAllLocalStorage()
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
      cy.getByData(testIds.cartpage_cartOrderButton).click()
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
      cy.getByData('submit').click()
      cy.intercept('POST', '**/init', { fixture: 'P2P/initResponse.json' }).as('initCall')
      cy.wait('@initCall')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_payment)
      cy.url().should('include', '/paymentMode')
      cy.intercept('POST', '/confirm', { fixture: 'P2P/confirmResponse.json' }).as('confirmResponse')
      cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()

      cy.url().should('include', '/orderConfirmation')
      cy.intercept('POST', '/confirm', { fixture: 'P2P/confirmResponse.json' }).as('confirmResponse')
      cy.wait('@confirmResponse')
    })

    it('should render homepage when click on go back to home', () => {
      cy.getByData(testIds.orderConfirmation_goBackToHome).click()
      cy.url().should('include', testIds.url_home)
    })
  })
})
