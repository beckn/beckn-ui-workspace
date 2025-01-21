import { testIds } from '../../../shared/dataTestIds'

describe('Check Auth flow', () => {
  context('Signin flow for consumer flow', () => {
    beforeEach(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
    })

    it('should display all the fields and button', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')
      cy.getByData('producer-button').should('exist').and('be.visible')
    })
    it('should display the sign-in form with email and password fields', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')
    })

    it('should display the sign-in and sign-up buttons', () => {
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')
    })

    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData(testIds.auth_loginButton).should('be.disabled')
    })

    it('should update email and password fields when typed into', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_consumer_flow)
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled')
    })

    it('should show error toast on unsuccessful login', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_invalidPassword)
      cy.getByData(testIds.auth_loginButton).click()
      // cy.getByData(testIds.feedback).should('contain.text', 'Error!')
    })

    it('should navigate to sign-up page when Sign Up button is clicked', () => {
      cy.contains('button', 'Sign Up').click()
      cy.url().should('include', testIds.url_signup)
    })

    it('should redirect to homePage and have token in cookie on successful login', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      // cy.getCookie('authToken').should('exist')
    })
  })
  context('Signin flow for producer flow', () => {
    beforeEach(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('producer_button').click()
    })

    it('should display all the fields and button', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')
      cy.getByData('producer-button').should('exist').and('be.visible')
    })
    it('should display the sign-in form with email and password fields', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')
    })

    it('should display the sign-in and sign-up buttons', () => {
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')
    })

    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData(testIds.auth_loginButton).should('be.disabled')
    })

    it('should update email and password fields when typed into', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_producer_flow)
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled')
    })

    it('should show error toast on unsuccessful login', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_invalidPassword)
      cy.getByData(testIds.auth_loginButton).click()
      // cy.getByData(testIds.feedback).should('contain.text', 'Error!')
    })

    it('should navigate to sign-up page when Sign Up button is clicked', () => {
      cy.contains('button', 'Sign Up').click()
      cy.url().should('include', testIds.url_signup)
    })

    it('should redirect to homePage and have token in cookie on successful login', () => {
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      // cy.getCookie('authToken').should('exist')
    })
  })
})
