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
  })
  it('Should Render Scholarship Search Page ', () => {
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', '/scholarshipSearchPage')
    cy.getByData(testIds.search_card_Name).eq(0).should('be.visible')
    cy.getByData(testIds.search_Card_long_desc).eq(0).should('be.visible')
    cy.getByData(testIds.search_card_providerName).eq(0).should('be.visible')
  })
  it('Should Render Scholarship Search Page All Elements', () => {
    cy.getByData(testIds.search_card_Name).eq(0).should('contain.text', 'MS Ramaiah Memorial Scholarship')
    cy.getByData(testIds.search_Card_long_desc)
      .eq(0)
      .should(
        'contain.text',
        'Scholarship Details:\nScholarship amount: Rs. 50,000 scholarship overall\n\nEligibility criteria: CAT/XAT Scores grater than or equal to 80% percentile, and MAT Scores greater than or equal to 90% percentile + throughout 1st division in 10th, 12th and UG'
      )
    cy.getByData(testIds.search_card_providerName)
      .eq(0)
      .should('contain.text', 'By: MS Ramaiah University of Applied Sciences')
  })
  it('Should Navigate to scholarshipDetailsPage when click on 1st Card', () => {
    cy.getByData(testIds.search_card_link).eq(0).click()
    cy.url().should('include', '/scholarshipDetailsPage')
  })
})
