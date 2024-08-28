import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/INDUSTRY4.0/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/INDUSTRY4.0/checkoutPage/initResponse'

describe('Checkout Page', () => {
  const searchTerm = 'assembly'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'INDUSTRY4.0/searchPage/searchResults.json'
    })
    cy.getByData(testIds.search_page_product_OnClick).first().click()
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.product_page_book_button).click()
    cy.performSelect({ fixture: 'INDUSTRY4.0/select/selectResult.json' }, 'selectResponse')
    cy.get(testIds.type).select('Plastic Box')
    cy.get(testIds.type).should('have.value', 'Plastic Box')
    cy.get(testIds.colour).select('Blue')
    cy.get(testIds.colour).should('have.value', 'Blue')
    cy.get(testIds.shape).select('Circle')
    cy.get(testIds.shape).should('have.value', 'Circle')
    cy.get(testIds.length).type('10')
    cy.get(testIds.width).type('100')
    cy.get(testIds.weight).type('10')
    cy.get(testIds.increaseQuantity).click()
    cy.get(testIds.quantity).should('have.value', '2')
    cy.get('button[type="submit"]').click()
    cy.performXinput_Submit({ fixture: 'INDUSTRY4.0/x-input/x-inputResult.json' }, 'xinputResponse')
  })

  it('should display the item details', () => {
    cy.url().should('include', testIds.url_checkoutPage)
    cy.getByData(testIds.item_title).should('contain.text', 'Assembly')
    cy.getByData(testIds.item_name).should('contain.text', 'Intermittent assembly type')
    cy.getByData(testIds.item_quantity).should('contain.text', 2)
    cy.getByData(testIds.item_price).should('contain.text', 'EUR 300')
  })

  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
  })

  it('should validate shipping form fields', () => {
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()

    cy.getByData(testIds.checkoutpage_shippingDetails)
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
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
  })

  it('should fill and save the shipping form data', () => {
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData(testIds.checkoutpage_form).should('be.visible')

    cy.getByData(testIds.checkoutpage_shippingDetails)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).clear().type(shippingDetails.name)
        cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(shippingDetails.mobileNumber)
        cy.getByData(testIds.checkoutpage_email).clear().type(shippingDetails.email)
        cy.getByData(testIds.checkoutpage_address).clear().type(shippingDetails.address)
        cy.getByData(testIds.checkoutpage_pinCode).clear().type(shippingDetails.pinCode)
        cy.getByData('submit').click()
      })

    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
  })

  it('should handle the "same as shipping" checkbox for billing form data', () => {
    cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
      cy.getByData(testIds.checkoutpage_checkbox).get('input').check()
      cy.getByData(testIds.checkoutpage_checkbox).click()
      cy.getByData(testIds.checkoutpage_changeFormDetails).click()
    })

    cy.getByData(testIds.checkoutpage_billingDetails)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).should('contain.value', shippingDetails.name)
        cy.getByData(testIds.checkoutpage_mobileNumber).should('contain.value', shippingDetails.mobileNumber)
        cy.getByData(testIds.checkoutpage_email).should('contain.value', shippingDetails.email)
        cy.getByData(testIds.checkoutpage_address).should('contain.value', shippingDetails.address)
        cy.getByData(testIds.checkoutpage_pinCode).should('contain.value', shippingDetails.pinCode)
      })
    cy.getByData(testIds.checkoutpage_billingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
  })

  it('should validate billing form fields', () => {
    cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
      cy.getByData(testIds.checkoutpage_changeFormDetails).click()
    })

    cy.getByData(testIds.checkoutpage_billingDetails)
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
    cy.getByData(testIds.checkoutpage_billingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
  })

  it('should fill and save the billing form data', () => {
    cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
      cy.getByData(testIds.checkoutpage_changeFormDetails).click()
    })

    cy.getByData(testIds.checkoutpage_billingDetails)
      .getByData(testIds.checkoutpage_form)
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
      cy.get('[data-test="Base Price"]').should('contain.text', 'Base Price')
      cy.getByData(testIds.item_price).eq(0).should('be.visible')

      cy.get('[data-test="Shipping Cost"]').should('contain.text', 'Shipping Cost')
      cy.getByData(testIds.item_price).eq(1).should('be.visible')

      cy.getByData('Tax').should('contain.text', 'Tax')
      cy.getByData(testIds.item_price).eq(2).should('be.visible')

      cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
      cy.getByData(testIds.item_price).eq(3).should('be.visible')
    })
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')
  })
})
