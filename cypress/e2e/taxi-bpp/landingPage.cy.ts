import { testIds } from '../../../shared/dataTestIds'

describe('Landing page of Taxi-Bpp (Driver Application) test cases', () => {
  before(() => {
    cy.login(testIds.url_base, 'manoj@xyzcab.com', 'Abcd@1234')
  })

  it('should display the top header with current location and switch button visible', () => {
    cy.getByData(testIds.locationIcon).should('exist').and('be.visible')
    cy.getByData(testIds.yourLocation).should('exist').and('be.visible')
    cy.wait(10000)
    // cy.getByData(testIds.location).should('be.visible')
    cy.getByData(testIds.downArrow).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).should('exist').and('be.visible')
  })
  it('should display the top header with current location and switch button disabled', () => {
    cy.getByData(testIds.taxi_BPP_offlineMode_image).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_offlineMode_offlineTitle).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_offlineMode_offlineDescription).should('exist').and('be.visible')
  })
  it('should display the top header with current location and switch button enabled', () => {
    cy.intercept('POST', 'https://bpp-unified-strapi1-prod.becknprotocol.io/driver-app/toggle-availability', {
      fixture: 'TAXI-BPP/toggleAvailabiltiyResponse.json'
    }).as('toggleAvailabiltiyResponse')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).click()
    cy.wait('@toggleAvailabiltiyResponse').its('response.statusCode').should('eq', 200)
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).should('exist')
    cy.wait(10000)
  })

  it('displays a new ride request modal and verifies ride details', () => {
    cy.fixture('TAXI-BPP/newRide.json').then(rideRequestData => {
      cy.setRideRequestState(rideRequestData)
    })
    cy.getByData(testIds.taxi_BPP_pickup_location_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_drop_location_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_km_away_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_km_distance_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_accept_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_decline_button).should('be.visible')
  })
  it('Decline button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_decline_button).click()
    cy.wait(10000)
    cy.fixture('TAXI-BPP/newRide.json').then(rideRequestData => {
      cy.setRideRequestState(rideRequestData)
    })
  })
  it('Accept button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_accept_button).click()
  })
})
