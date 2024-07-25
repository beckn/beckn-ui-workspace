import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
describe('Payment Page', () => {
  const searchTerm = 'sunglass'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(testIds.url_home)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.cartButton).click()
    cy.performSelect({ fixture: 'checkoutPage/selectResponse.json' })
    cy.getByData(testIds.cartpage_cartOrderButton).click()
    cy.getByData(testIds.feedback).getByData('close').click()
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData('submit').click()
    cy.performInit(initResponse)
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_payment)
  })

  it('should display payment Page with Result', () => {
    cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
    cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_phonePay).should('contain.text', 'PhonePe UPI')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash on Delivery')
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
