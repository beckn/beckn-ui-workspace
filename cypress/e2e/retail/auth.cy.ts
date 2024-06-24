describe('Check Auth flow', () => {
  //data-ids for fetching dom
  const emailInputDataId = 'input-email'
  const passwordInputDataId = 'input-password'

  // input data for testing
  const validEmail = 'ankit@gmail.com'
  const validPassword = 'Enterthevoid@123'
  const invalidPassword = 'Enterthevoid@1234'

  const baseUrl = 'http://localhost:3002'
  const homePageUrl = 'http://localhost:3002/'
  const signupPageUrl = 'http://localhost:3002/signUp'

  context('Signin flow', () => {
    beforeEach(() => {
      cy.visit(baseUrl)
    })

    it('should display the sign-in form with email and password fields', () => {
      cy.getByData('input-email').should('exist').and('be.visible')
      cy.getByData('input-password').should('exist').and('be.visible')
    })

    it('should display the sign-in and sign-up buttons', () => {
      cy.getByData('login-button').should('exist').and('be.visible')
      cy.getByData('register-button').should('exist').and('be.visible')
    })

    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData('login-button').should('be.disabled')
    })

    it('should update email and password fields when typed into', () => {
      cy.getByData(emailInputDataId).type(validEmail)
      cy.getByData(emailInputDataId).should('have.value', validEmail)
      cy.getByData(passwordInputDataId).type(validPassword)
      cy.getByData(passwordInputDataId).should('have.value', validPassword)
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(emailInputDataId).type(validEmail)
      cy.getByData(passwordInputDataId).type(validPassword)
      cy.getByData('login-button').should('not.be.disabled')
    })

    it('should show error toast on unsuccessful login', () => {
      cy.getByData(emailInputDataId).type(validEmail)
      cy.getByData(passwordInputDataId).type(invalidPassword)
      cy.getByData('login-button').click()
      cy.getByData('feedback-toast').should('contain', 'Error') // Adjust based on actual error message
    })

    it('should navigate to sign-up page when Sign Up button is clicked', () => {
      cy.contains('button', 'Sign Up').click()
      cy.url().should('eq', signupPageUrl)
    })

    it('should redirect to homePage and have token in cookie on successful login', () => {
      cy.getByData(emailInputDataId).type(validEmail)
      cy.getByData(passwordInputDataId).type(validPassword)
      cy.getByData('login-button').click()
      cy.wait(1000)
      cy.url().should('eq', homePageUrl)
      cy.getCookie('authToken').should('exist')
    })
  })
})
