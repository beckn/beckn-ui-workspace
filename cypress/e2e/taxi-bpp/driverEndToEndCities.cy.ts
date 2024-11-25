import { testIds } from '../../../shared/dataTestIds'

describe('Driver app end to end Testing', () => {
  it('should open driver app', () => {
    cy.visit('https://driverapp-dev.becknprotocol.io/')
  })
  // Valid login scenario
  it('should Login in into driver app', () => {
    cy.getByData(testIds.auth_inputEmail).clear().type('ramesh@xyzcab.com')
    cy.getByData(testIds.auth_inputPassword).clear().type('Abcd@1234')
    cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
    cy.wait(100)
  })
  it('should check and validate toggle', () => {
    cy.getByData(testIds.taxi_BPP_offlineMode_image).should('be.visible')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_offlineMode_offlineTitle).should('be.visible')
    cy.getByData(testIds.taxi_BPP_offlineMode_offlineDescription).should('be.visible')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).click()
  })
  it('should set driver location', () => {
    cy.getByData(testIds.location).should('be.visible')
    cy.getByData(testIds.downArrow).click()
    cy.wait(1000)
    cy.get('body').type(' conrad hotel, bengaluru')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })
  //Open Mobility app, and set Pickup location as Conrad hotel,bangaluru
  // and Drop off location as kempegowda international airport, karnataka
  //Click on button 'Search ride'
  //Select available ride and enter details, confir and Proceed

  it('should validate New Ride Request', () => {
    cy.wait(30000)
    cy.getByData(testIds.taxi_BPP_pickup_location_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_drop_location_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_km_away_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_km_distance_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_accept_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_decline_button).should('be.visible')
  })
  it('Accept button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_decline_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_accept_button).click()
  })
  it('Reached Pick up Location_button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_Reached_Pick_up_Location_button).click()
  })
  it('should display the top header with start ride details visible', () => {
    cy.getByData('ride-summary-header-img').should('exist').and('be.visible')
    cy.getByData('GOING_FOR_PICK_UP').should('exist').and('be.visible')
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
    cy.getByData(testIds.taxi_BPP_Start_ride_button).should('exist').and('be.visible')
  })
  it('Driver end call button should be clickable', () => {
    cy.getByData('driver-call-click').should('be.visible')
  })
  it('Navigate button should be clickable', () => {
    cy.getByData('driver-call-click').should('be.visible')
  })
  it('Start ride button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_Start_ride_button).click()
  })
  it('End ride button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_end_ride_button).click()
  })
  it('should display the top header with looking for new ride details visible', () => {
    cy.getByData('ride-summary-header-img').should('exist').and('be.visible')
    cy.getByData('COMPLETED').should('exist').and('be.visible')
    cy.getByData('header-sub-title').should('exist').and('be.visible')
    cy.getByData('driver-img').should('exist').and('be.visible')
    cy.getByData('driver-call-img').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_km_away_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_km_distance_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_bpp_complete_ride_date).should('exist').and('be.visible')
    cy.getByData('source-icon').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_pickup_location_text).should('exist').and('be.visible')
    cy.getByData('destination-icon').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_drop_location_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_fare_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_cost_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_Look_for_New_Ride_Request_button).should('exist').and('be.visible')
  })
  it('Driver end call button should be clickable', () => {
    cy.getByData('driver-call-click').should('be.visible')
  })
  it('Start ride button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_Look_for_New_Ride_Request_button).click()
  })
  it('Should Display My Rides Details ', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.taxi_BPP_rideHistory).click()
    cy.url().should('include', '/myRides')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_All"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_carImage).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_riderName).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_date).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_time).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_status).should('be.visible')
  })
  it('Should Display by default All Tabs', () => {
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_All"]').should('be.visible')
  })
  it('Should Display Ongoing tabs when click on Ongoing tabs', () => {
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').click()
  })
  it('Should Display Completed tabs when click on Completed tabs', () => {
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').click()
  })
  it('Should Logout from app ', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.Logout_text).click()
  })
})
