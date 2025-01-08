import { testIds } from '../../../../shared/dataTestIds'
import { billingDetails } from '../../../fixtures/forest-conservation/ENVIROGROWTH/checkoutPage/userDetails'
import { initResponse } from '../../../fixtures/forest-conservation/ENVIROGROWTH/checkoutPage/initResponse'

describe('Checkout Page', () => {
  const searchTerm = 'data'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'forest-conservation/ENVIROGROWTH/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.url().should('include', testIds.url_product)
    cy.getByData('"product-checkbox"').eq(0).click()
    cy.getByData('"product-checkbox"').eq(3).click()
    cy.getByData('"product-checkbox"').eq(5).click()
    cy.getByData('"product-checkbox"').eq(9).click()
    cy.getByData('product-radio').eq(0).click()
    cy.getByData('"product-checkbox"').eq(12).click()
    cy.getByData(testIds.Proceed_to_product).click()
    cy.intercept('POST', '/select', { fixture: 'forest-conservation/ENVIROGROWTH/cart/selectResult.json' }).as(
      'selectCall'
    )
    cy.wait('@selectCall')
    cy.getByData(testIds.feedback).getByData('close').click()
    cy.url().should('include', testIds.url_cart)
    cy.getByData(testIds.Proceed).click()
    cy.url().should('include', testIds.url_checkout)
  })

  it('should display the item details', () => {
    cy.getByData(testIds.item_details).should('have.length', 1)
    cy.getByData(testIds.item_title).should('contain.text', 'Archive of climate and weather data')
    cy.get('[data-test="item-description"]').should('contain.text', 'Nationa Met Dept')
    cy.getByData(testIds.item_quantity).should('contain.text', 1)
    cy.getByData(testIds.item_price).should('contain.text', '₹80.00')
  })

  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
  })

  it('should validate billing form fields', () => {
    cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
      cy.getByData(testIds.checkoutpage_openForm).click()
    })

    cy.getByData(testIds.checkoutpage_billingDetails)
      .getByData(testIds.checkoutpage_form)
      .click()
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().blur()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(testIds.checkoutpage_address).clear().blur()
        cy.contains('Complete Address is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip Code').should('be.visible')

        cy.getByData('submit').should('be.disabled')
      })
    cy.getByData(testIds.checkoutpage_billingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
  })

  it('should fill and save the billing form data', () => {
    cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
      cy.getByData(testIds.checkoutpage_openForm).click()
    })

    cy.getByData(testIds.checkoutpage_billingDetails)
      .getByData(testIds.checkoutpage_form)
      .click()
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().type(billingDetails.name)
        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(billingDetails.mobileNumber)
        cy.getByData(testIds.checkoutpage_email).clear().type(billingDetails.email)
        cy.getByData(testIds.checkoutpage_address).clear().type(billingDetails.address)
        cy.getByData(testIds.checkoutpage_pinCode).clear().type(billingDetails.pinCode)
        cy.getByData('submit').click()
      })
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
  })

  it('should display the payment section', () => {
    cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
  })

  it('should display the payment breakup details', () => {
    cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
      cy.getByData('totalPayment').should('contain.text', 'Total')
      cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹80.00')
    })
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')
  })
})
