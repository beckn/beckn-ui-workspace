import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/DSEP/checkoutPage/initResponse'
import { billingDetails, shippingDetails } from '../../fixtures/DSEP/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/DSEP/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/DSEP/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/DSEP/orderDetails/statusResponse'
import { statusResponseUpdate } from '../../fixtures/DSEP/orderDetails/statusResponseUpdate'

import { updatedShippingDetailsResponse } from '../../fixtures/DSEP/orderDetails/updateShippingDetails'

describe.only('Order Details Page', () => {
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
    cy.fillAndSaveShippingDetails()
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.performOrders(orderResponse, 'orderResponse')
    cy.performStatus(statusResponse('PAYMENT_RECEIVED'), 'processStatusResponse')
    cy.wait('@confirmResponse')
    cy.wait('@orderResponse')
    cy.url().should('include', '/orderConfirmation')
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.wait('@processStatusResponse')
  })

  context('Should render all the different components of Order Details', () => {
    it('should render order details page', () => {
      cy.url().should('include', testIds.url_orderDetails)
    })

    it('should render the diff sections of order detail page', () => {
      cy.getByData(testIds.job_main_container).should('be.visible')
      cy.getByData(testIds.orderDetailspage_orderSummary).should('be.visible')
      cy.getByData(testIds.orderDetailspage_orderId_container).should('be.visible')
      cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_paymentDetails_container).should('be.visible')
    })

    it('should render the Job Switch Card including all element', () => {
      cy.getByData(testIds.job_main_container_text).should('contain.text', 'Looking to switch jobs?')
      cy.getByData(testIds.job_main_container_job_change_text).should(
        'contain.text',
        'Click here for a tailored job search experience!'
      )
      cy.getByData(testIds.job_main_container_job_search_link).should('contain.text', 'Search for jobs')
    })

    it('should render the order details in Order summary section', () => {
      cy.getByData(testIds.orderDetailspage_orderSummary).should('be.visible')
      cy.getByData(testIds.orderDetails_bookenIn_text).should('contain.text', 'Booked in')
      cy.getByData(testIds.orderDetails_timestamp).should('be.visible')
      cy.getByData(testIds.orderDetails_ordersFulfilled_text).should('contain.text', 'Orders Fulfilled')
      cy.getByData(testIds.orderDetails_ordersFulfilled_length).should('be.visible')
    })

    it('should render the Order ID Section', () => {
      cy.getByData(testIds.orderDetailspage_orderId_container).should('be.visible')
      cy.getByData(testIds.orderDetailspage_orderId).should('be.visible')
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('be.visible')
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'PAYMENT_RECEIVED')
    })

    it('should render the billing details', () => {
      cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_name).should('contain.text', billingDetails.name)
      cy.getByData(testIds.orderDetailspage_address).eq(0).should('contain.text', billingDetails.address)
      cy.getByData(testIds.orderDetailspage_mobileNumber).eq(0).should('contain.text', billingDetails.mobileNumber)
      // })
    })

    it('should render the payment breakup details', () => {
      cy.getByData(testIds.orderDetailspage_paymentDetails_container).should('be.visible')
      cy.getByData(testIds.accordion_click).click()
      cy.get('[data-test="Course Fee"]').should('be.visible')
      cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹2,000.00')
      cy.get('[data-test="Course Discount"]').should('contain.text', 'Course Discount')
      cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹2,000.00')
      cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
      cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹0.00')
    })
  })

  context('Should handle tracking, support, cancel & update order', () => {
    before(() => {
      cy.performTrack({ fixture: 'DSEP/orderDetails/trackResponse.json' }, 'trackResponse')
      cy.performSupport({ fixture: 'DSEP/orderDetails/supportResponse.json' }, 'supportResponse')
    })
    it('should render Other option menus', () => {
      cy.getByData(testIds.orderDetailspage_otherOptions).should('be.visible')
      cy.getByData(testIds.orderDetailspage_otherOptions).click()
      cy.wait('@trackResponse')
      cy.wait('@supportResponse')
      cy.getByData(testIds.orderDetailspage_menus).should('exist')
    })

    it('should render all the option in Other options modal', () => {
      cy.getByData(testIds.orderDetailspage_menus).within(() => {
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(0).should('contain.text', 'Track Order')
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Cancel Order')
        cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(0).should('contain.text', 'Call Customer Service')
        cy.getByData(testIds.orderDetailspage_callServiceItemName)
          .eq(1)
          .should('contain.text', 'Email Customer Service')
        cy.getByData('close_button').click()
      })
    })
  })

  context('should handle update billing details Validation', () => {
    it('Should be open Add billing details Modal when click on Edit button', () => {
      cy.getByData(testIds.orderDetailspage_billingDetails).within(() => {
        cy.getByData(testIds.edit_button_Text).click()
      })
    })
    it('should validate update Billing form fields', () => {
      cy.getByData(testIds.orderDetailspage_updateShippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).type('000').clear().blur()
          cy.contains('Name is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_mobileNumber).type('12345').blur()
          cy.contains('Invalid mobile number').should('be.visible')

          cy.getByData(testIds.checkoutpage_email).type('invalid-email').blur()
          cy.contains('Invalid email format').should('be.visible')

          cy.getByData(testIds.checkoutpage_address).type('addr').clear().blur()
          cy.contains('Address is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_pinCode).type('123').blur()
          cy.contains('Invalid Zip Code').should('be.visible')

          cy.getByData('submit').should('be.disabled')
        })
      cy.getByData(testIds.orderDetailspage_updateShippingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
    })

    it('should fill and save the update Billing form data', () => {
      cy.performStatus(statusResponseUpdate('PAYMENT_RECEIVED'), 'statusResponseUpdate')
      cy.getByData(testIds.edit_button_Text).click()
      cy.performUpdateOrder(updatedShippingDetailsResponse, 'updateOrder')
      cy.getByData(testIds.orderDetailspage_updateShippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).type(shippingDetails.name)
          cy.getByData(testIds.checkoutpage_mobileNumber).type(shippingDetails.mobileNumber)
          cy.getByData(testIds.checkoutpage_email).type(shippingDetails.email)
          cy.getByData(testIds.checkoutpage_address).type(shippingDetails.address)
          cy.getByData(testIds.checkoutpage_pinCode).type(shippingDetails.pinCode)
          cy.getByData('submit').click()
          cy.wait('@statusResponseUpdate')
          cy.wait('@updateOrder')
        })
    })
  })

  context('Should Render jobSearch Page when click on Search For Job Link', () => {
    it('should Navigate Job Search Page ', () => {
      cy.getByData(testIds.job_main_container_job_search_link).click()
      cy.url().should('include', '/jobSearch')
    })
  })
})
