import { testIds } from '../../../shared/dataTestIds'
import { shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/DSEP/checkoutPage/initResponse'

describe('Checkout Page', () => {
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
  })

  it('should display the item details', () => {
    cy.getByData(testIds.item_title).should('contain.text', 'java springboot book One')
    cy.getByData(testIds.item_provider).should('contain.text', 'Edureka')
    cy.getByData('item-price').should('contain.text', '₹2,000.00')
  })

  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
  })

  it('should Billing  form fields', () => {
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

  it('should display the payment section', () => {
    cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
  })
  it('should display the payment breakup details', () => {
    cy.get('[data-test="Course Fee"]').should('be.visible')
    cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹2,000.00')

    cy.get('[data-test="Course Discount"]').should('contain.text', 'Course Discount')
    cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹2,000.00')

    cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
    cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹0.00')
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/orderConfirmation')
  })
})
