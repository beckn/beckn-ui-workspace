import { testIds } from '../../../../shared/dataTestIds'
import { initResponse } from '../../../fixtures/Climate-resilience/HARMONIAIDS/checkoutPage/initResponse'
describe('Order Confirmation Page', () => {
  const searchTerm = 'floodprediction'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'Climate-resilience/HARMONIAIDS/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.url().should('include', testIds.url_product)
    cy.getByData('"product-checkbox"').eq(0).click()
    cy.getByData('"product-checkbox"').eq(4).click()
    cy.getByData('"product-checkbox"').eq(5).click()
    cy.getByData('"product-checkbox"').eq(8).click()
    cy.getByData('product-radio').eq(0).click()
    cy.getByData('product-radio').eq(3).click()
    cy.getByData('"product-checkbox"').eq(11).click()
    cy.getByData(testIds.Proceed_to_product).click()
    cy.intercept('POST', '/select', { fixture: 'Climate-resilience/HARMONIAIDS/cart/selectResult.json' }).as(
      'selectCall'
    )
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
    cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', testIds.url_orderConfirmation)
  })

  it('should display Order Confirmation Page with Result', () => {
    cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'Request Confirmed!')
    cy.getByData(testIds.orderConfirmation_gratefulMessage).should(
      'contain.text',
      'The dataset will be shared via the chosen mode'
    )
    cy.getByData(testIds.orderConfirmation_trackOrderMessage).should('contain.text', 'email ID: ankit@gmail.com')
  })
  it('should Navigate to Homepgae when Click on Go back to homePage', () => {
    cy.getByData(testIds.orderConfirmation_goBackToHome).click()
    cy.url().should('include', testIds.url_home)
  })
})
