import { testIds } from '../../../../shared/dataTestIds'
import { initResponse } from '../../../fixtures/Forest-conservation/EARTH-SUPPORT-INITIATIVE/checkoutPage/initResponse'
describe('Payment Page', () => {
  const searchTerm = 'data'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'Forest-conservation/EARTH-SUPPORT-INITIATIVE/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.url().should('include', testIds.url_product)
    cy.getByData('"product-checkbox"').eq(0).click()
    cy.getByData('"product-checkbox"').eq(5).click()
    cy.getByData('product-radio').eq(0).click()
    cy.getByData('product-radio').eq(5).click()
    cy.getByData('"product-checkbox"').eq(7).click()
    cy.getByData(testIds.Proceed_to_product).click()
    cy.intercept('POST', '/select', {
      fixture: 'Forest-conservation/EARTH-SUPPORT-INITIATIVE/cart/selectResult.json'
    }).as('selectCall')
    cy.wait('@selectCall')
    cy.getByData(testIds.feedback).getByData('close').click()
    cy.url().should('include', testIds.url_cart)
    cy.getByData(testIds.Proceed).click()
    cy.url().should('include', testIds.url_checkout)
    cy.getByData(testIds.checkoutpage_billingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData('submit').click()
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_payment)
  })

  it('should display payment Page with Result', () => {
    cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
    cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_phonePay).should('contain.text', 'PhonePe UPI')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Wallet')
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
    cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', testIds.url_orderConfirmation)
  })
})
