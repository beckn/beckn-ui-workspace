import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/TOURISM/checkoutPage/initResponse'
describe('Payment Page', () => {
  const searchTerm = 'manali'

  before(() => {
    cy.login(testIds.url_base_tourism, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base_tourism}${testIds.url_home}`)
    cy.getByData(testIds.homepage_searchInput).click()
    cy.getByData(testIds.loaction_list).type(searchTerm)
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
    cy.getByData(testIds.homepage_search_button).click()
    cy.performSearch(searchTerm, {
      fixture: 'TOURISM/searchPage/searchResults.json'
    })
    cy.performSelect({ fixture: 'TOURISM/checkoutPage/selectResponse.json' }, 'selectResponse')
    cy.selectProduct(0)
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.wait('@selectResponse')
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
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash on Arrival')
    cy.getByData(testIds.paymentpage_image).should('have.attr', 'src')
  })
  it('should display payment method images and radio button', () => {
    cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
  })

  it('should disable the confirm button when no radio button is selected', () => {
    cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).contains('Confirm Booking').should('be.disabled')
  })

  it('should navigate to the order confirmation page upon clicking confirm button', () => {
    cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', testIds.url_orderConfirmation)
  })
})
