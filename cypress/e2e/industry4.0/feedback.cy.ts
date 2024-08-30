import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/INDUSTRY4.0/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/INDUSTRY4.0/orderDetails/statusResponse'

describe('Feedback Page', () => {
  context('Should Navigate to HomePage on Click on Submit to review and Display Toast Message on Home page', () => {
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
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.performStatus(statusResponse('ORDER ACCEPTED'), 'processStatusResponse')
      cy.wait('@processStatusResponse')
      cy.reload()
      cy.performStatus(statusResponse('ORDER_PROCESSING'), 'orderProcessingResponse')
      cy.wait('@orderProcessingResponse')

      cy.performStatus(statusResponse('ORDER_DISPATCHED'), 'orderDispatchResponse')
      cy.reload()
      cy.wait('@orderDispatchResponse')

      cy.performStatus(statusResponse('ORDER_SHIPPED'), 'orderShippedResponse')
      cy.reload()
      cy.wait('@orderShippedResponse')

      cy.performStatus(statusResponse('DELIVERED'), 'orderDeliveredResponse')
      cy.reload()
      cy.wait('@orderDeliveredResponse')
      cy.performRating({ fixture: 'INDUSTRY4.0/feedback/ratingResponse.json' }, 'ratingResponse')
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
    })
  })
})
