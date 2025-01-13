import { testIds } from '../../../shared/dataTestIds'
describe('Payment Page', () => {
  afterEach(() => {
    cy.clearAllLocalStorage()
  })
  before(() => {
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
  })

  it('should display payment Page with Result', () => {
    cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
    cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_phonePay).should('contain.text', 'PhonePe UPI')
    cy.getByData(testIds.paymentpage_NetBanking).should('contain.text', 'Adjust with Monthly Billing')
    cy.getByData(testIds.paymentpage_image).should('have.attr', 'src')
  })
  it('should display payment method images and radio button', () => {
    cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
  })

  it('should disable the confirm button when no radio button is selected', () => {
    cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).contains('Confirm Order').should('be.disabled')
  })

  it('should navigate to the order confirmation page upon clicking confirm button', () => {
    cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', testIds.url_orderConfirmation)
  })
})
