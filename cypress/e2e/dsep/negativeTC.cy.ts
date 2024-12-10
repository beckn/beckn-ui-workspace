import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_dsep_url_base)
  })
  context('Authentication Scenarios', () => {
    // Sign In Page
    it('should display the sign-in form elements and handle form submission states', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')

      // Check if the sign-in and sign-up buttons exist and are visible
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')

      // Check if the sign-in button is disabled when form is submitted with empty fields
      cy.getByData(testIds.auth_loginButton).should('be.disabled')

      // Check if the sign-up button is enabled
      cy.getByData(testIds.auth_registerButton).should('be.enabled')
    })
    // Invalid login scenarios
    it('should handle various invalid login scenarios', () => {
      const invalidEmail = 'invalid.com'
      const invalidPassword = 'password'
      const unregisteredEmail = 'unregistered@example.com'
      const unregisteredPassword = 'unreg@Pass123'

      // Scenario 1: Invalid email and password
      cy.getByData(testIds.auth_inputEmail).clear().type(invalidEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(invalidPassword)
      cy.getByData(testIds.auth_loginButton).should('be.disabled')

      // Scenario 2: Invalid password with valid email
      cy.getByData(testIds.auth_inputEmail).clear().type(testIds.user_validEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(testIds.user_invalidPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')

      // Scenario 3: Unregistered email and password
      cy.getByData(testIds.auth_inputEmail).clear().type(unregisteredEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(unregisteredPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')
    })
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
  })
  context('Search using invalid keyword', () => {
    it('should perform search', () => {
      cy.getByData(testIds.searchInput).clear().type('cake')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', `${testIds.url_search}?searchTerm=cake`)
      cy.wait(16000)
    })
    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })
  })
  context('Should Logout from app', () => {
    it('Should Logout from app', () => {
      cy.getByData(testIds.home_icon).click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text).click()
    })
  })
})
