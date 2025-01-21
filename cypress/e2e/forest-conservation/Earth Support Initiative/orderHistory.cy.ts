import { testIds } from '../../../../shared/dataTestIds'
import { statusResponse } from '../../../fixtures/Climate-resilience/DRAGON-FOODS/orderHistory/statusResponse'

describe('OrderHistory Page Tests', () => {
  context('should Render Empty Order Page when there is no Data in order Response', () => {
    before(() => {
      cy.clearAllCookies()
      cy.clearLocalStorage()
      cy.visit(testIds.url_base)
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_firstTimeLoginvalidEmail)
      // cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_firstTimeLoginvalidEmail)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_firstTimeLoginvalidPassword)
      // cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_firstTimeLoginvalidPassword)

      cy.getByData(testIds.auth_loginButton).click()
      // cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.intercept('GET', '**/api/orders?filters[category][id][$eq]=12&sort=updatedAt:desc', {
        fixture: 'Forest-conservation/EARTH-SUPPORT-INITIATIVE/orderHistory/emptyOrderResponse.json'
      }).as('getEmptyOrders')
    })
    it('Should render EmptyOrder page', () => {
      cy.url().should('include', testIds.url_orderHistory)
      cy.getByData(testIds.empty_order_image).should('have.attr', 'src')
      cy.getByData(testIds.emptyOrderHistoryText).should('contain.text', 'This space appears quite empty!')
      cy.getByData(testIds.noExistingWorkflowText).should(
        'contain.text',
        'No existing workflows found; create a new workflow to proceed.'
      )
      cy.getByData(testIds.emptyOrder_button).click()
      cy.url().should('include', testIds.url_home)
    })
  })

  context('Should render Order History Page if there is Order response Data ', () => {
    before(() => {
      // cy.login(testIds.url_base, testIds.dragon_foods_user_login, testIds.user_password)

      cy.clearAllCookies()
      cy.clearLocalStorage()
      cy.visit(testIds.url_base)
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword)

      cy.getByData(testIds.auth_loginButton).click()

      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.intercept('GET', '**/api/orders?filters[category][id][$eq]=12&sort=updatedAt:desc', {
        fixture: 'Forest-conservation/EARTH-SUPPORT-INITIATIVE/orderHistory/orderResponse.json'
      }).as('orderResponse')
    })

    it('Should render Order History Page', () => {
      cy.getByData('order_history_item_name').should('exist')
      cy.getByData('order_history_provider').should('exist')
      cy.getByData('order_history_description').should('exist')
      cy.getByData(testIds.orderHistory_createdAt).should('exist')
    })
    it('should render the initial ORDER RECEIVED status map', () => {
      cy.getByData(testIds.accordion_click).eq(1).click()
      cy.performStatus(statusResponse('ORDER_RECEIVED'), 'orderStatusResponse')
      cy.getByData('order_history_Status').should('exist')
      cy.getByData('order_history_Status').should('contain.text', 'Pending')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('exist')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('contain.text', 'Data Requested')
      cy.getByData(testIds.orderDetailspage_orderStateTime).should('exist')
    })
    it('should change the Status when ORDER SHARED status map Called', () => {
      cy.getByData(testIds.accordion_click).eq(1).click()
      cy.performStatus(statusResponse('REQUEST_SHARED'), 'orderStatusCompleteResponse')
      cy.getByData(testIds.accordion_click).eq(1).click()
      cy.getByData('order_history_Status').should('exist')
      cy.getByData('order_history_Status').should('contain.text', 'Completed')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('exist')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('contain.text', 'Request Status')
      cy.getByData(testIds.orderDetailspage_orderStateTime).should('exist')
    })
  })
})
