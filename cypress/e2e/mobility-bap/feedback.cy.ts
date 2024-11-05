import { testIds } from '../../../shared/dataTestIds'
import { confirmResponse } from '../../fixtures/mobility-bap/confirm'
import { initResponse } from '../../fixtures/mobility-bap/initResponse'
import { statusResponse } from '../../fixtures/mobility-bap/status'
import { userDetails } from '../../fixtures/mobility-bap/userDetails'

describe('Feedback page Tests', () => {
  context('This Is For Submit Button', () => {
    before(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation(
        'getAddress',
        { latitude: 18.6087413, longitude: 73.75189209999999 },
        'mobility-bap/address.json'
      )
      cy.wait('@getAddress')
      cy.getByData(testIds.mobility_dropoff_address).click()
      cy.getByData(testIds.loaction_list).type('Maharashtra Cricket Association Stadium')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.performSearchWithoutSearchTerm(
        {
          fixture: 'mobility-bap/searchResults.json'
        },
        'searchResultsWithoutSearchTerm'
      )
      cy.performCheckViolation(
        {
          policyCheckResult: [
            {
              location: '18.6744633,73.7065161',
              violation: false,
              violatedPolicies: [
                {
                  id: '6b298',
                  name: 'Quarantine Policy'
                }
              ]
            }
          ]
        },
        'checkViolation'
      )
      cy.getByData(testIds.mobility_search_btn).click()
      cy.wait('@searchResultsWithoutSearchTerm')

      cy.performSelect(
        {
          fixture: 'mobility-bap/selectResponse.json'
        },
        'selectRide'
      )
      cy.getByData(testIds.mobility_catalog_container).within(() => {
        cy.getByData(testIds.mobility_catalog_item)
          .eq(0)
          .within(() => {
            cy.getByData(testIds.mobility_provider_item)
              .eq(0)
              .within(() => {
                cy.getByData(testIds.mobility_provider_item_select_button).click()
                cy.wait('@selectRide')
              })
          })
      })
      cy.getByData(testIds.mobility_rider_name).type(userDetails.name)
      cy.getByData(testIds.mobility_rider_mobileNo).type(userDetails.mobileNumber)
      cy.performInit(initResponse, 'initResponse')
      cy.getByData(testIds.mobility_rider_confirm_button).click()
      cy.wait('@initResponse')
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()

      cy.wait('@confirmResponse')
      cy.performStatus(statusResponse('AWAITING_DRIVER_APPROVAL'), 'awaitingDriverApproval')
      cy.wait('@awaitingDriverApproval')
      cy.performStatus(statusResponse('RIDE_ACCEPTED'), 'rideAccepted')
      cy.wait('@rideAccepted')
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.performStatus(statusResponse('CAB_REACHED_PICKUP_LOCATION'), 'cabRichedPickupLocation')
      cy.wait('@cabRichedPickupLocation')
      cy.performStatus(statusResponse('RIDE_STARTED'), 'rideStarted')
      cy.wait('@rideStarted')
      cy.performStatus(statusResponse('RIDE_COMPLETED'), 'rideCompleted')
      cy.wait('@rideCompleted')
    })
    it('should render Feedback Page', () => {
      cy.url().should('include', testIds.url_feedback)
      cy.getByData(testIds.feedbackPage_orderDeliveredOnTime).should('be.visible')
      cy.getByData(testIds.feedbackPage_pleaseShareYourFeedback).should('be.visible')
      cy.getByData(testIds.feedbackPage_addCommentsHere).should('be.visible')
      cy.getByData(testIds.feedback_textarea).should('be.visible')
      cy.getByData(testIds.feedback_submitReview).should('be.disabled')
      cy.getByData(testIds.feedback_skip_forNow).should('be.visible')
    })

    it('should render Feedback Page With All Elements', () => {
      cy.getByData(testIds.feedbackPage_orderDeliveredOnTime).should('contain.text', 'Ride completed!')
      cy.getByData(testIds.feedbackPage_pleaseShareYourFeedback).should(
        'contain.text',
        'Please share your feedback with us'
      )
      cy.getByData(testIds.feedbackPage_addCommentsHere).should('contain.text', 'Add your comments here')
      cy.getByData('Rate_Overall_experience').should('contain.text', 'Rate the overall experience')
      cy.getByData(testIds.feedback_skip_forNow).should('contain.text', 'Skip for Now')
    })

    it('should Click rating and click on Submit button', () => {
      cy.getByData(`${testIds.feedback_starRating}-2`).click()
      const feedbackText = 'This is my feedback'
      cy.getByData(testIds.feedback_textarea).type(feedbackText).should('have.value', feedbackText)
      cy.getByData(testIds.feedback_submitReview).click()
      cy.performRating({ fixture: 'mobility-bap/ratingResponse.json' }, 'ratingResponse')
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.feedback).should('contain.text', 'Thank you for your rating! ')
    })
  })
  context('This Is For Skip For Now Button', () => {
    before(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation(
        'getAddress',
        { latitude: 18.6087413, longitude: 73.75189209999999 },
        'mobility-bap/address.json'
      )
      cy.wait('@getAddress')
      cy.getByData(testIds.mobility_dropoff_address).click()
      cy.getByData(testIds.loaction_list).type('Maharashtra Cricket Association Stadium')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.performSearchWithoutSearchTerm(
        {
          fixture: 'mobility-bap/searchResults.json'
        },
        'searchResultsWithoutSearchTerm'
      )
      cy.performCheckViolation(
        {
          policyCheckResult: [
            {
              location: '18.6744633,73.7065161',
              violation: false,
              violatedPolicies: [
                {
                  id: '6b298',
                  name: 'Quarantine Policy'
                }
              ]
            }
          ]
        },
        'checkViolation'
      )
      cy.getByData(testIds.mobility_search_btn).click()
      cy.wait('@searchResultsWithoutSearchTerm')

      cy.performSelect(
        {
          fixture: 'mobility-bap/selectResponse.json'
        },
        'selectRide'
      )
      cy.getByData(testIds.mobility_catalog_container).within(() => {
        cy.getByData(testIds.mobility_catalog_item)
          .eq(0)
          .within(() => {
            cy.getByData(testIds.mobility_provider_item)
              .eq(0)
              .within(() => {
                cy.getByData(testIds.mobility_provider_item_select_button).click()
                cy.wait('@selectRide')
              })
          })
      })
      cy.getByData(testIds.mobility_rider_name).type(userDetails.name)
      cy.getByData(testIds.mobility_rider_mobileNo).type(userDetails.mobileNumber)
      cy.performInit(initResponse, 'initResponse')
      cy.getByData(testIds.mobility_rider_confirm_button).click()
      cy.wait('@initResponse')
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()

      cy.wait('@confirmResponse')
      cy.performStatus(statusResponse('AWAITING_DRIVER_APPROVAL'), 'awaitingDriverApproval')
      cy.wait('@awaitingDriverApproval')
      cy.performStatus(statusResponse('RIDE_ACCEPTED'), 'rideAccepted')
      cy.wait('@rideAccepted')
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.performStatus(statusResponse('CAB_REACHED_PICKUP_LOCATION'), 'cabRichedPickupLocation')
      cy.wait('@cabRichedPickupLocation')
      cy.performStatus(statusResponse('RIDE_STARTED'), 'rideStarted')
      cy.wait('@rideStarted')
      cy.performStatus(statusResponse('RIDE_COMPLETED'), 'rideCompleted')
      cy.wait('@rideCompleted')
    })
    it('should Click On Skip For Now Button', () => {
      cy.getByData(testIds.feedback_skip_forNow).should('contain.text', 'Skip for Now')
      cy.url().should('include', testIds.url_home)
    })
  })
})
