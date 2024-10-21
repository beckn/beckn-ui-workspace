import { testIds } from '../../../shared/dataTestIds'

describe('HomePage for Policy Admin Portal', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.intercept('GET', '**/policy-api/dashboard', {
      fixture: 'POLICYADMIN/Homepage/dashboard.json'
    }).as('dashboardApi')
    cy.intercept('GET', '**/policy-api/policy?start=0&limit=10', {
      fixture: 'POLICYADMIN/Homepage/policy_start.json'
    }).as('policy_startApi')
    cy.url().should('include', testIds.url_home)
  })

  it('should Render Homepage Status Card and check should be visible or not', () => {
    cy.getByData('active').should('exist').and('be.visible')
    cy.getByData('Inactive').should('exist').and('be.visible')
    cy.getByData('Published').should('exist').and('be.visible')
  })
  it('should Render Homepage Status Card and check should all element', () => {
    cy.getByData('Active').should('contain.text', 'Active')
    cy.getByData('Inactive').should('contain.text', 'Inactive')
    cy.getByData('Published').should('contain.text', 'Published')
  })
  it('should Render all tabs on Homepage', () => {
    cy.getByData(`tablist_name${'All'}`).eq(0).should('contain.text', 'All')
    cy.getByData(`tablist_name${'Active'}`).eq(0).should('contain.text', 'Active')
    cy.getByData(`tablist_name${'Inactive'}`).eq(0).should('contain.text', 'Inactive')
    cy.getByData(`tablist_name${'Published'}`).eq(0).should('contain.text', 'Published')
  })
  it('should Render all Table Heading on Homepage', () => {
    cy.getByData(testIds.data_table_title).should('be.visible', 'Title')
    cy.getByData(testIds.data_table_description).should('be.visible', 'Description')
    cy.getByData(testIds.data_table_status).should('be.visible', 'Status')
    cy.getByData(testIds.data_table_startDate).should('be.visible', 'Start Date')
    cy.getByData(testIds.data_table_endDate).should('be.visible', 'End Date')
  })

  it('should Render all Table Item on Homepage', () => {
    cy.getByData(testIds.table_item_name).should('be.visible')
    cy.getByData(testIds.table_item_description).should('be.visible')
    cy.getByData(testIds.status_data).should('be.visible', 'Status')
    cy.getByData(testIds.table_item_startDate).should('be.visible')
    cy.getByData(testIds.table_item_endDate).should('be.visible')
  })
  it('Should render By default All tab ', () => {
    cy.getByData(`tablist_name${'All'}`).eq(0).click()
    cy.getByData(testIds.status_data).should('be.visible')
  })
  it('Should render Active tab ', () => {
    cy.getByData(`tablist_name${'Active'}`).eq(0).click()
    cy.getByData(testIds.status_data).should('be.visible')
    cy.getByData(testIds.status_data).eq(0).should('contain.text', 'active')
  })
  it('Should render Inactive tab ', () => {
    cy.getByData(`tablist_name${'Inactive'}`).eq(0).click()
    cy.getByData(testIds.status_data).should('be.visible')
    cy.getByData(testIds.status_data).eq(0).should('contain.text', 'inactive')
  })
  it('Should render Published tab ', () => {
    cy.getByData(`tablist_name${'Published'}`).eq(0).click()
    cy.getByData(testIds.status_data).should('be.visible')
    cy.getByData(testIds.status_data).eq(0).should('contain.text', 'published')
  })
  it('should work pagination', () => {
    cy.getByData(`tablist_name${'All'}`).eq(0).click()
    cy.getByData(' pagination-number').should('be.visible')
    cy.getByData(' pagination-number').eq(0).click()
  })
  it('should Render CreateNewPolicy page when click on Create New Button', () => {
    cy.getByData(testIds.create_new_policy).click()
    cy.url().should('include', '/createPolicy')
  })
})
