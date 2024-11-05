import { testIds } from '../../../shared/dataTestIds'
import { confirmResponse } from '../../fixtures/mobility-bap/confirm'
import { initResponse } from '../../fixtures/mobility-bap/initResponse'
import { statusResponse } from '../../fixtures/mobility-bap/status'
import { userDetails } from '../../fixtures/mobility-bap/userDetails'

describe('Ride Started  Modal Tests', () => {
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
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.performStatus(statusResponse('CAB_REACHED_PICKUP_LOCATION'), 'cabRichedPickupLocation')
    cy.wait('@cabRichedPickupLocation')
    cy.performStatus(statusResponse('RIDE_STARTED'), 'rideStarted')
    cy.wait('@rideStarted')
    // cy.performStatus(statusResponse('RIDE_COMPLETED'), 'rideCompleted')
    // cy.wait('@rideCompleted')
  })
  it('should render the Ride Stared Modal', () => {
    cy.url().should('include', 'http://localhost:3000/?fromPayment=true')
    cy.getByData(testIds.mobility_car_registrationNumber).should('be.visible')
    cy.getByData(testIds.mobility_car_details).should('be.visible')
    cy.getByData('driverImage').should('be.visible')
    cy.getByData('driverName').should('be.visible')
    cy.getByData('driverRating').should('be.visible')
    cy.getByData('drivercallIcon').should('be.visible')
    cy.getByData(testIds.mobility_totalFare).should('be.visible')
    cy.getByData(testIds.mobility_Payment_text).should('be.visible')
    cy.getByData(testIds.mobility_cashText).should('be.visible')
    cy.getByData(testIds.mobility_Payment_image).should('be.visible')
    cy.getByData(testIds.mobility_pickup_label).should('be.visible')
    cy.getByData(testIds.mobility_dropoff_label).should('be.visible')
    cy.getByData(testIds.mobility_cashText_Contact_Support).should('be.visible')
  })
  it('should render Cab Details', () => {
    cy.getByData('registrationNumber').should('contain.text', 'MH12 MH 1234')
    cy.getByData('carDetails').should('contain.text', 'Maruti Ertiga')
    cy.getByData('driverName').should('contain.text', 'Manoj Kumar')
    cy.getByData('driverRating').should('contain.text', '4.0')
  })
  it('Should Render Cab Payment Details ', () => {
    cy.getByData(testIds.mobility_totalFare).should('contain.text', 'Total Fare')
    cy.getByData(testIds.mobility_Payment_text).should('contain.text', 'Payment')
    cy.getByData(testIds.mobility_cashText).should('contain.text', 'Cash')
    cy.getByData(testIds.mobility_Payment_image).should('have.attr', 'src')
  })
  it('Should Render Cab Pickup and dropoff Location ', () => {
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_pickup_address).should('contain.text', 'Decathlon Sports Wakad')
    cy.getByData(testIds.mobility_dropoff_address).should('contain.text', 'Maharashtra Cricket Association Stadium')
    cy.getByData(testIds.mobility_cashText_Contact_Support).should('contain.text', 'Contact Support')
  })

  it('should Click On Contact Support Button and Navigate to Contact Support Handle Page and Show All Element', () => {
    cy.getByData(testIds.mobility_cashText_Contact_Support).click()
    cy.getByData('Contact_Support').should('be.visible')
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.getByData('contactSupprtText').should('be.visible')
    cy.getByData('call_us').should('be.visible')
    cy.getByData(' email_us').should('be.visible')
  })
})
