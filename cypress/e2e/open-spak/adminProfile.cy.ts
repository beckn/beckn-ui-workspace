import { testIds } from '../../../shared/dataTestIds'

describe('Admin Profile Page ', () => {
  context('Admin Profile Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_admin_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_admin_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
    })
    it('should display Consumer profile page', () => {
      cy.intercept('GET', '/user-profile', {
        fixture: 'OpenSpark/profile/adminProfile.json'
      }).as('adminProfile')
      cy.getByData(testIds.profile_inputName).should('be.disabled')
      cy.getByData(testIds.profile_address).should('be.disabled')
    })
    it('should visible profile page input after click on edit button', () => {
      cy.getByData(testIds.edit_icon).click()
      cy.getByData(testIds.profile_inputName).should('be.visible')
      cy.getByData(testIds.profile_address).should('be.visible')
    })
    it('should edit Profile page data click on edit button', () => {
      cy.getByData(testIds.edit_icon).click()
      cy.getByData(testIds.profile_inputName).clear().type('leeza Saheb')
      cy.getByData(testIds.profile_address).clear().type('pune pirangut')
    })
  })
})
