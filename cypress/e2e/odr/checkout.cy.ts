import { testIds } from '../../../shared/dataTestIds'
import { respondentDetails, complaintsDetails } from '../../fixtures/ODR/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/ODR/checkoutPage/initResponse'

describe('Checkout Page', () => {
  const searchTerm = 'mediation'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'ODR/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.performSelect({ fixture: 'ODR/checkoutPage/selectResponse.json' }, 'selectResponse')
    cy.wait('@selectResponse')
  })

  it('should check the Complainant & Billing Details, Respondent Details section rendered or not & Confirm btn', () => {
    cy.getByData(testIds.checkoutpage_complaints_Details).should('be.visible')
    cy.getByData(testIds.checkoutpage_respondent_Details).should('be.visible')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
  })

  it('should validate Complainant & Billing Details form fields', () => {
    cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()

    cy.getByData(testIds.checkoutpage_complaints_Details)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().blur()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
        cy.contains('Invalid mobile number').should('be.visible')

        cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(testIds.checkoutpage_address).clear().blur()
        cy.contains('Address is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip Code').should('be.visible')

        cy.getByData('submit').should('be.disabled')
      })
    cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_form).type('{esc}')
  })

  it('should fill and save the Complainant & Billing Details', () => {
    cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()
    cy.getByData(testIds.checkoutpage_form).should('be.visible')

    cy.getByData(testIds.checkoutpage_complaints_Details)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().type(complaintsDetails.name)
        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(complaintsDetails.mobileNumber)
        cy.getByData(testIds.checkoutpage_email).clear().type(complaintsDetails.email)
        cy.getByData(testIds.checkoutpage_address).clear().type(complaintsDetails.address)
        cy.getByData(testIds.checkoutpage_pinCode).clear().type(complaintsDetails.pinCode)
        cy.getByData('submit').click()
      })

    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
  })

  it('should validate Respondent Details form fields', () => {
    cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()

    cy.getByData(testIds.checkoutpage_respondent_Details)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().blur()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
        cy.contains('Invalid mobile number').should('be.visible')

        cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(testIds.checkoutpage_address).clear().blur()
        cy.contains('Address is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip Code').should('be.visible')

        cy.getByData('submit').should('be.disabled')
      })
    cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_form).type('{esc}')
  })

  it('should fill and save the Respondent Details ', () => {
    cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()
    cy.getByData(testIds.checkoutpage_form).should('be.visible')

    cy.getByData(testIds.checkoutpage_respondent_Details)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().type(respondentDetails.name)
        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(respondentDetails.mobileNumber)
        cy.getByData(testIds.checkoutpage_email).clear().type(respondentDetails.email)
        cy.getByData(testIds.checkoutpage_address).clear().type(respondentDetails.address)
        cy.getByData(testIds.checkoutpage_pinCode).clear().type(respondentDetails.pinCode)
        cy.getByData('submit').click()
      })

    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
  })

  it('should fill and save the Dispute Details', () => {
    cy.getByData(testIds.checkoutpage_dispute_Details).click()
    cy.getByData(testIds.xinput_form_open).should('be.visible')

    cy.getByData(testIds.xinput_form).within(() => {
      cy.getByData('details').type('krushna')
      cy.getByData('"claimValue"').type('1234')
      cy.getByData('btnSave').click()
    })

    cy.intercept('POST', 'https://bpp-unified-strapi-dev.becknprotocol.io/beckn-bpp-adapter/x-input/submit', {
      fixture: 'ODR/checkoutPage/disputeSubmitFormResponse.json'
    }).as('disputeFormResponse')
  })

  it('should fill and save the Consent Form', () => {
    cy.getByData(testIds.checkoutpage_consent_Details).click()
    cy.getByData(testIds.xinput_form_open).should('be.visible')

    cy.getByData(testIds.xinput_form).within(() => {
      cy.getByData('name').type('krushna')
      cy.getByData('"place"').type('pune')
      cy.getByData('btnConfirm').click()
    })
    cy.intercept('POST', 'https://bpp-unified-strapi-dev.becknprotocol.io/beckn-bpp-adapter/x-input/submit', {
      fixture: 'ODR/checkoutPage/consentFormResponse.json'
    }).as('consentFormResponse')
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_orderConfirmation)
  })
})
