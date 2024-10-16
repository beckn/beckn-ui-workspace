import { testIds } from '../../../shared/dataTestIds'
describe('My Job Order History Page', () => {
  context('Show empty Job page when there is no order response for Job Order history page', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_firstTimeLoginvalidEmail, testIds.user_firstTimeLoginvalidPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.myJob_text).click()
      cy.intercept('GET', '**/orders?filters[category]=3', {
        fixture: 'DSEP/MyJobOrderHistory/emptyJobOrderResponse.json'
      }).as('emptyJobOrderResponse')
    })
    it('Should render Empty Job Page ', () => {
      cy.getByData(testIds.cartpage_emptyImage).should('be.visible')
      cy.getByData(testIds.noJobs).should('be.visible')
      cy.getByData(testIds.noJobSubText).should('be.visible')
      cy.getByData(testIds.searchJobButton).should('be.visible')
    })
    it('Should Navigate to Homepage Page when Click on Go back to Button', () => {
      cy.getByData(testIds.noJobs).should('contain.text', 'No Jobs!')
      cy.getByData(testIds.noJobSubText).should('contain.text', 'Looks like you haven’t applied for any Jobs!')
      cy.getByData(testIds.searchJobButton).click()
      cy.url().should('include', '/')
    })
  })
  context('Show myJobsOrderHistory when there is order response for Job History page', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.myJob_text).click()
      cy.intercept('GET', '**/orders?filters[category]=3', {
        fixture: 'DSEP/MyJobOrderHistory/myJobOrderHistory.json'
      }).as('myJobOrderResponse')
    })

    it('Should render MyJobOrderHistory Page All Elements', () => {
      cy.getByData(testIds.jobCardHeading).eq(1).should('be.visible')
      cy.getByData(testIds.jobCardTime).eq(1).should('be.visible')
      cy.getByData(testIds.image_container_forJob_action).eq(1).should('be.visible')
    })
    it('Should render MyJobOrderHistory Page', () => {
      cy.getByData(testIds.jobCardHeading).eq(1).should('contain.text', 'Data Analyst - PWC')
      cy.getByData(testIds.jobCardTime).eq(1).should('contain.text', 'Applied on 9th Oct 2024, 2:20pm')
    })
    it('Should Navigate to applyJobsPrefilled page when click on 1st card', () => {
      cy.getByData(testIds.jobOrder_history_card).eq(1).click()
      cy.url().should('include', '/applyJobsPrefilled')
    })
  })
})
