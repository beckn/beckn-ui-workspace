import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/orderDetails/statusResponse'

describe('Feedback Page', () => {
  context('Should Navigate to HomePage on Click on Submit to review and Display Toast Message on Home page', () => {
    const searchTerm = 'sunglass'
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.visit(testIds.url_home)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/searchResults.json'
      })
      cy.selectMultiProduct([0, 1])
      cy.getByData(testIds.cartButton).click()
      cy.performSelect({ fixture: 'checkoutPage/selectResponse.json' }, 'selectResponse')
      cy.wait('@selectResponse')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
      cy.fillAndSaveShippingDetails()
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.getByData(testIds.paymentpage_CashOnDelivery).click()
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.wait('@confirmResponse')
      cy.performOrders(orderResponse, 'ordersResponse')
      cy.wait('@ordersResponse')
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.performStatus(statusResponse('ACTIVE', 'ArrangingPayment'), 'processStatusResponse')
      cy.wait('@processStatusResponse')

      cy.performStatus(statusResponse('ACTIVE', 'PaymentSettled'), 'readyToShipStatusResponse')
      cy.reload()
      cy.wait('@readyToShipStatusResponse')

      cy.performStatus(statusResponse('ACTIVE', 'Shipped'), 'shippedStatusResponse')
      cy.reload()
      cy.wait('@shippedStatusResponse')

      cy.performStatus(statusResponse('COMPLETE', 'Delivered'), 'deliveredStatusResponse')
      cy.reload()
      cy.wait('@deliveredStatusResponse')
      cy.performRating({ fixture: 'feedback/ratingResponse.json' }, 'ratingResponse')
    })

    it('should display feedback page elements correctly and  Submit the review and navigate to home page', () => {
      cy.getByData(testIds.orderDetails_rateUs_mainContainer).click()
      cy.url().should('include', testIds.url_feedback)
      cy.getByData(testIds.feedbackPage_orderDeliveredOnTime).should('contain.text', 'Order Delivered on Time!')
      cy.getByData(testIds.feedbackPage_addCommentsHere).should('contain.text', 'Add your comments here')
      cy.getByData(testIds.feedbackPage_pleaseShareYourFeedback).should(
        'contain.text',
        'Please share your feedback with us'
      )
      cy.getByData(`${testIds.feedback_starRating}-2`).click()
      const feedbackText = 'This is my feedback'
      cy.getByData(testIds.feedback_textarea).type(feedbackText).should('have.value', feedbackText)
      cy.getByData(testIds.feedback_submitReview).click()
      cy.wait('@ratingResponse')
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.feedback).should('contain.text', 'Thank you for your rating! ')
    })
  })
})
