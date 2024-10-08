import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress', { latitude: 18.6087413, longitude: 73.75189209999999 }, 'mobility-bap/address.json')
    cy.wait('@getAddress')
  })

  it('should render homepage with google map', () => {
    cy.getByData(testIds.mobility_map_container).should('be.visible')
    cy.getByData(testIds.mobility_map).should('be.visible')
  })

  it('should render the pickup-dropoff modal', () => {
    cy.getByData(testIds.mobility_pickup_dropoff).should('be.visible')
    cy.getByData(testIds.mobility_pickup_dropoff).should('contain.text', 'Where Would You Like To Go?')
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
  })

  it('should contain pickup address on load', () => {
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_pickup_address).should('contain.text', 'Decathlon Sports Wakad')
  })

  it('should contain empty dropoff address on load', () => {
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).should('contain.text', '')
  })

  it('The search button should render as disabled on initial load', () => {
    cy.getByData(testIds.mobility_search_btn).should('be.disabled')
  })

  it('should render the geolocation search component onclick of dropoff field', () => {
    cy.getByData(testIds.mobility_dropoff_address).click()
    cy.getByData(testIds.loaction_list).should('be.visible')
  })

  it('should render the location list on input change', () => {
    cy.getByData(testIds.loaction_list).should('be.visible')
    cy.getByData(testIds.loaction_list).type('Maharashtra Cricket Association Stadium')
    cy.getByData(testIds.location_list_item).should('be.visible')
  })

  it('should update the dropoff address on select', () => {
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
    cy.getByData(testIds.mobility_dropoff_address).should('contain.text', 'Maharashtra Cricket Association Stadium')
  })

  it('search button should be enabled when both drop-off and pickup addresses are set', () => {
    cy.getByData(testIds.mobility_search_btn).should('not.be.disabled')
  })

  it('should check for violation for drop-off and pickup when search button click', () => {
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
    cy.getByData(testIds.mobility_cancel_search).should('be.visible')
    cy.getByData(testIds.mobility_cancel_search).should('contain.text', 'Cancel Search')
  })

  it('should cancel the search when the user clicks the cancel button', () => {
    cy.getByData(testIds.mobility_cancel_search).click()
    cy.getByData(testIds.mobility_search_btn).should('not.be.disabled')
    cy.getByData(testIds.mobility_cancel_search).should('not.exist')
  })

  it('should render the toast when the user cancels the search', () => {
    cy.getByData(testIds.feedback).should('contain.text', 'Cab search request canceled.')
  })
})
