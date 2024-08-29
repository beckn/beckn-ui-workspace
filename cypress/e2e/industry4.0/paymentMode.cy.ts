import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/INDUSTRY4.0/checkoutPage/initResponse'
describe('Payment Page', () => {
  const searchTerm = 'assembly'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'INDUSTRY4.0/searchPage/searchResults.json'
    })
    cy.getByData(testIds.search_page_product_OnClick).first().click()
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.product_page_book_button).click()
    cy.performSelect({ fixture: 'INDUSTRY4.0/select/selectResult.json' }, 'selectResponse')
    cy.fillAssemblyDetails()
    cy.performXinput_Submit({ fixture: 'INDUSTRY4.0/x-input/x-inputResult.json' }, 'xinputResponse')
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
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
    cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', testIds.url_orderConfirmation)
  })
})
