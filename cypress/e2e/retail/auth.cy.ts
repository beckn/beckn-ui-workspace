import { Urls, UserCredentials, GeneralTestIds, AuthPageTestIds } from '../../../shared/dataTestIds'

describe('Check Auth flow', () => {
  context('Signin flow', () => {
    beforeEach(() => {
      cy.visit(Urls.baseUrl)
    })

    it('should display the sign-in form with email and password fields', () => {
      cy.getByData(AuthPageTestIds.inputEmail).should('exist').and('be.visible')
      cy.getByData(AuthPageTestIds.inputPassword).should('exist').and('be.visible')
    })

    it('should display the sign-in and sign-up buttons', () => {
      cy.getByData(AuthPageTestIds.loginButton).should('exist').and('be.visible')
      cy.getByData(AuthPageTestIds.registerButton).should('exist').and('be.visible')
    })

    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData(AuthPageTestIds.loginButton).should('be.disabled')
    })

    it('should update email and password fields when typed into', () => {
      cy.getByData(AuthPageTestIds.inputEmail).type(UserCredentials.validEmail)
      cy.getByData(AuthPageTestIds.inputEmail).should('have.value', UserCredentials.validEmail)
      cy.getByData(AuthPageTestIds.inputPassword).type(UserCredentials.validPassword)
      cy.getByData(AuthPageTestIds.inputPassword).should('have.value', UserCredentials.validPassword)
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(AuthPageTestIds.inputEmail).type(UserCredentials.validEmail)
      cy.getByData(AuthPageTestIds.inputPassword).type(UserCredentials.validPassword)
      cy.getByData(AuthPageTestIds.loginButton).should('not.be.disabled')
    })

    it('should show error toast on unsuccessful login', () => {
      cy.getByData(AuthPageTestIds.inputEmail).type(UserCredentials.validEmail)
      cy.getByData(AuthPageTestIds.inputPassword).type(UserCredentials.invalidPassword)
      cy.getByData(AuthPageTestIds.loginButton).click()
      cy.getByData(GeneralTestIds.feedback).should('contain.text', 'Error!')
    })

    it('should navigate to sign-up page when Sign Up button is clicked', () => {
      cy.contains('button', 'Sign Up').click()
      cy.url().should('eq', Urls.signupPageUrl)
    })

    it('should redirect to homePage and have token in cookie on successful login', () => {
      cy.login(Urls.baseUrl, UserCredentials.validEmail, UserCredentials.validPassword)
      cy.url().should('eq', Urls.homePageUrl)
      cy.getCookie('authToken').should('exist')
    })
  })
})
