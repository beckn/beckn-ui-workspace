import { testIds } from '../../../shared/dataTestIds'
describe('Apply Job Prefilled Page', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.dsep_user_login, testIds.user_password)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.myJob_text).click()
    cy.intercept('GET', '**/orders?filters[category]=3', {
      fixture: 'DSEP/MyJobOrderHistory/emptyJobOrderResponse.json'
    }).as('emptyJobOrderResponse')
    cy.getByData(testIds.jobOrder_history_card).eq(1).click()
    cy.url().should('include', '/applyJobsPrefilled')
    cy.intercept('GET', '**/api/profiles?populate[0]=documents.attachment', {
      fixture: '/DSEP/MyJobOrderHistory/profilePopulateCertificate.json'
    }).as('profilePopulateNoCertificate')
    cy.intercept('GET', '**/api/orders/2083?populate[0]=3', {
      fixture: '/DSEP/MyJobOrderHistory/orderProfilePopulate.json'
    }).as('orderProfilePopulate.json')
  })
  it('Should render Apply Job Prefilled Page', () => {
    cy.getByData(testIds.applyJobPrefilled_Name).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_Status_container).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_Contact).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_UserName).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_UserPhone).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_UserEmail).should('be.visible')
  })
  it('Should Render Apply Job Prefilled Page if Certificate and resume is avilable', () => {
    cy.getByData(testIds.applyJobPrefilled_certificates).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_document_name).should('be.visible')
    cy.getByData(testIds.applyJobPrefilled_document_image).should('be.visible')
  })
})
