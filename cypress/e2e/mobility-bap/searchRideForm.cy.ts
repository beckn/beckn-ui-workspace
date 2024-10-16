import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/mobility-bap/initResponse'
import { userDetails } from '../../fixtures/mobility-bap/userDetails'

describe('Search ride form Tests', () => {
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
  })

  it('should render the search ride form page', () => {
    cy.getByData(testIds.mobility_search_ride_details_form).should('be.visible')
  })

  it('should render the cab details like name and fare', () => {
    cy.getByData(testIds.mobility_ride_name).should('contain.text', 'XYZ Mini')
    cy.getByData(testIds.mobility_ride_fare).should('contain.text', '122.26')
  })

  it('should render the ride details like pickup dropoff address', () => {
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_pickup_address).should('contain.text', 'Decathlon Sports Wakad')
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).should('contain.text', 'Maharashtra Cricket Association Stadium')
  })

  it('should render the rider details like name and phone number', () => {
    cy.getByData(testIds.mobility_rider_name).should('be.empty', '')
    cy.getByData(testIds.mobility_rider_mobileNo).should('be.empty', '')
  })

  it('confirm button text shoudl be `Confirm & Proceed`', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).should('have.text', 'Confirm & Proceed')
  })

  it('Confirm & proceed button should be disbaled if name and phone number is empty', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).should('be.disabled')
  })

  it('should able to type name value', () => {
    cy.getByData(testIds.mobility_rider_name).type(userDetails.name)
  })

  it('should able to type mobile number value', () => {
    cy.getByData(testIds.mobility_rider_mobileNo).type(userDetails.mobileNumber)
  })

  it('Confirm & proceed button should be not be disbaled if name and phone number is not empty', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).should('not.be.disabled')
  })

  it('when click on Confirm & proceed button should navigate to payment page', () => {
    cy.performInit(initResponse, 'initResponse')
    cy.getByData(testIds.mobility_rider_confirm_button).click()
    cy.wait('@initResponse')
    cy.getByData(testIds.pageName).should('have.text', 'Select Payment Method')
  })
})
