import { testIds } from '../../../shared/dataTestIds'

describe('My Trades Page ', () => {
  context('Consumer My Trades Page Flow', () => {
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
    })

    context('Should render no Trades Page when no Response in Trades', () => {
      it('should display Empty Page  My Trades page', () => {
        cy.visit(`${testIds.url_base}${'/myTrades'}`)
        cy.intercept('GET', '/beckn-trade-bap/trade', {
          fixture: 'OpenSpark/myTrade/myEmptyTrades.json'
        }).as('emptyTrades')
        cy.wait('@emptyTrades')
        cy.getByData('no_Trade_Found').should('be.visible')
        cy.getByData('no_Trade_Found').should('contain.text', 'No trade history found.')
      })
    })
    context('Should render My Trades Page when Response in Trades', () => {
      it('should display My Trades page', () => {
        cy.visit(`${testIds.url_base}${'/myTrades'}`)
        cy.intercept('GET', '/beckn-trade-bap/trade', {
          fixture: 'OpenSpark/myTrade/myTrades.json'
        }).as('myTrades')
        cy.wait('@myTrades')
        cy.getByData('trade_quantity').should('be.visible')
        cy.getByData('trade_orderId').should('be.visible')
        cy.getByData('trade_Time').should('be.visible')
      })
      it('should display Pending Status', () => {
        cy.getByData('trade-status').eq(0).should('be.visible')
        cy.getByData('trade-status').eq(0).should('contain.text', 'In progress')
      })
      it('should display Success Status', () => {
        cy.getByData('trade-status').eq(1).should('be.visible')
        cy.getByData('trade-status').eq(1).should('contain.text', 'Success')
      })

      it('should Navigate to tradeDetails page when click on 1st Trade', () => {
        cy.getByData('trades_card_click').eq(0).click()
        cy.intercept('GET', '/beckn-trade-bap/trade', {
          fixture: 'OpenSpark/myTrade/tradeDetails.json'
        }).as('tradeDetails')
        cy.url().should('include', '/tradeDetails')
      })
    })
  })
  context('Produser My Trades Page Flow', () => {
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
    })

    context('Should render no Trades Page when no Response in Trades', () => {
      it('should display Empty Page  My Trades page', () => {
        cy.visit(`${testIds.url_base}${'/myTrades'}`)
        cy.intercept('GET', '/beckn-trade-bpp/trade', {
          fixture: 'OpenSpark/myTrade/myEmptyTrades.json'
        }).as('emptyTrades')
        cy.wait('@emptyTrades')
        cy.getByData('no_Trade_Found').should('be.visible')
        cy.getByData('no_Trade_Found').should('contain.text', 'No trade history found.')
      })
    })
    context('Should render My Trades Page when Response in Trades', () => {
      it('should display My Trades page', () => {
        cy.visit(`${testIds.url_base}${'/myTrades'}`)
        cy.intercept('GET', '/beckn-trade-bpp/trade', {
          fixture: 'OpenSpark/myTrade/myTradeProducer.json'
        }).as('myTradeProducer')
        cy.wait('@myTradeProducer')
        cy.getByData('trade_quantity').should('be.visible')
        cy.getByData('trade_orderId').should('be.visible')
        cy.getByData('trade_Time').should('be.visible')
        cy.getByData('trade_price').should('be.visible')
      })
      it('should display Success Status', () => {
        cy.getByData('trade-status').eq(1).should('be.visible')
        cy.getByData('trade-status').eq(1).should('contain.text', 'Success')
      })

      it('should Navigate to tradeDetails page when click on 1st trade', () => {
        cy.getByData('trades_card_click').eq(0).click()
        cy.intercept('GET', '/beckn-trade-bap/trade', {
          fixture: 'OpenSpark/myTrade/producerTradeDetails.json'
        }).as('producerTradeDetails')
        cy.url().should('include', '/tradeDetails')
      })
    })
  })
})
