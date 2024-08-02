/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
// @ts-ignore
import { testIds } from '../../shared/dataTestIds'
import { RouteHandler } from 'cypress/types/net-stubbing'
import { shippingDetails } from '../fixtures/checkoutPage/userDetails'

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>
      login(baseUrl: string, email: string, password: string): Chainable<void>
      setGeolocation(aliasName: string): Chainable<void>
      performSearch(searchTerm: string, response: RouteHandler): Chainable<void>
      mockReduxState(type: string, data: Record<string, any>): Chainable<void>
      selectProduct(index: number): Chainable<void>
      selectMultiProduct(index: number[]): Chainable<void>
      performSelect(response: RouteHandler, aliasName: string, button?: string): Chainable<void>
      performInit(response: RouteHandler, aliasName: string): Chainable<void>
      fillAndSaveShippingDetails(): Chainable<void>
      performConfirm(response: RouteHandler, aliasName: string): Chainable<void>
      performOrders(response: RouteHandler, aliasName: string): Chainable<void>
      performStatus(response: RouteHandler, aliasName: string): Chainable<void>
      performTrack(response: RouteHandler, aliasName: string): Chainable<void>
      performSupport(response: RouteHandler, aliasName: string): Chainable<void>
      performProfile(response: RouteHandler, aliasName: string): Chainable<void>
      performUpdateOrder(response: RouteHandler, aliasName: string): Chainable<void>
      clearStatusMock(aliasName: string): Chainable<void>
      performOrderHisrory(response: RouteHandler, aliasName: string): Chainable<void>
      performRating(response: RouteHandler, aliasName: string): Chainable<void>
    }
  }
}

const GCL_URL = 'https://bap-gcl-**.becknprotocol.io'
const STRAPI_URL = 'https://bap-backend-**.becknprotocol.io/api'

Cypress.Commands.add('getByData', selector => {
  return cy.get(`[data-test=${selector}]`)
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

Cypress.Commands.add('login', (baseUrl, email, password) => {
  const emailInputDataId = testIds.auth_inputEmail
  const passwordInputDataId = testIds.auth_inputPassword
  const homePageUrl = testIds.url_home

  cy.session(
    [email, password],
    () => {
      cy.visit(baseUrl)
      cy.getByData(emailInputDataId).type(email)
      cy.getByData(passwordInputDataId).type(password)
      cy.getByData(testIds.auth_loginButton).click()
      cy.wait(1000)
    },
    {
      validate: () => {
        cy.url().should('eq', homePageUrl)
        cy.getCookie('authToken').should('exist')
      }
    }
  )
})

Cypress.Commands.add('setGeolocation', aliasName => {
  cy.window().then(win => {
    cy.stub(win.navigator.geolocation, 'getCurrentPosition').callsFake(success => {
      success({ coords: { latitude: 28.4594965, longitude: 77.0266383 } })
    })
    cy.intercept('GET', '**/maps.googleapis.com/maps/api/geocode/json*', {
      fixture: 'homePage/address.json'
    }).as(aliasName as string)
  })
})

Cypress.Commands.add('performSearch', (searchTerm, response) => {
  const searchInputId = 'search-input'

  cy.intercept('POST', `${GCL_URL}/search`, response).as('searchResults')

  cy.getByData(searchInputId).clear().type(`${searchTerm}{enter}`)
  cy.wait('@searchResults')
})

Cypress.Commands.add('selectProduct', index => {
  cy.getByData(testIds.searchpage_products).eq(index).click()
})

Cypress.Commands.add('selectMultiProduct', indexes => {
  indexes.forEach(index => {
    cy.getByData(testIds.searchpage_products).eq(index).click()
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.goBack).click()
  })
})

Cypress.Commands.add('performInit', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/init`, response).as(aliasName)
})

Cypress.Commands.add('performSelect', (response, aliasName, button) => {
  cy.intercept('POST', `${GCL_URL}/select`, response).as(aliasName)
  if (button) cy.getByData(button).click()
})

Cypress.Commands.add('fillAndSaveShippingDetails', () => {
  cy.getByData(testIds.checkoutpage_shippingDetails)
    .getByData(testIds.checkoutpage_openForm)
    .click()
    .getByData(testIds.checkoutpage_form)
    .within(() => {
      cy.getByData(testIds.checkoutpage_name).clear().type(shippingDetails.name)
      cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(shippingDetails.mobileNumber)
      cy.getByData(testIds.checkoutpage_email).clear().type(shippingDetails.email)
      cy.getByData(testIds.checkoutpage_address).clear().type(shippingDetails.address)
      cy.getByData(testIds.checkoutpage_pinCode).clear().type(shippingDetails.pinCode)
      cy.getByData('submit').click()
    })
})

Cypress.Commands.add('performConfirm', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/confirm`, response).as(aliasName)
})

Cypress.Commands.add('performOrders', (response, aliasName) => {
  cy.intercept('POST', `${STRAPI_URL}/orders`, response).as(aliasName)
})

Cypress.Commands.add('performStatus', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/status`, response).as(aliasName)
})

Cypress.Commands.add('performTrack', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/track`, response).as(aliasName)
})

Cypress.Commands.add('performSupport', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/support`, response).as(aliasName)
})
Cypress.Commands.add('performProfile', (response, aliasName) => {
  cy.intercept('GET', `${STRAPI_URL}/profiles`, response).as(aliasName)
})

Cypress.Commands.add('performUpdateOrder', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/update`, response).as(aliasName)
})
Cypress.Commands.add('performOrderHisrory', (response, aliasName) => {
  cy.intercept('GET', `${STRAPI_URL}/orders?filters[category]=6`, response).as(aliasName)
})
Cypress.Commands.add('performRating', (response, aliasName) => {
  cy.intercept('POST', `${GCL_URL}/rating`, response).as(aliasName)
})
