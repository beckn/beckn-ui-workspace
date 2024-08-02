import { formatTimestamp } from '../../../shared/utils/timestamp'
import { testIds } from '../../../shared/dataTestIds'
import { orderResponse } from '../../fixtures/orderConfirmation/orderResponse'

describe('OrderHistory Page Tests', () => {
  context('should Render Empty Order Page when there is no Data in order Response', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_firstTimeLoginvalidEmail, testIds.user_firstTimeLoginvalidPassword)

      cy.visit(testIds.url_home)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.intercept('GET', '**/orders?filters[category]=6', { fixture: 'orderHistory/emptyOrderResponse.json' }).as(
        'getEmptyOrders'
      )
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

      cy.visit(testIds.url_home)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.performOrderHisrory({ fixture: 'orderHistory/orderResponse.json' }, 'orderResponse')
    })

    it('Should render Order History Page', () => {
      cy.fixture('orderHistory/orderResponse.json').then(orderResponse => {
        const orderData = orderResponse.data[0].attributes
        const createdAt = formatTimestamp(orderData.createdAt)

        cy.getByData(testIds.orderHistory_createdAt).should('contain.text', `Placed at ${createdAt}`)
        cy.getByData(testIds.orderHistory_order_id).should('contain.text', `Order ID: ${orderData.order_id}`)
        cy.getByData(testIds.orderHistory_Price).should('contain.text', `INR ${orderData.price}`)
        cy.getByData(testIds.orderHistory_pendingIcon).should('have.attr', 'src')
      })
    })
    it('should navigate to orderDetails page when click on perticular order Id', () => {
      cy.performOrders(orderResponse, 'ordersResponse').as('orderResponse')
      cy.getByData(testIds.order_history_main_container).eq(0).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })
})
