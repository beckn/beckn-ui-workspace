import { testIds } from '../../../shared/dataTestIds'

describe('My Trades Details Page ', () => {
  context('Consumer My Trades Details Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('consumer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.getByData('myTrades').click()
      cy.intercept('GET', '/beckn-trade-bap/trade', {
        fixture: 'OpenSpark/myTrade/myTrades.json'
      }).as('myTrades')
    })
    context('When viewing a specific trade with RECEIVED status', () => {
      before(() => {
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.visit(testIds.url_base)
        cy.getByData('consumer_button').click()
        cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
        cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
        cy.getByData(testIds.auth_loginButton).click()
        cy.url().should('include', testIds.url_home)
        cy.getByData(testIds.topSheet_profile_icon).click()
        cy.visit(`${testIds.url_base}${testIds.url_profile}`)
        cy.getByData('myTrades').click()
        cy.intercept('GET', '/beckn-trade-bap/trade', {
          fixture: 'OpenSpark/myTrade/myTrades.json'
        }).as('myTrades')
      })
      it('displays all required trade information fields', () => {
        cy.visit(`${testIds.url_base}/myTrades`)
        cy.getByData('trades_card_click').eq(0).click()
        cy.intercept('GET', '/beckn-trade-bap/trade?id=189', {
          fixture: 'OpenSpark/myTrade/tradeDetails.json'
        }).as('tradeDetails')
        cy.url().should('include', '/tradeDetails')
        cy.getByData(testIds.trade_details_date).should('be.visible')
        cy.getByData(testIds.currentTrade_input).should('be.visible')
        cy.getByData(testIds.trade_details_Id).should('be.visible')
      })

      it('shows correct trade status timeline with expected states', () => {
        cy.getByData('statusName').should('be.visible')
        cy.getByData('statusName').eq(0).should('contain.text', 'Buy request received')
        cy.getByData('statusName').eq(1).should('contain.text', 'Pending')
        cy.getByData('statusTime').should('be.visible')
      })
    })
    context('When viewing a specific trade with SUCCESS status', () => {
      before(() => {
        cy.clearAllLocalStorage()
        cy.clearAllLocalStorage()
        cy.clearAllCookies()
        cy.visit(testIds.url_base)
        cy.getByData('consumer_button').click()
        cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_consumer_flow)
        cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_consumer_flow)
        cy.getByData(testIds.auth_loginButton).click()
        cy.url().should('include', testIds.url_home)
        cy.getByData(testIds.topSheet_profile_icon).click()
        cy.visit(`${testIds.url_base}${testIds.url_profile}`)
        cy.getByData('myTrades').click()
        cy.intercept('GET', '/beckn-trade-bap/trade', {
          fixture: 'OpenSpark/myTrade/myTrades.json'
        }).as('myTrades')
      })
      it('should Navigate to tradeDetails page when click on 1st trade', () => {
        cy.getByData('trades_card_click').eq(1).click()
        cy.intercept('GET', '/beckn-trade-bpp/trade?id=187', {
          fixture: 'OpenSpark/myTrade/tradeDetails.json'
        }).as('tradeDetails')
        cy.url().should('include', '/tradeDetails')
      })
      it('displays all required trade information fields', () => {
        cy.getByData(testIds.trade_details_date).should('be.visible')
        cy.getByData(testIds.currentTrade_input).should('be.visible')
        cy.getByData(testIds.trade_details_Id).should('be.visible')
      })
      it('shows correct trade status timeline with expected states', () => {
        cy.getByData('statusName').should('be.visible')
        cy.getByData('statusName').eq(0).should('contain.text', 'Buy request received')
        cy.getByData('statusName').eq(1).should('contain.text', 'Searching for energy')
        cy.getByData('statusName').eq(2).should('contain.text', 'Energy Catalogue found')
        cy.getByData('statusName').eq(3).should('contain.text', 'Requesting BPP Platform Trusted Source Certificate')
        cy.getByData('statusName').eq(4).should('contain.text', 'Requested for Green warrier certificate')
        cy.getByData('statusName').eq(5).should('contain.text', 'Received credential from BAP')
        cy.getByData('statusName').eq(6).should('contain.text', 'Purchase Order sent')
        cy.getByData('statusName').eq(7).should('contain.text', 'Received Draft Order')
        cy.getByData('statusName').eq(8).should('contain.text', 'Order confirmation sent')
        cy.getByData('statusName').eq(9).should('contain.text', 'Received Order Confirmation')
        cy.getByData('statusTime').should('be.visible')
      })
    })
  })

  context('Prosumer My Trades Details Page Flow', () => {
    before(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
      cy.visit(testIds.url_base)
      cy.getByData('producer_button').click()
      cy.getByData(testIds.auth_inputEmail).type(testIds.user_validEmail_producer_flow)
      cy.getByData(testIds.auth_inputPassword).type(testIds.user_validPassword_producer_flow)
      cy.getByData(testIds.auth_loginButton).click()
      cy.url().should('include', testIds.url_home)
      cy.getByData(testIds.topSheet_profile_icon).click()
      cy.visit(`${testIds.url_base}${testIds.url_profile}`)
      cy.getByData('myTrades').click()
      cy.visit(`${testIds.url_base}${'/myTrades'}`)
      cy.intercept('GET', '/beckn-trade-bpp/trade', {
        fixture: 'OpenSpark/myTrade/myTradeProducer.json'
      }).as('myTradeProducer')
      cy.wait('@myTradeProducer')
    })
    it('should Navigate to tradeDetails page when click on 1st trade', () => {
      cy.getByData('trades_card_click').eq(0).click()
      cy.intercept('GET', '/beckn-trade-bpp/trade?id=271', {
        fixture: 'OpenSpark/myTrade/producerTradeDetails.json'
      }).as('producerTradeDetails')
      cy.url().should('include', '/tradeDetails')
    })
    it('displays all required trade information fields', () => {
      cy.getByData(testIds.trade_details_date).should('be.visible')
      cy.getByData(testIds.currentTrade_input).should('be.visible')
      cy.getByData(testIds.trade_details_Id).should('be.visible')
    })
    it('shows correct trade status timeline with expected states', () => {
      cy.getByData('statusName').should('be.visible')
      cy.getByData('statusName').eq(0).should('contain.text', 'Received purchase order')
      cy.getByData('statusName').eq(1).should('contain.text', 'Sending Order terms')
      cy.getByData('statusName').eq(2).should('contain.text', 'Order confirmation received')
      cy.getByData('statusName').eq(3).should('contain.text', 'Order Confirmation sent')
      cy.getByData('statusTime').should('be.visible')
    })
  })
})
