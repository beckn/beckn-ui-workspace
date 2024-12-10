import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/DSEP/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/DSEP/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/DSEP/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/DSEP/orderDetails/statusResponse'

describe.only('job Details Page', () => {
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
    cy.url().should('include', '/jobSearch')
    cy.intercept('POST', '**/search', {
      fixture: 'DSEP/jobSearchResponse/jobSearchResponse.json'
    }).as('jobSearchResponse')
    cy.wait('@jobSearchResponse')
    cy.getByData('job-detail-link').eq(1).click()
    cy.url().should('include', '/jobDetails?jobDetails')
  })
  it('Should render job details page', () => {
    cy.getByData(testIds.job_details_name).should('be.visible')
    cy.getByData(testIds.job_details_provider_name).should('be.visible')
    cy.getByData(testIds.job_details_description).should('be.visible')
  })
  it('Should render job details page by all elements', () => {
    cy.getByData(testIds.job_details_name).should('contain.text', 'Data Analyst - Analytics- Senior Analyst')
    cy.getByData(testIds.job_details_provider_name).should('contain.text', 'PWC')
    cy.getByData(testIds.job_details_description).should(
      'contain.text',
      'You will be part of the team which partners with the business leaders to provide data driven strategies to grow business KPIs like acquisition, customer engagement & retention, campaign optimization, personalized offering, etc.'
    )
  })
  it('Should navigate to job details page', () => {
    cy.getByData(testIds.job_details_apply).click()
    cy.url().should('include', '/jobApply?jobDetails')
  })
})
