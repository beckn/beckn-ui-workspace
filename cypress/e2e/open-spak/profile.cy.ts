import { testIds } from '../../../shared/dataTestIds'

describe('Profile Page ', () => {
  context('Consumer Profile Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
    })
    it('should display Consumer profile page', () => {
      cy.intercept('GET', '**/user-profile', {
        fixture: 'OpenSpark/profile/profile.json'
      }).as('profileCall')
      cy.wait('@profileCall')
      cy.getByData(testIds.profile_inputName).should('be.disabled')
      cy.getByData(testIds.profile_customerId).should('be.disabled')
      cy.getByData(testIds.profile_address).should('be.disabled')
    })
    it('should visible profile page input after click on edit button', () => {
      cy.getByData(testIds.edit_icon).click()
      cy.getByData(testIds.profile_inputName).should('be.visible')
      cy.getByData(testIds.profile_address).should('be.visible')
    })
    it('should edit Profile page data click on edit button', () => {
      cy.getByData(testIds.edit_icon).click()
      cy.getByData(testIds.profile_inputName).clear().type('leela tai Saheb')
      cy.getByData(testIds.profile_address).clear().type('pune pirangut')
    })
    it('should Dispaly all Navigate item on Profile page', () => {
      cy.getByData('myCredintial').should('be.visible')
      cy.getByData('myCredintial').should('contain.text', 'My Credentials')
      cy.getByData('myTrades').should('be.visible')
      cy.getByData('myTrades').should('contain.text', 'My Trades')
      cy.getByData('myDers').should('be.visible')
      cy.getByData('myDers').should('contain.text', 'My DERs')
    })
    it('should Navigate to My credintial Page When click on My Credentials', () => {
      cy.getByData('myCredintial').click()
      cy.visit(`${testIds.url_base}${'/myCredentials'}`)
    })
    it('should Navigate to My Trades Page When click on My Trades', () => {
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.getByData('myTrades').click()
      cy.visit(`${testIds.url_base}${'/myTrades'}`)
    })
    it('should Navigate to My DERsPage When click on My DERs', () => {
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.getByData('myDers').click()
      cy.visit(`${testIds.url_base}${'/myDers'}`)
    })
  })
  context('Producer Profile Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('producer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
    })
    it('should display Prosumer profile page', () => {
      cy.intercept('GET', '**/user-profile', {
        fixture: 'OpenSpark/profile/profile.json'
      }).as('profileCall')
      cy.wait('@profileCall')
      cy.getByData(testIds.profile_inputName).should('be.disabled')
      cy.getByData(testIds.profile_customerId).should('be.disabled')
      cy.getByData(testIds.profile_address).should('be.disabled')
    })
    it('should visible profile page input after click on edit button', () => {
      cy.getByData(testIds.edit_icon).click()
      cy.getByData(testIds.profile_inputName).should('be.visible')
      cy.getByData(testIds.profile_address).should('be.visible')
    })
    it('should edit Profile page data click on edit button', () => {
      cy.getByData(testIds.edit_icon).click()
      cy.getByData(testIds.profile_inputName).clear().type('liza Saheb')
      cy.getByData(testIds.profile_address).clear().type('pune ravet')
    })
    it('should Dispaly all Navigate item on Profile page', () => {
      cy.getByData('myCredintial').should('be.visible')
      cy.getByData('myCredintial').should('contain.text', 'My Credentials')
      cy.getByData('myTrades').should('be.visible')
      cy.getByData('myTrades').should('contain.text', 'My Trades')
      cy.getByData('myDers').should('be.visible')
      cy.getByData('myDers').should('contain.text', 'My DERs')
    })
    it('should Navigate to My credintial Page When click on My Credentials', () => {
      cy.getByData('myCredintial').click()
      cy.visit(`${testIds.url_base}${'/myCredentials'}`)
    })
    it('should Navigate to My Trades Page When click on My Trades', () => {
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.getByData('myTrades').click()
      cy.visit(`${testIds.url_base}${'/myTrades'}`)
    })
    it('should Navigate to My DERsPage When click on My DERs', () => {
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.getByData('myDers').click()
      cy.visit(`${testIds.url_base}${'/myDers'}`)
    })
  })
})
