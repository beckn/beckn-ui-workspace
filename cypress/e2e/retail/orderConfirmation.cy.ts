import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
describe('Order Confirmation Page', () => {
  const searchTerm = 'sunglass'

  context('should render orderDetail Page when user click on View Order Details button', () => {
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
      cy.url().should('include', '/paymentMode')
      cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', '/orderConfirmation')
      cy.intercept('POST', '/confirm', { fixture: 'confirmPage/confirmRespons.json' }).as('confirmCall')
      cy.wait('@confirmCall')
    })

    it('should display order confirmation details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'ORDER SUCCESFULL')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should('contain.text', 'Thank you for your order!')
      cy.getByData(testIds.orderConfirmation_trackOrderMessage).should(
        'contain.text',
        'You can track your order in "My Order" section'
      )
    })
    it('should render the correct order ID', () => {
      const orderId = '8e2410a7'
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is: ${orderId}`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })

  context('should render Homepage when user click on go back to home button', () => {
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
      cy.url().should('include', '/paymentMode')
      cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', '/orderConfirmation')
      cy.intercept('POST', '/confirm', { fixture: 'confirmPage/confirmRespons.json' }).as('confirmCall')
    })
    it('should render homepage when click on go back to home', () => {
      cy.getByData(testIds.orderConfirmation_goBackToHome).click()
      cy.url().should('include', testIds.url_home)
    })
  })
})
