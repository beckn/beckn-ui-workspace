import { testIds } from '../../../shared/dataTestIds'
import { profileDetails } from '../../fixtures/profile/profileDetails'

describe('Profile Page Tests', () => {
  before(() => {
    cy.login(Cypress.env('CYPRESS_BASE_URL'), testIds.user_validEmail, testIds.user_validPassword)

    cy.visit(`${Cypress.env('CYPRESS_BASE_URL')}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performProfile({ fixture: 'profile/profileResponse.json' }, 'profileResponse')
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.profile_text_click).click()
    cy.wait('@profileResponse')
  })
  it('should render profile page with profile API call', () => {
    cy.getByData(testIds.profile_inputName).should('have.value', 'ankit Brahm Bhatt')
    cy.getByData(testIds.profile_inputMobileNumber).should('have.value', '3030909080')
    cy.getByData(testIds.profile_zipCode).should('have.value', '415222')
  })
  it('should validate profile form fields', () => {
    cy.getByData(testIds.profile_form).within(() => {
      cy.getByData(testIds.profile_inputName).clear().blur()
      cy.contains('Name is required').should('be.visible')

      cy.getByData(testIds.profile_inputName).clear().type('1235').blur()
      cy.contains('Name can only contain letters and spaces').should('be.visible')

      cy.getByData(testIds.profile_inputMobileNumber).clear().type('12345').blur()
      cy.contains('Invalid Mobile Number').should('be.visible')

      cy.getByData(testIds.profile_city).clear().blur()
      cy.contains('City is Required').should('be.visible')

      cy.getByData(testIds.profile_zipCode).clear().blur()
      cy.contains('Zip Code is required').should('be.visible')

      cy.getByData(testIds.profile_zipCode).clear().type('1235').blur()
      cy.contains('Invalid Zip Code').should('be.visible')
      cy.getByData(testIds.profile_zipCode).clear().type('abcd').blur()
      cy.contains('Invalid Zip Code').should('be.visible')

      cy.getByData(testIds.profile_state).clear().blur()
      cy.contains('State is Required').should('be.visible')

      cy.getByData(testIds.profile_country).clear().blur()
      cy.contains('Country is Required').should('be.visible')

      cy.getByData(testIds.profile_saveandContinue).should('be.disabled')
    })
  })

  it('should fill and save the profile form data and Click on Save and Continue Button Navigate on homepage', () => {
    cy.getByData(testIds.profile_form).should('be.visible')

    cy.getByData(testIds.profile_form).within(() => {
      cy.getByData(testIds.profile_inputName).clear().type(profileDetails.name)
      cy.getByData(testIds.profile_inputMobileNumber).clear().type(profileDetails.mobileNumber)
      cy.getByData(testIds.profile_city).clear().type(profileDetails.city)
      cy.getByData(testIds.profile_zipCode).clear().type(profileDetails.zipCode)
      cy.getByData(testIds.profile_state).clear().type(profileDetails.state)
      cy.getByData(testIds.profile_country).clear().type(profileDetails.country)
      cy.getByData(testIds.profile_saveandContinue).click()
      cy.intercept('POST', '/profile', { fixture: 'profile/profileResponse.json' }).as('profileCall')
      cy.url().should('include', '/')
    })
  })
})
