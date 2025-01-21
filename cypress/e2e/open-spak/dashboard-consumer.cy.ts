import { testIds } from '../../../shared/dataTestIds'

describe('Check Dashboard for consumer flow with Empty Trade', () => {
  context('Dashboard for consumer flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.intercept('GET', '**/trade', {
        fixture: 'OpenSpark/myTrade/emptyTrade.json'
      }).as('tradeCall')
      cy.wait('@tradeCall')
    })

    it('should display all the fields and button', () => {
      cy.getByData(testIds.total_energy_text).should('be.visible')
      cy.getByData(testIds.total_energy_input).should('be.visible')
      cy.getByData(testIds.total_energy_unit).should('be.visible')
      cy.getByData(testIds.custom_date_input).should('be.visible')
      cy.getByData(testIds.custom_date_icon).should('be.visible')
      cy.getByData(testIds.total_energy_unit_text).should('be.visible')
      cy.getByData(testIds.total_energy_unit_input).should('be.visible')
      cy.getByData(testIds.total_energy_unit_unit).should('be.visible')
      cy.getByData(testIds.current_trade).should('be.visible')
      cy.getByData('empty-trade-img').should('be.visible')
      cy.getByData('no-trade-found').should('be.visible')
      cy.getByData('emptyCurrentText').should('be.visible')
    })
    it('should click on the date button', () => {
      cy.getByData(testIds.custom_date_icon).click()
      cy.contains('This week').should('be.visible').click()
      cy.getByData('custom_date_save_btn').click()
    })
    it('should click buy preference ', () => {
      cy.getByData('buy-preference').click()
      cy.url().should('include', 'buyingPreference')
    })
  })
})
describe('Check Dashboard for consumer flow with valid Trade', () => {
  context('Dashboard for consumer flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputEmail).should('have.value', testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).should('have.value', testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.intercept('GET', '**/trade', {
        fixture: 'OpenSpark/myTrade/trade.json'
      }).as('tradeCall')
      cy.wait('@tradeCall')
    })

    it('should display all the fields and button', () => {
      cy.getByData(testIds.total_energy_text).should('be.visible')
      cy.getByData(testIds.total_energy_input).should('be.visible')
      cy.getByData(testIds.total_energy_unit).should('be.visible')
      cy.getByData(testIds.custom_date_input).should('be.visible')
      cy.getByData(testIds.custom_date_icon).should('be.visible')
      cy.getByData(testIds.total_energy_unit_text).should('be.visible')
      cy.getByData(testIds.total_energy_unit_input).should('be.visible')
      cy.getByData(testIds.total_energy_unit_unit).should('be.visible')
      cy.getByData(testIds.current_trade).should('be.visible')
      //   cy.getByData(testIds.loader_with_mssg).should('be.visible')
      cy.getByData(testIds.currentTrade_input).should('be.visible')
      cy.getByData(testIds.currentTrade_symbol).should('be.visible')
      cy.getByData(testIds.current_trade_edit_btn).should('be.visible')
      //   cy.getByData(testIds.preferencesTags_text).should('be.visible')
      //   cy.getByData(testIds.preferencesTags_tags_label).should('be.visible')
      cy.getByData(testIds.current_status).should('be.visible')
      cy.getByData(testIds.current_status_trade).should('be.visible')
      cy.getByData(testIds.current_trade_order_status_name).should('be.visible')
      //   cy.getByData(testIds.current_trade_order_status_discription).should('be.visible')
      cy.getByData(testIds.current_trade_order_status_time).should('be.visible')
    })
    it('should verify that all input fields have values', () => {
      cy.getByData(testIds.total_energy_input).invoke('val').should('not.be.empty')
      cy.getByData(testIds.custom_date_input).invoke('val').should('not.be.empty')
      cy.getByData(testIds.total_energy_unit_input).invoke('val').should('not.be.empty')
      cy.getByData(testIds.currentTrade_input).invoke('val').should('not.be.empty')
    })
    it('should click date button', () => {
      cy.getByData(testIds.custom_date_icon).click()
      cy.contains('This week').should('be.visible').click()
      cy.getByData('custom_date_save_btn').click()
    })
    it('should click on the edit preference button', () => {
      cy.getByData(testIds.current_trade_edit_btn).click()
      cy.go('back')
    })
    it('should click buy preference ', () => {
      cy.getByData('buy-preference').click()
      cy.url().should('include', 'buyingPreference')
    })
  })
})
