import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/ODR/checkoutPage/initResponse'
import { complaintsDetails, respondentDetails } from '../../fixtures/ODR/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/ODR/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/ODR/orderConfirmation/orderResponse'
describe('Order Confirmation Page', () => {
  const searchTerm = 'mediation'

  context('should render orderDetail Page when user click on View Order Details button', () => {
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
      //on checkout page filled compliant details form
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

      //on checkout page filled respondent details form
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

      //on checkout page filled dispute details form
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

      //on checkout page filled consent details form
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

      //on checkout page all form filled and click on proceed button
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_orderConfirmation)
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.wait('@confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.wait('@orderResponse')
    })

    it('should display order confirmation details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'ORDER SUCCESFULL')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should('contain.text', 'Thank you for your order!')
      cy.getByData(testIds.orderConfirmation_trackOrderMessage).should(
        'contain.text',
        'You can track your order in "My Order" section'
      )
    })
    it('should render the correct order ID', () => {
      const orderId = '1001'
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is: ${orderId}`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })

  context('should render Homepage when user click on go back to home button', () => {
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
      //on checkout page filled compliant details form
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

      //on checkout page filled respondent details form
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

      //on checkout page filled dispute details form
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

      //on checkout page filled consent details form
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

      //on checkout page all form filled and click on proceed button
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_orderConfirmation)
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.wait('@confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.wait('@orderResponse')
    })

    it('should render homepage when click on go back to home', () => {
      cy.getByData(testIds.orderConfirmation_goBackToHome).click()
      cy.url().should('include', testIds.url_home)
    })
  })
})
