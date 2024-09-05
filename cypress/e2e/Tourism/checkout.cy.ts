import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/TOURISM/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/TOURISM/checkoutPage/initResponse'

describe('Checkout Page', () => {
  const searchTerm = 'Manli'

  before(() => {
    cy.login(testIds.url_base_tourism, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base_tourism}${testIds.url_home}`)
    cy.getByData(testIds.homepage_searchInput).click()
    cy.getByData(testIds.loaction_list).type(searchTerm)
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
    cy.getByData(testIds.homepage_search_button).click()
    cy.performSearch(searchTerm, {
      fixture: 'TOURISM/searchPage/searchResults.json'
    })
    cy.performSelect({ fixture: 'TOURISM/checkoutPage/selectResponse.json' }, 'selectResponse')
    cy.selectProduct(0)
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.wait('@selectResponse')
  })

  it('should display the item details', () => {
    cy.getByData(testIds.item_details).should('have.length', 1)
    cy.getByData(testIds.item_title).should('contain.text', 'Hampta Pass Trek - Manali One')
    cy.getByData(testIds.item_quantity).should('contain.text', 1)
    cy.getByData(testIds.item_price).should('contain.text', '₹100.00')
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
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(testIds.checkoutpage_address).clear().blur()
        cy.contains('Complete Address is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip code').should('be.visible')

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
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
        cy.contains('Invalid email format').should('be.visible')

        cy.getByData(testIds.checkoutpage_address).clear().blur()
        cy.contains('Complete Address is required').should('be.visible')

        cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
        cy.contains('Invalid Zip code').should('be.visible')

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
      cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
      cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹100.00')

      cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
      cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹22.00')

      cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
      cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹122.00')
    })
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')
  })
})
