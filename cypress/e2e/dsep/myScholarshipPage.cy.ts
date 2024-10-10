import { testIds } from '../../../shared/dataTestIds'
describe('My Scholarship Page', () => {
  context('Show empty page when there is no order response for scholarship page', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_firstTimeLoginvalidEmail, testIds.user_firstTimeLoginvalidPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.myScholarship_text).click()
      cy.intercept('GET', '**/orders?filters[category]=2', {
        fixture: 'DSEP/myScholarshipOrder/emptyScholarshipOrderResponse.json'
      }).as('emptyScholarshipOrderResponse')
    })
    it('Should render Empty Scholarship Search Page ', () => {
      cy.getByData(testIds.cartpage_emptyImage).should('be.visible')
      cy.getByData(testIds.noScholarship).should('be.visible')
      cy.getByData(testIds.noScholarshipText1).should('be.visible')
      cy.getByData(testIds.noScholarshipText2).should('be.visible')
      cy.getByData(testIds.emptyScholarshipButton).should('be.visible')
    })
    it('Should Navigate to My Scholarship Page when Click on Button', () => {
      cy.getByData(testIds.noScholarship).should('contain.text', 'No Scholarship!')
      cy.getByData(testIds.noScholarshipText1).should('contain.text', 'Look like you haven’t applied for any')
      cy.getByData(testIds.noScholarshipText2).should('contain.text', 'Scholarship!')
      cy.getByData(testIds.emptyScholarshipButton).click()
      cy.url().should('include', '/scholarshipSearchPage')
    })
  })
  context('Show Search Page when there is order response for scholarship page', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.myScholarship_text).click()
      cy.intercept('GET', '**/orders?filters[category]=2', {
        fixture: 'DSEP/myScholarshipOrder/myScholarshipOrderResponse.json'
      }).as('myScholarshipOrderResponse')
    })

    it('Should render My Scholarship Page All Elements', () => {
      cy.getByData(testIds.scholarshipCardHeading).eq(1).should('be.visible')
      cy.getByData(testIds.scholarshipCardTime).eq(1).should('be.visible')
      cy.getByData(testIds.scholarshipCardID).eq(1).should('be.visible')
      cy.getByData(testIds.scholarshipCardButton).should('be.visible')
    })
    it('Should render My Scholarship Page', () => {
      cy.getByData(testIds.scholarshipCardHeading).eq(1).should('contain.text', 'MS Ramaiah Memorial Scholarship')
      cy.getByData(testIds.scholarshipCardTime).eq(1).should('contain.text', '27th May 2024, 10:36pm')
      cy.getByData(testIds.scholarshipCardID).eq(1).should('contain.text', 'ID: 1338')
    })
    it('Should Navigate to scholarship Search page', () => {
      cy.getByData(testIds.scholarshipCardButton).click()
      cy.intercept('POST', '**/search', {
        fixture: 'DSEP/myScholarshipOrder/scholarshipSearchResult.json'
      }).as('scholarshipSearchResult')
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', '/scholarshipSearchPage')
    })
  })
})
