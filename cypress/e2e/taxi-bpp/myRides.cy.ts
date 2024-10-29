import { testIds } from '../../../shared/dataTestIds'
describe('My Rides Page', () => {
  before(() => {
    cy.login(testIds.url_base, 'manoj@xyzcab.com', 'Abcd@1234')
    cy.url().should('include', testIds.url_home)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.taxi_BPP_rideHistory).click()
    cy.intercept('POST', `https://bpp-unified-strapi1-**.becknprotocol.io/driver-app/my-rides`, {
      fixture: 'TAXI-BPP/myRides.json'
    }).as('myRides')
  })
  it('Should Display My Rides Page ', () => {
    cy.url().should('include', '/myRides')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_All"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').should('be.visible')
  })
  it('Should Display My Rides Details ', () => {
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
})
