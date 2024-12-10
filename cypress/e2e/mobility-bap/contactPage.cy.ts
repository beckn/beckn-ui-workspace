import { testIds } from '../../../shared/dataTestIds'
import { confirmResponse } from '../../fixtures/mobility-bap/confirm'
import { initResponse } from '../../fixtures/mobility-bap/initResponse'
import { statusResponse } from '../../fixtures/mobility-bap/status'
import { userDetails } from '../../fixtures/mobility-bap/userDetails'

describe('Contact Page Tests', () => {
  before(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress', { latitude: 18.6087413, longitude: 73.75189209999999 }, 'mobility-bap/address.json')
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
    // cy.url().should('include', 'http://localhost:3000/?fromPayment=true')
    // cy.getByData(testIds.loadingIndicator).should('be.visible')
    // cy.performStatus(statusResponse('CAB_REACHED_PICKUP_LOCATION'), 'cabRichedPickupLocation')
    // cy.wait('@cabRichedPickupLocation')
    // cy.performStatus(statusResponse('RIDE_STARTED'), 'rideStarted')
    // cy.wait('@rideStarted')
    // cy.performStatus(statusResponse('RIDE_COMPLETED'), 'rideCompleted')
    // cy.wait('@rideCompleted')
  })
  it('should render the Contact Support page', () => {
    cy.url().should('include', 'http://localhost:3000/?fromPayment=true')
    cy.getByData('registrationNumber').should('be.visible')
    cy.getByData('carDetails').should('be.visible')
    cy.getByData('driverImage').should('be.visible')
    cy.getByData('driverName').should('be.visible')
    cy.getByData('driverRating').should('be.visible')
    cy.getByData('drivercallIcon').should('be.visible')
    cy.getByData('Contact_Support').should('be.visible')
    cy.getByData('cancelRide').should('be.visible')
  })
  it('should render the Contact Support page With All Element', () => {
    cy.getByData('registrationNumber').should('contain.text', 'MH12 MH 1234')
    cy.getByData('carDetails').should('contain.text', 'Maruti Ertiga')
    cy.getByData('driverName').should('contain.text', 'Manoj Kumar')
    cy.getByData('driverRating').should('contain.text', '4.0')
    cy.getByData('Contact_Support').should('contain.text', 'Contact Support')
    cy.getByData('cancelRide').should('contain.text', 'Cancel Ride')
  })

  context('Should Click On Contact Support Button', () => {
    it('should Click On Contact Support Button and Navigate to Contact Support Handle Page and Show All Element', () => {
      cy.getByData('Contact_Support').click()
      cy.getByData('Contact_Support').should('be.visible')
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.getByData('contactSupprtText').should('be.visible')
      cy.getByData('call_us').should('be.visible')
      cy.getByData(' email_us').should('be.visible')
    })
  })

  context('Should Click On Cancle Ride Button', () => {
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
    })
    it('should Click On Cancel Ride Button and Navigate to Cancel Ride Handle Page', () => {
      cy.getByData('cancelRide').click()
      cy.getByData('cancelBookingText').should('be.visible')
      cy.getByData('cancelReason').should('be.visible')
      cy.getByData('checkbox-group')
        .first()
        .within(() => {
          cy.get('label[for="checkbox-1"]').click()
        })
      cy.getByData('cancelRide').should('not.be.disabled')
      cy.getByData('cancelRide').click()
      cy.url().should('include', '/cancelRide')
    })
  })
})
