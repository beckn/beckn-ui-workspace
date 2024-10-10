import { testIds } from '../../../shared/dataTestIds'
import 'cypress-file-upload'
describe('Scholarship search page', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.myScholarship_text).click()
    cy.intercept('GET', '**/orders?filters[category]=2', {
      fixture: 'DSEP/myScholarshipOrder/myScholarshipOrderResponse.json'
    }).as('myScholarshipOrderResponse')
    cy.wait(1000)
    cy.getByData(testIds.scholarshipCardButton).click()
    cy.intercept('POST', '**/search', {
      fixture: 'DSEP/myScholarshipOrder/scholarshipSearchResult.json'
    }).as('scholarshipSearchResult')
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', '/scholarshipSearchPage')
    cy.getByData(testIds.search_card_link).eq(0).click()
    cy.url().should('include', '/scholarshipDetailsPage')
    cy.getByData(testIds.scholarship_details_Button).click()
    cy.intercept('POST', '**/api/profiles?populate[0]=documents.attachment', {
      fixture: 'DSEP/scholarshipApply/profilePopulate.json'
    }).as('profilePopulate')
    cy.intercept('POST', '**/select', {
      fixture: 'DSEP/scholarshipApply/selectResponse.json'
    }).as('selectResponse')
    cy.intercept('POST', '**/init', {
      fixture: 'DSEP/scholarshipApply/initResponse.json'
    }).as('initResponse')
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', '/applyScholarship')
  })
  it('Should Render Scholarship Apply Page ', () => {
    cy.get('#xinputform').should('be.visible')
    cy.get('#nameLabel').should('be.visible')
    cy.get('#mobileLabel').should('be.visible')
    cy.get('#emailLabel').should('be.visible')
    cy.get('#reasonLabel').should('be.visible')
    cy.get('#reasonLabel').should('be.visible')
    cy.get('#zipcodeLabel').should('be.visible')
    cy.get('#submitButton').should('be.visible')
  })

  it('Should Validate Apply Scholarship page With non Valid data', () => {
    cy.get('#name').type('1')
    cy.get('#nameError').should('contain.text', 'Please enter a valid name.')
    cy.get('#mobile').type('609')
    cy.get('#mobileError').should('contain.text', 'Please enter a valid 10-digit mobile number.')
    cy.get('#email').type('santosh.k@gmail')
    cy.get('#emailError').should('contain.text', 'Please enter a valid email address.')
    cy.get('#zipcode').type('123')
    cy.get('#zipcodeError').should('contain.text', 'Please enter a valid zip code.')
    cy.get('#submitButton').should('be.disabled')
  })
  it('Should Render Scholarship Apply page With Valid data and navigate to Scholarship Confirmation page ', () => {
    cy.fillDSEP_x_inputScholarshipApplyForm()
    cy.intercept('POST', '**/x-input/submit', {
      fixture: 'DSEP/scholarshipApply/x-inputSubmitResponse.json'
    }).as('x-inputSubmitResponse')
    cy.wait(1000)
    cy.url().should('include', '/scholarshipConfirmationPage')
  })
})
