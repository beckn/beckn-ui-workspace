import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/DSEP/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/DSEP/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/DSEP/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/DSEP/orderDetails/statusResponse'
import 'cypress-file-upload'

describe.only('Job Submitted Page', () => {
  const searchTerm = 'Java'
  context('should render Job Search Page when user click on search more jobs button', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.performSearch(searchTerm, {
        fixture: 'DSEP/searchPage/searchResults.json'
      })
      cy.performSelect({ fixture: 'DSEP/checkoutPage/selectResponse.json' }, 'selectResponse')
      cy.selectProduct(0)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.cartButton).click()
      cy.wait('@selectResponse')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
      cy.getByData(testIds.feedback).getByData('close').click()
      cy.intercept('GET', '**/api/profiles?populate[0]=documents.attachment', {
        fixture: 'DSEP/checkoutPage/profilePopulate.json'
      }).as('getProfilePopulate')
      cy.url().should('include', '/checkoutPage')
      cy.fillAndSaveShippingDetails()
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.performStatus(statusResponse('PAYMENT_RECEIVED'), 'processStatusResponse')
      cy.wait('@confirmResponse')
      cy.wait('@orderResponse')
      cy.url().should('include', '/orderConfirmation')
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.wait('@processStatusResponse')
      cy.getByData(testIds.job_main_container_job_search_link).click()
      cy.intercept('POST', 'https://bap-gcl-prod.becknprotocol.io/search', {
        fixture: 'DSEP/jobSearchResponse/jobSearchResponse.json'
      }).as('jobSearchResponse')
      cy.url().should('include', '/jobSearch')
      cy.getByData('job-detail-link').eq(1).click()
      cy.url().should('include', '/jobDetails?jobDetails')
      cy.getByData(testIds.job_details_apply).click()
      cy.intercept('GET', '**/api/profiles?populate[0]=documents.attachment', {
        fixture: 'DSEP/jobApply/profilePopulate.json'
      }).as('profilePopulate')
      cy.intercept('POST', '**/select', {
        fixture: 'DSEP/jobApply/selectResponse.json'
      }).as('selectResponse')
      cy.intercept('POST', '**/init', {
        fixture: 'DSEP/jobApply/initResponse.json'
      }).as('initResponse')
      cy.url().should('include', '/jobApply?jobDetails')
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.fillDSEPJobApply()
      cy.url().should('include', '/applicationSent')
    })
    it('should display job submitted details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'Application Submitted!')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should(
        'contain.text',
        'The company will evaluate your application and get back to you soon'
      )
    })
    it('should have a button to search more jobs and navigate to job search page when clicked', () => {
      cy.getByData(testIds.jobSubmitted_viewNewJob).click()
      cy.url().should('include', '/jobSearch')
    })
  })
  context('should render Home Page when user click on go back home button', () => {
    before(() => {
      cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.performSearch(searchTerm, {
        fixture: 'DSEP/searchPage/searchResults.json'
      })
      cy.performSelect({ fixture: 'DSEP/checkoutPage/selectResponse.json' }, 'selectResponse')
      cy.selectProduct(0)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.cartButton).click()
      cy.wait('@selectResponse')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
      cy.getByData(testIds.feedback).getByData('close').click()
      cy.intercept('GET', '**/api/profiles?populate[0]=documents.attachment', {
        fixture: 'DSEP/checkoutPage/profilePopulate.json'
      }).as('getProfilePopulate')
      cy.url().should('include', '/checkoutPage')
      cy.fillAndSaveShippingDetails()
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.performStatus(statusResponse('PAYMENT_RECEIVED'), 'processStatusResponse')
      cy.wait('@confirmResponse')
      cy.wait('@orderResponse')
      cy.url().should('include', '/orderConfirmation')
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.wait('@processStatusResponse')
      cy.getByData(testIds.job_main_container_job_search_link).click()
      cy.intercept('POST', 'https://bap-gcl-prod.becknprotocol.io/search', {
        fixture: 'DSEP/jobSearchResponse/jobSearchResponse.json'
      }).as('jobSearchResponse')
      cy.url().should('include', '/jobSearch')
      cy.getByData('job-detail-link').eq(1).click()
      cy.url().should('include', '/jobDetails?jobDetails')
      cy.getByData(testIds.job_details_apply).click()
      cy.intercept('GET', '**/api/profiles?populate[0]=documents.attachment', {
        fixture: 'DSEP/jobApply/profilePopulate.json'
      }).as('profilePopulate')
      cy.intercept('POST', '**/select', {
        fixture: 'DSEP/jobApply/selectResponse.json'
      }).as('selectResponse')
      cy.intercept('POST', '**/init', {
        fixture: 'DSEP/jobApply/initResponse.json'
      }).as('initResponse')
      cy.url().should('include', '/jobApply?jobDetails')
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.fillDSEPJobApply()
      cy.url().should('include', '/applicationSent')
    })

    it('should have a button to go back home and navigate to home page when clicked', () => {
      cy.getByData(testIds.jobSubmitted_viewToHomePage).click()
      cy.url().should('include', '/')
    })
  })
})
