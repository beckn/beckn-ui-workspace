import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/TOURISM/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/TOURISM/orderConfirmation/orderResponse'
describe('Order Confirmation Page', () => {
  const searchTerm = 'Manali'

  context('should render orderDetail Page when user click on View Order Details button', () => {
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
      cy.url().should('include', '/paymentMode')
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.performTourismOrders(orderResponse, 'orderResponse')
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', '/orderConfirmation')
      cy.wait('@confirmResponse')
      cy.wait('@orderResponse')
    })

    it('should display order confirmation details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'Order Placed!')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should(
        'contain.text',
        'Thank you! Your booking will be confirm shortly!'
      )
      cy.getByData(testIds.orderConfirmation_trackOrderMessage).should(
        'contain.text',
        'You can track your order in "My Order" section'
      )
    })
    it('should render the correct order ID', () => {
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('exist')
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is:`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })

  context('should render Homepage when user click on go back to home button', () => {
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
      cy.url().should('include', '/paymentMode')
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.performTourismOrders(orderResponse, 'orderResponse')
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
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
})
