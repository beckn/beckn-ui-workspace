import { testIds } from '../../../shared/dataTestIds'
describe('Admin Flow', () => {
  context('Should Render Empty admin page when there is no response in get pending trades', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_admin_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_admin_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_admin_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_admin_flow)
      cy.getByData(testIds.auth_loginButton).click()
    })
    it('should render empty admin page ', () => {
      cy.url().should('include', testIds.url_home)
      cy.intercept('GET', '/beckn-trade-bap/get-pending-trades', {
        fixture: 'OpenSpark/myTrade/get-pending-empty-trades.json'
      }).as('emptyPendingTrade')
      cy.wait('@emptyPendingTrade')
    })
    it('should render lock demand button diabled  ', () => {
      cy.getByData(testIds.total_aggregated_lock_demand).should('be.disabled')
      cy.getByData(testIds.total_aggregated_demand).should('be.visible')
      cy.getByData(testIds.total_aggregated_table).should('be.visible')
      cy.getByData(testIds.total_aggregated_table_head).should('be.visible')
      cy.getByData('noRows').should('be.visible')
      cy.getByData('noRows').should('contain.text', 'No rows')
    })
  })
  context('Should Render admin page when there is response in get pending trades', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_admin_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_admin_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_admin_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_admin_flow)
      cy.getByData(testIds.auth_loginButton).click()
    })
    it('should render admin page ', () => {
      cy.url().should('include', testIds.url_home)
      cy.intercept('GET', '/beckn-trade-bap/get-pending-trades', {
        fixture: 'OpenSpark/myTrade/get-pending-trades.json'
      }).as('getPendingTrade')
      cy.wait('@getPendingTrade')
    })
    it('should display all the fields and button', () => {
      cy.getByData(testIds.total_aggregated_demand).should('be.visible')
      cy.getByData(testIds.total_aggregated_table).should('be.visible')
      cy.getByData(testIds.total_aggregated_table_head).should('be.visible')
      cy.getByData(testIds.total_aggregated_table_row).should('be.visible')
      cy.getByData(testIds.total_aggregated_table_unit).should('be.visible')
      cy.getByData(testIds.total_aggregated_table_consumer).should('be.visible')
      cy.getByData(testIds.total_aggregated_table_date).should('be.visible')
      cy.getByData(testIds.total_aggregated_item_quantity).should('be.visible')
      cy.getByData(testIds.total_aggregated_item_name).should('be.visible')
      cy.getByData(testIds.total_aggregated_item_date).should('be.visible')
      cy.getByData(testIds.total_aggregated_nav_img).should('be.visible')
      cy.getByData(testIds.total_aggregated_lock_demand).should('be.visible')
    })
    it('should render lock demand button enable and user click it for lock demand ', () => {
      cy.intercept('POST', '/beckn-trade-bap/start-trade', {
        fixture: 'OpenSpark/myTrade/start-trade.json'
      }).as('start-trade')
      cy.getByData(testIds.total_aggregated_lock_demand).click()
      cy.wait('@start-trade')
      cy.intercept('GET', '/beckn-trade-bap/get-pending-trades', {
        fixture: 'OpenSpark/myTrade/get-pending-empty-trades.json'
      }).as('emptyPendingTrade')
      cy.visit(testIds.url_base)
    })
  })
})
