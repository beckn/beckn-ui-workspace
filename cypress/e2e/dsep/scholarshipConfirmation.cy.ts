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
    cy.fillDSEP_x_inputScholarshipApplyForm()
    cy.intercept('POST', '**/x-input/submit', {
      fixture: 'DSEP/scholarshipApply/x-inputSubmitResponse.json'
    }).as('x-inputSubmitResponse')
    cy.url().should('include', '/scholarshipConfirmationPage')
  })
  it('should display Scholarship Confirmation Page', () => {
    cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
    cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'Application Submitted!')
    cy.getByData(testIds.orderConfirmation_gratefulMessage).should(
      'contain.text',
      'We will evaluate your application ID'
    )
  })
  it('should navigate to Cart page when clicked On go to cart button', () => {
    cy.getByData(testIds.scholarshipConfirmation_cart).click()
    cy.url().should('include', '/cart')
  })
})
