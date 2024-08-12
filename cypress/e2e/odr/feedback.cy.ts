import { statusResponse } from '../../fixtures/ODR/orderDetails/statusResponse'
import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/ODR/checkoutPage/initResponse'
import { complaintsDetails, respondentDetails } from '../../fixtures/ODR/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/ODR/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/ODR/orderConfirmation/orderResponse'

describe('Feedback Page', () => {
  context('Should Navigate to HomePage on Click on Submit to review and Display Toast Message on Home page', () => {
    const searchTerm = 'mediation'
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'ODR/searchPage/searchResults.json'
      })
      cy.selectProduct(0)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.performSelect({ fixture: 'ODR/checkoutPage/selectResponse.json' }, 'selectResponse')
      cy.wait('@selectResponse')
      cy.fillComplaintDetails(complaintsDetails)
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')
      cy.fillRespondentDetails(respondentDetails)
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')
      cy.fillDisputeDetails()
      cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/disputeSubmitFormResponse.json' }, 'disputeFormResponse')
      cy.fillConsentDetails()
      cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/consentFormResponse.json' }, 'consentFormResponse')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_orderConfirmation)
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.wait('@confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.wait('@orderResponse')

      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.performStatus(statusResponse('REQUEST_RECEIVED'), 'processStatusResponse')
      cy.wait('@processStatusResponse')

      cy.performStatus(statusResponse('UNDER_INVESTIGATION'), 'underInvistigationResponse')
      cy.reload()
      cy.wait('@underInvistigationResponse')

      cy.performStatus(statusResponse('RESOLVED'), 'resolvedStatusResponse')
      cy.reload()
      cy.wait('@resolvedStatusResponse')

      cy.performStatus(statusResponse('CLOSED'), 'closedStatusResponse')
      cy.reload()
      cy.wait('@closedStatusResponse')

      cy.performRating({ fixture: 'ODR/feedback/ratingResponse.json' }, 'ratingResponse')
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
