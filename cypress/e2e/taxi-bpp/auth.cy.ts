import { testIds } from '../../../shared/dataTestIds'

describe('Check Auth flow for Taxi-BPP', () => {
  context('Signin flow', () => {
    beforeEach(() => {
      cy.visit(testIds.url_base)
    })

    it('should display the sign-in form with email and password fields', () => {
      cy.getByData('input-email').should('exist').and('be.visible')
      cy.getByData('input-password').should('exist').and('be.visible')
    })

    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData('login-button').should('be.disabled')
    })

    it('should update email and password fields when typed into', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-email').should('have.value', testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_validPassword)
      cy.getByData('input-password').should('have.value', testIds.user_validPassword)
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_validPassword)
      cy.getByData('login-button').should('not.be.disabled')
    })

    it('should show error toast on unsuccessful login', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_invalidPassword)
      cy.getByData('login-button').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!Wrong Password')
    })

    it('should redirect to homePage and have token in cookie on successful login', () => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.url().should('include', testIds.url_home)
      cy.getCookie('authToken').should('exist')
    })
  })
})
