import { testIds } from '../../../shared/dataTestIds'
import { confirmResponse } from '../../fixtures/mobility-bap/confirm'
import { initResponse } from '../../fixtures/mobility-bap/initResponse'
import { userDetails } from '../../fixtures/mobility-bap/userDetails'

describe('Payment Page Tests', () => {
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
  })

  it('should render the Payment page', () => {
    cy.url().should('include', '/paymentMode')
    cy.getByData(testIds.paymentpage_visa).should('be.visible')
    cy.getByData(testIds.paymentpage_masterCard).should('be.visible')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('be.visible')
  })
  it('should render the Payment page and Check all element should be contain text', () => {
    cy.url().should('include', '/paymentMode')
    cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash')
  })
  it('should disable the confirm button when no radio button is selected', () => {
    cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).contains('Continue').should('be.disabled')
  })
  it('should Click on Confirm Button', () => {
    cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
  })
})
