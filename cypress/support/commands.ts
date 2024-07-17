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
declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>
    login(baseUrl: string, email: string, password: string): Chainable<void>
    setGeolocation(aliasName: string): Chainable<void>
  }
}

Cypress.Commands.add('getByData', selector => {
  return cy.get(`[data-test=${selector}]`)
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})

Cypress.Commands.add('login', (baseUrl, email, password) => {
  const emailInputDataId = 'input-email'
  const passwordInputDataId = 'input-password'
  const homePageUrl = 'http://localhost:3002/'

  cy.session(
    [email, password],
    () => {
      cy.visit(baseUrl)
      cy.getByData(emailInputDataId).type(email)
      cy.getByData(passwordInputDataId).type(password)
      cy.getByData('login-button').click()
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
