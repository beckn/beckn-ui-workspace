import { testIds } from '../../../../shared/dataTestIds'
import { statusResponse } from '../../../fixtures/forest-conservation/StateForestConservation/orderHistory/statusResponse'

describe('OrderHistory Page Tests', () => {
  context('should Render Empty Order Page when there is no Data in order Response', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_firstTimeLoginvalidEmail, testIds.user_firstTimeLoginvalidPassword)

      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.intercept('GET', '**/api/orders?filters[category][id][$eq]=14&sort=updatedAt:desc', {
        fixture: 'forest-conservation/StateForestConservation/orderHistory/emptyOrderResponse.json'
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
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)

      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.intercept('GET', '**/api/orders?filters[category][id][$eq]=14&sort=updatedAt:desc', {
        fixture: 'forest-conservation/StateForestConservation/orderHistory/orderResponse.json'
      }).as('orderResponse')
    })

    it('Should render Order History Page', () => {
      cy.getByData('order_history_item_name').should('exist')
      cy.getByData('order_history_provider').should('exist')
      cy.getByData('order_history_description').should('exist')
      cy.getByData(testIds.orderHistory_createdAt).should('exist')
    })
    it('should render the initial ORDER RECEIVED status map', () => {
      cy.getByData(testIds.accordion_click).eq(0).click()
      cy.performStatus(statusResponse('ORDER_RECEIVED'), 'orderStatusResponse')
      cy.getByData('order_history_Status').should('exist')
      cy.getByData('order_history_Status').should('contain.text', 'Pending')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('exist')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('contain.text', 'Data Requested')
      cy.getByData(testIds.orderDetailspage_orderStateTime).should('exist')
    })
    it('should change the Status when ORDER SHARED status map Called', () => {
      cy.getByData(testIds.accordion_click).eq(0).click()
      cy.performStatus(statusResponse('REQUEST_SHARED'), 'orderStatusCompleteResponse')
      cy.getByData(testIds.accordion_click).eq(0).click()
      cy.getByData('order_history_Status').should('exist')
      cy.getByData('order_history_Status').should('contain.text', 'Completed')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('exist')
      cy.getByData(testIds.orderDetailspage_orderStateName).should('contain.text', 'Request Status')
      cy.getByData(testIds.orderDetailspage_orderStateTime).should('exist')
    })
  })
})
