import { testIds } from '../../../shared/dataTestIds'
import { shippingDetails } from '../../fixtures/P2P/userDetails'

describe('Checkout Page', () => {
  afterEach(() => {
    cy.clearAllLocalStorage()
  })
  before(() => {
    cy.visit(testIds.url_base)
    cy.getByData(testIds.clickable_card_open_spark).click()
    cy.wait(2000)
    cy.intercept('POST', '**/search', {
      fixture: 'P2P/searchResponse.json'
    }).as('searchResponse')
    cy.getByData(testIds.P2P_hompage_button).click()
    cy.wait(2000)
    cy.url().should('include', `${testIds.url_search}?searchTerm`)

    cy.getByData(testIds.searchpage_products).first().click()
    cy.url().should('include', testIds.url_product)
    cy.intercept('POST', '/select', { fixture: 'P2P/selectResult.json' }).as('selectCall')
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.wait('@selectCall')
    cy.getByData(testIds.cartpage_cartOrderButton).click()
  })

  it('should display the item details', () => {
    cy.getByData(testIds.item_details).should('have.length', 1)
    cy.getByData(testIds.item_title).should('contain.text', 'energy')
    cy.getByData(testIds.item_quantity).should('contain.text', 1)
    cy.getByData(testIds.item_price).should('contain.text', '₹7.00')
  })
  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
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

        cy.getByData(testIds.meterNumber).clear().type('MT451667').blur()

        cy.getByData(testIds.checkoutpage_address).clear().blur()
        cy.contains('Complete Address is required').should('be.visible')

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
        cy.getByData(testIds.meterNumber).clear().type('MT451667')
        cy.getByData(testIds.checkoutpage_address).clear().type(shippingDetails.address)
        cy.getByData(testIds.checkoutpage_pinCode).clear().type(shippingDetails.pinCode)
        cy.getByData('submit').click()
      })

    cy.intercept('POST', '**/init', { fixture: 'P2P/initResponse.json' }).as('initCall')
    cy.wait('@initCall')
  })

  it('should display the payment section', () => {
    cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
  })

  it('should display the payment breakup details', () => {
    cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
      cy.getByData('CGST').should('contain.text', 'CGST')
      cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹0.65')

      cy.getByData('SGST').should('contain.text', 'SGST')
      cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹0.65')

      cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
      cy.getByData(testIds.item_price).eq(5).should('contain.text', '₹15.80')
    })
  })

  it('should proceed to checkout when valid data is provided', () => {
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')
  })
})
