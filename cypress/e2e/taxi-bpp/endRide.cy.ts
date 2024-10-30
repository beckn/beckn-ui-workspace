import { testIds } from '../../../shared/dataTestIds'

describe('End ride in Taxi-Bpp (Driver Application) test cases', () => {
  before(() => {
    cy.login(testIds.url_base, 'manoj@xyzcab.com', 'Abcd@1234')
    cy.intercept('POST', 'https://bpp-unified-strapi1-prod.becknprotocol.io/driver-app/toggle-availability', {
      fixture: 'TAXI-BPP/toggleAvailabiltiyResponse.json'
    }).as('toggleAvailabiltiyResponse')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).click()
    cy.wait('@toggleAvailabiltiyResponse').its('response.statusCode').should('eq', 200)
    cy.wait(10000)
    cy.fixture('TAXI-BPP/newRide.json').then(rideRequestData => {
      cy.setRideRequestState(rideRequestData)
    })
    cy.getByData(testIds.taxi_BPP_accept_button).click()
    cy.getByData(testIds.taxi_BPP_Reached_Pick_up_Location_button).click()
    cy.getByData(testIds.taxi_BPP_Start_ride_button).click()
  })

  it('should display the top header with end ride details visible', () => {
    cy.getByData('ride-summary-header-img').should('exist').and('be.visible')
    cy.getByData('START_RIDE').should('exist').and('be.visible')
    cy.getByData('header-sub-title').should('exist').and('be.visible')
    cy.getByData('driver-img').should('exist').and('be.visible')
    cy.getByData('driver-call-img').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_km_away_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_km_distance_text).should('exist').and('be.visible')
    cy.getByData(testIds.driver_navigate).should('exist').and('be.visible')
    cy.getByData(testIds.navigate_img).should('exist').and('be.visible')
    cy.getByData('source-icon').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_pickup_location_text).should('exist').and('be.visible')
    cy.getByData('destination-icon').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_drop_location_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_end_ride_button).should('exist').and('be.visible')
  })
  it('Driver end call button should be clickable', () => {
    cy.getByData('driver-call-click').click()
  })
  it('Navigate button should be clickable', () => {
    cy.getByData('driver-call-click').click()
  })
  it('Start ride button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_end_ride_button).click()
  })
})
