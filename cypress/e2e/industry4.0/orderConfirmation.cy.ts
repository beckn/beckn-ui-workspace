import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/INDUSTRY4.0/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('Order Confirmation Page', () => {
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
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.performOrders(orderResponse, 'orderResponse')
    cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', '/orderConfirmation')
    cy.wait('@confirmResponse')
    cy.wait('@orderResponse')
  })

  it('should display order confirmation details after API call', () => {
    cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
    cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'Order Placed')
    cy.getByData(testIds.orderConfirmation_gratefulMessage).should(
      'contain.text',
      'The order has been placed successfully.'
    )
  })
  it('should have a button to view order details and navigate to order details page when clicked', () => {
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.url().should('include', testIds.url_orderDetails)
  })
})

context('should render Homepage when user click on go back to home button', () => {
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
    cy.get(testIds.type).select('Plastic Box')
    cy.get(testIds.type).should('have.value', 'Plastic Box')
    cy.get(testIds.colour).select('Blue')
    cy.get(testIds.colour).should('have.value', 'Blue')
    cy.get(testIds.shape).select('Circle')
    cy.get(testIds.shape).should('have.value', 'Circle')
    cy.get(testIds.length).type('10')
    cy.get(testIds.width).type('100')
    cy.get(testIds.weight).type('10')
    cy.get(testIds.increaseQuantity).click()
    cy.get(testIds.quantity).should('have.value', '2')
    cy.get('button[type="submit"]').click()
    cy.performXinput_Submit({ fixture: 'INDUSTRY4.0/x-input/x-inputResult.json' }, 'xinputResponse')
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData('submit').click()
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_payment)
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.performOrders(orderResponse, 'orderResponse')
    cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', '/orderConfirmation')
    cy.wait('@confirmResponse')
    cy.wait('@orderResponse')
  })
  it('should render homepage when click on go back to home', () => {
    cy.getByData(testIds.orderConfirmation_goBackToHome).click()
    cy.url().should('include', testIds.url_home)
  })
})
