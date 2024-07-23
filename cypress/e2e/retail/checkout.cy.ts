import {
  Urls,
  UserCredentials,
  GeneralTestIds,
  ProductPageTestIds,
  CartPageTestIds,
  CheckoutPageTestIds
} from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'

describe('Checkout Page', () => {
  const searchTerm = 'sunglass'

  before(() => {
    cy.login(Urls.baseUrl, UserCredentials.validEmail, UserCredentials.validPassword)
    cy.visit(Urls.homePageUrl)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.getByData(ProductPageTestIds.addTocartButton).click()
    cy.getByData(GeneralTestIds.cartButton).click()
    cy.performSelect({ fixture: 'checkoutPage/selectResponse.json' })
    cy.getByData(CartPageTestIds.cartOrderButton).click()
    cy.getByData(GeneralTestIds.feedback).getByData('close').click()
  })

  it('should display the item details', () => {
    cy.getByData(CheckoutPageTestIds.itemDetails).should('have.length', 1)
    cy.getByData(CheckoutPageTestIds.itemTitle).should('contain.text', 'sunglass One')
    cy.getByData(CheckoutPageTestIds.itemQuantity).should('contain.text', 1)
    cy.getByData(CheckoutPageTestIds.itemPrice).should('contain.text', '₹100.00')
  })

  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(CheckoutPageTestIds.shippingDetails).should('be.visible')
    cy.getByData(CheckoutPageTestIds.billingDetails).should('be.visible')
    cy.getByData(CheckoutPageTestIds.paymentDetails).should('not.exist')
    cy.getByData(CheckoutPageTestIds.proceedToCheckout).should('be.disabled')
  })

  it('should validate shipping form fields', () => {
    cy.getByData(CheckoutPageTestIds.shippingDetails).getByData(CheckoutPageTestIds.openForm).click()

    cy.getByData(CheckoutPageTestIds.shippingDetails)
      .getByData(CheckoutPageTestIds.form)
      .within(() => {
        cy.getByData(CheckoutPageTestIds.name).clear().blur()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(CheckoutPageTestIds.mobileNumber).clear().type('12345').blur()
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(CheckoutPageTestIds.email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(CheckoutPageTestIds.address).clear().blur()
        cy.contains('Complete Address is required').should('be.visible')

        cy.getByData(CheckoutPageTestIds.pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip Code').should('be.visible')

        cy.getByData('submit').should('be.disabled')
      })
    cy.getByData(CheckoutPageTestIds.shippingDetails).getByData(CheckoutPageTestIds.form).type('{esc}')
  })

  it('should fill and save the shipping form data', () => {
    cy.getByData(CheckoutPageTestIds.shippingDetails).getByData(CheckoutPageTestIds.openForm).click()
    cy.getByData(CheckoutPageTestIds.form).should('be.visible')

    cy.getByData(CheckoutPageTestIds.shippingDetails)
      .getByData(CheckoutPageTestIds.form)
      .within(() => {
        cy.getByData(CheckoutPageTestIds.name).clear().type(shippingDetails.name)
        cy.getByData(CheckoutPageTestIds.mobileNumber).clear().type(shippingDetails.mobileNumber)
        cy.getByData(CheckoutPageTestIds.email).clear().type(shippingDetails.email)
        cy.getByData(CheckoutPageTestIds.address).clear().type(shippingDetails.address)
        cy.getByData(CheckoutPageTestIds.pinCode).clear().type(shippingDetails.pinCode)
        cy.getByData('submit').click()
      })

    cy.performInit(initResponse)
  })

  it('should handle the "same as shipping" checkbox for billing form data', () => {
    cy.getByData(CheckoutPageTestIds.billingDetails).within(() => {
      cy.getByData(CheckoutPageTestIds.checkbox).get('input').check()
      cy.getByData(CheckoutPageTestIds.checkbox).click()
      cy.getByData(CheckoutPageTestIds.changeFormDetails).click()
    })

    cy.getByData(CheckoutPageTestIds.billingDetails)
      .getByData(CheckoutPageTestIds.form)
      .within(() => {
        cy.getByData(CheckoutPageTestIds.name).should('contain.value', shippingDetails.name)
        cy.getByData(CheckoutPageTestIds.mobileNumber).should('contain.value', shippingDetails.mobileNumber)
        cy.getByData(CheckoutPageTestIds.email).should('contain.value', shippingDetails.email)
        cy.getByData(CheckoutPageTestIds.address).should('contain.value', shippingDetails.address)
        cy.getByData(CheckoutPageTestIds.pinCode).should('contain.value', shippingDetails.pinCode)
      })
    cy.getByData(CheckoutPageTestIds.billingDetails).getByData(CheckoutPageTestIds.form).type('{esc}')
  })

  it('should validate billing form fields', () => {
    cy.getByData(CheckoutPageTestIds.billingDetails).within(() => {
      cy.getByData(CheckoutPageTestIds.changeFormDetails).click()
    })

    cy.getByData(CheckoutPageTestIds.billingDetails)
      .getByData(CheckoutPageTestIds.form)
      .within(() => {
        cy.getByData(CheckoutPageTestIds.name).clear().blur()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(CheckoutPageTestIds.mobileNumber).clear().type('12345').blur()
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(CheckoutPageTestIds.email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(CheckoutPageTestIds.address).clear().blur()
        cy.contains('Complete Address is required').should('be.visible')

        cy.getByData(CheckoutPageTestIds.pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip Code').should('be.visible')

        cy.getByData('submit').should('be.disabled')
      })
    cy.getByData(CheckoutPageTestIds.billingDetails).getByData(CheckoutPageTestIds.form).type('{esc}')
  })

  it('should fill and save the billing form data', () => {
    cy.getByData(CheckoutPageTestIds.billingDetails).within(() => {
      cy.getByData(CheckoutPageTestIds.changeFormDetails).click()
    })

    cy.getByData(CheckoutPageTestIds.billingDetails)
      .getByData(CheckoutPageTestIds.form)
      .within(() => {
        cy.getByData(CheckoutPageTestIds.name).clear().type(billingDetails.name)
        cy.getByData(CheckoutPageTestIds.mobileNumber).clear().type(billingDetails.mobileNumber)
        cy.getByData(CheckoutPageTestIds.email).clear().type(billingDetails.email)
        cy.getByData(CheckoutPageTestIds.address).clear().type(billingDetails.address)
        cy.getByData(CheckoutPageTestIds.pinCode).clear().type(billingDetails.pinCode)
        cy.getByData('submit').click()
      })
    cy.performInit(initResponse)
  })

  it('should display the payment section', () => {
    cy.getByData(CheckoutPageTestIds.paymentDetails).should('be.visible')
  })

  it('should display the payment breakup details', () => {
    cy.getByData(CheckoutPageTestIds.paymentDetails).within(() => {
      cy.getByData(CheckoutPageTestIds.basePrice).should('contain.text', 'base-price')
      cy.getByData(CheckoutPageTestIds.itemPrice).eq(0).should('contain.text', '₹200.00')

      cy.getByData(CheckoutPageTestIds.taxes).should('contain.text', 'taxes')
      cy.getByData(CheckoutPageTestIds.itemPrice).eq(1).should('contain.text', '₹360.00')

      cy.getByData(CheckoutPageTestIds.totalPayment).should('contain.text', 'Total')
      cy.getByData(CheckoutPageTestIds.itemPrice).eq(2).should('contain.text', '₹2,160.00')
    })
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(CheckoutPageTestIds.proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')
  })
})
