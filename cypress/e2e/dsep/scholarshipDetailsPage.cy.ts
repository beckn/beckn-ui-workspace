import { testIds } from '../../../shared/dataTestIds'

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
  })
  it('Should Render Scholarship Details Page ', () => {
    cy.getByData(testIds.scholarship_details_item_name).should('be.visible')
    cy.getByData(testIds.scholarship_details_provider_name).should('be.visible')
    cy.getByData(testIds.scholarship_details_long_desc).should('be.visible')
    cy.getByData(testIds.scholarship_details_Button).should('be.visible')
  })
  it('Should Render Scholarship Search Page All Elements', () => {
    cy.getByData(testIds.scholarship_details_item_name).should('contain.text', 'MS Ramaiah Memorial Scholarship')
    cy.getByData(testIds.scholarship_details_provider_name).should(
      'contain.text',
      'by MS Ramaiah University of Applied Sciences'
    )
    cy.getByData(testIds.scholarship_details_long_desc).should(
      'contain.text',
      'Scholarship Details:\nScholarship amount: Rs. 50,000 scholarship overall\n\nEligibility criteria: CAT/XAT Scores grater than or equal to 80% percentile, and MAT Scores greater than or equal to 90% percentile + throughout 1st division in 10th, 12th and UG'
    )
  })
  it('Should Navigate to scholarshipDetailsPage when click on 1st Card', () => {
    cy.getByData(testIds.scholarship_details_Button).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', '/applyScholarship')
  })
})
