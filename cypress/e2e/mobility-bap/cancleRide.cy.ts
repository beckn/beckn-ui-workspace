import { testIds } from '../../../shared/dataTestIds'
import { confirmResponse } from '../../fixtures/mobility-bap/confirm'
import { initResponse } from '../../fixtures/mobility-bap/initResponse'
import { statusResponse } from '../../fixtures/mobility-bap/status'
import { userDetails } from '../../fixtures/mobility-bap/userDetails'

describe('Cancle Ride Page Tests', () => {
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
    cy.getByData('cancelRide').click()
    cy.getByData('checkbox-group')
      .first()
      .within(() => {
        cy.get('label[for="checkbox-1"]').click()
      })
    cy.getByData('cancelRide').should('not.be.disabled')
    cy.getByData('cancelRide').click()
    cy.url().should('include', '/cancelRide')
  })
  it('Should Render Cancle Page', () => {
    cy.getByData(testIds.Mobility_cancle_ride_image).should('have.attr', 'src')
    cy.getByData(testIds.Mobility_cancle_ride_Cancelled_text).should('be.visible')
    cy.getByData(testIds.Mobility_Your_Ride_has_been_cancelled_text).should('be.visible')
    cy.getByData(testIds.Mobility_paid_already_text).should('be.visible')
    cy.getByData(testIds.Mobility_refunded_soon_text).should('be.visible')
    cy.getByData(testIds.Mobility_Go_Back_Home).should('be.visible')
  })
  it('Should Render Cancle Page With All Elements', () => {
    cy.getByData(testIds.Mobility_cancle_ride_Cancelled_text).should('contain.text', 'Ride Cancelled!')
    cy.getByData(testIds.Mobility_Your_Ride_has_been_cancelled_text).should(
      'contain.text',
      'Your Ride has been cancelled,'
    )
    cy.getByData(testIds.Mobility_paid_already_text).should('contain.text', 'If you have paid already, it will get ')
    cy.getByData(testIds.Mobility_refunded_soon_text).should('contain.text', 'refunded soon')
    cy.getByData(testIds.Mobility_Go_Back_Home).should('contain.text', 'Go Back Home')
  })
  it('Should Render Homepage when click on Go back button', () => {
    cy.getByData(testIds.Mobility_Go_Back_Home).click()
    cy.url().should('include', testIds.url_home)
  })
})
