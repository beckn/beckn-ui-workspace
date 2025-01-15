import { testIds } from '../../../shared/dataTestIds'

describe('Check Welcome page for Open Spark', () => {
  context(' Welcome page for consumer flow', () => {
    beforeEach(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
    })
    beforeEach(() => {
      cy.visit(testIds.url_base)
    })

    it('should display the welcome page with consumer and producer flow', () => {
      cy.getByData(testIds.open_spark_img).should('be.visible')
      cy.getByData(testIds.open_spark_welcome_text).should('be.visible')
      cy.getByData('consumer_button').should('be.visible')
      cy.getByData('producer_button').should('be.visible')
    })

    it('should display the i am consumer and i am producer button', () => {
      cy.getByData('consumer_button').should('be.visible')
      cy.getByData('producer_button').should('be.visible')
    })

    it('should  navigate to auth page when click on i am consumer button', () => {
      cy.getByData('consumer_button').click()
    })
  })
  context(' Welcome page for producer flow', () => {
    beforeEach(() => {
      cy.clearAllLocalStorage()
      cy.clearAllCookies()
    })
    beforeEach(() => {
      cy.visit(testIds.url_base)
    })

    it('should display the welcome page with consumer and producer flow', () => {
      cy.getByData(testIds.open_spark_img).should('be.visible')
      cy.getByData(testIds.open_spark_welcome_text).should('be.visible')
      cy.getByData('consumer_button').should('be.visible')
      cy.getByData('producer_button').should('be.visible')
    })

    it('should display the i am consumer and i am producer button', () => {
      cy.getByData('consumer_button').should('be.visible')
      cy.getByData('producer_button').should('be.visible')
    })

    it('should  navigate to auth page when click on i am consumer button', () => {
      cy.getByData('producer_button').click()
    })
  })
})
