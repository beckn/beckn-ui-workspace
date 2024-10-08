import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/DSEP/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/DSEP/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/DSEP/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/DSEP/orderDetails/statusResponse'

describe.only('Job Search Page', () => {
  const searchTerm = 'Java'

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
  })
  it('Should render job search page', () => {
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.job_name).eq(1).should('be.visible')
    cy.getByData(testIds.job_providerName).eq(1).should('be.visible')
    cy.getByData(testIds.job_cityName).eq(1).should('be.visible')
    cy.getByData(testIds.jobBy_providername).eq(1).should('be.visible')
  })
  it('Should render job search page all elements', () => {
    cy.getByData(testIds.job_name).eq(1).should('contain.text', 'Data Analyst - Analytics- Senior Analyst')
    cy.getByData(testIds.job_providerName).eq(1).should('contain.text', 'PWC')
    cy.getByData(testIds.job_cityName).eq(1).should('contain.text', 'Delhi')
    cy.getByData(testIds.jobBy_providername).eq(1).should('contain.text', 'PWC')
  })
  it('Should navigate to job details page', () => {
    cy.getByData('job-detail-link').eq(1).click()
    cy.url().should('include', '/jobDetails?jobDetails')
  })
})
