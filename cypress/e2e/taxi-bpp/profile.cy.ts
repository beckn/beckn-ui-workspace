import { testIds } from '../../../shared/dataTestIds'
import { profileDetails } from '../../fixtures/TAXI-BPP/profile'
describe('Profile Page', () => {
  before(() => {
    cy.login(testIds.url_base, 'manoj@xyzcab.com', 'Abcd@1234')
    cy.url().should('include', testIds.url_home)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.taxi_BPP_profile).click()
    cy.intercept('POST', `https://bpp-unified-strapi1-**.becknprotocol.io/driver-app/me`, {
      body: profileDetails
    })
  })
  it('Should Display Profile Page ', () => {
    cy.url().should('include', '/profile')
    cy.getByData(testIds.taxi_BPP_Personal_Details).should('be.visible')
    cy.getByData(testIds.taxi_BPP_Vehicle_Details).should('be.visible')
    cy.getByData(testIds.taxi_BPP_Provider_Details).should('be.visible')
  })
  it('Should Display Profile Page With all Elements', () => {
    cy.getByData(testIds.taxi_BPP_Personal_Details).should('contain.text', 'Personal Details')
    cy.getByData(testIds.taxi_BPP_Vehicle_Details).should('contain.text', 'Vehicle Details')
    cy.getByData(testIds.taxi_BPP_Provider_Details).should('contain.text', 'Provider Details')
  })
  it('Should Display My Personal Details ', () => {
    cy.getByData(testIds.taxi_BPP_Personal_Details).should('be.visible')
    cy.getByData(testIds.taxi_BPP_personal_name).should('be.visible')
    cy.getByData(testIds.taxi_BPP_personal_email).should('be.visible')
    cy.getByData(testIds.taxi_BPP_personal_phone).should('be.visible')
    cy.getByData(testIds.taxi_BPP_personal_name).should('contain.text', profileDetails.user_details.name)
    cy.getByData(testIds.taxi_BPP_personal_email).should('contain.text', profileDetails.user_details.email)
    cy.getByData(testIds.taxi_BPP_personal_phone).should('contain.text', profileDetails.user_details.phone_number)
  })
  it('Should Display Vehicle Details ', () => {
    cy.getByData(testIds.taxi_BPP_Vehicle_Details).should('be.visible')
    cy.getByData(testIds.taxi_BPP_vehicle_registration).should('be.visible')
    cy.getByData(testIds.taxi_BPP_vehicle_make).should('be.visible')
    cy.getByData(testIds.taxi_BPP_vehicle_model).should('be.visible')
    cy.getByData(testIds.taxi_BPP_vehicle_power_source).should('be.visible')
    cy.getByData(testIds.taxi_BPP_vehicle_registration).should(
      'contain.text',
      profileDetails.vehicle_details.registration_no
    )
    cy.getByData(testIds.taxi_BPP_vehicle_make).should('contain.text', profileDetails.vehicle_details.vehicle_make)
    cy.getByData(testIds.taxi_BPP_vehicle_model).should('contain.text', profileDetails.vehicle_details.vehicle_model)
    cy.getByData(testIds.taxi_BPP_vehicle_power_source).should(
      'contain.text',
      profileDetails.vehicle_details.power_source
    )
  })
  it('Should Display Provider Details', () => {
    cy.getByData(testIds.taxi_BPP_Provider_Details).should('be.visible')
    cy.getByData(testIds.taxi_BPP_provider_name).should('be.visible')
    cy.getByData(testIds.taxi_BPP_provider_short_desc).should('be.visible')
    cy.getByData(testIds.taxi_BPP_provider_rating).should('be.visible')
    cy.getByData(testIds.taxi_BPP_provider_name).should('contain.text', profileDetails.provider_details.name)
    cy.getByData(testIds.taxi_BPP_provider_short_desc).should(
      'contain.text',
      profileDetails.provider_details.short_desc
    )
    cy.getByData(testIds.taxi_BPP_provider_rating).should('contain.text', profileDetails.provider_details.rating)
  })
})
