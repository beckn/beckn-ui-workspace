import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/orderDetails/statusResponse'
import { updatedShippingDetailsResponse } from '../../fixtures/orderDetails/updateShippingDetails'

describe('Order Details Page', () => {
  const searchTerm = 'sunglass'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(testIds.url_home)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'searchPage/searchResults.json'
    })
    cy.selectMultiProduct([0, 1])
    cy.getByData(testIds.cartButton).click()
    cy.performSelect({ fixture: 'checkoutPage/selectResponse.json' }, 'selectResponse')
    cy.wait('@selectResponse')
    cy.getByData(testIds.cartpage_cartOrderButton).click()
    // cy.getByData(testIds.feedback).getByData('close').click()
    cy.fillAndSaveShippingDetails()
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.getByData(testIds.paymentpage_CashOnDelivery).click()
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.wait('@confirmResponse')
    cy.performOrders(orderResponse, 'ordersResponse')
    cy.wait('@ordersResponse')
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.performStatus(statusResponse, 'statusResponse')
    cy.wait('@statusResponse')
  })

  context('Should render all the different components of Order Details', () => {
    it('should render order details page', () => {
      cy.url().should('include', testIds.url_orderDetails)
    })

    it('should render the diff sections of order detail page', () => {
      cy.getByData(testIds.orderDetailspage_orderOverview).should('be.visible')
      cy.getByData(testIds.orderDetailspage_progressSummary).should('be.visible')
      cy.getByData(testIds.orderDetailspage_shippingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_paymentDetails).should('be.visible')
    })

    it('should render the order product details in order overview section', () => {
      cy.getByData(testIds.orderDetailspage_productName).should('contain.text', 'sunglass One')
      cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
    })

    it('should render the order details in progress summary section', () => {
      cy.getByData(testIds.orderDetailspage_orderId).should('include.text', 'avh_6')
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('contain.text', 'sunglass One')
      cy.getByData(testIds.orderDetailspage_orderSummaryTotalItems).should('contain.text', '+1')
    })

    it('should open the total item list in progress summary section on click of +1', () => {
      cy.getByData(testIds.orderDetailspage_orderSummaryTotalItems).click()
      cy.getByData(testIds.orderDetailspage_viewMoreOrders).should('exist')

      cy.getByData(testIds.orderDetailspage_viewMoreOrders).within(() => {
        cy.getByData(testIds.item_title).should('have.length', 2)

        cy.getByData(testIds.item_title).eq(0).should('contain.text', 'sunglass One')
        cy.getByData(testIds.item_quantity).eq(0).should('contain.text', '1')
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹ 100.00')

        cy.getByData(testIds.item_title).eq(1).should('contain.text', 'sunglass Two')
        cy.getByData(testIds.item_quantity).eq(1).should('contain.text', '1')
        cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹ 200.00')

        cy.getByData(testIds.close).should('exist')
      })
      cy.getByData(testIds.close).click()
    })

    it('should render the shipping details', () => {
      cy.getByData(testIds.orderDetailspage_shippingDetails).within(() => {
        cy.getByData(testIds.orderDetailspage_name).should('contain.text', shippingDetails.name)
        cy.getByData(testIds.orderDetailspage_address).eq(0).should('contain.text', shippingDetails.address)
        cy.getByData(testIds.orderDetailspage_mobileNumber).eq(0).should('contain.text', shippingDetails.mobileNumber)
      })
    })

    it('should render the billing details', () => {
      cy.getByData(testIds.orderDetailspage_billingDetails).within(() => {
        cy.getByData(testIds.orderDetailspage_name).should('contain.text', billingDetails.name)
        cy.getByData(testIds.orderDetailspage_address).eq(0).should('contain.text', billingDetails.address)
        cy.getByData(testIds.orderDetailspage_mobileNumber).eq(0).should('contain.text', billingDetails.mobileNumber)
      })
    })

    it('should render the payment breakup details', () => {
      cy.getByData(testIds.orderDetailspage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹200.00')

        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹360.00')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹2,160.00')
      })
    })
  })

  context('When order status is initiated with PROCESSING', () => {
    it('should render the order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'ACTIVE')
    })

    it('should render the initial PROCESS order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 1)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(0).should('contain.text', 'Processing your order')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(0).should('be.visible')
      })
    })
  })

  context('Should handle tracking, support, cancel & update order', () => {
    before(() => {
      cy.performTrack({ fixture: 'orderDetails/trackResponse.json' }, 'trackResponse')
      cy.performSupport({ fixture: 'orderDetails/supportResponse.json' }, 'supportResponse')
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
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(2).should('contain.text', 'Cancel Order')
        cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(0).should('contain.text', 'Call Customer Service')
        cy.getByData(testIds.orderDetailspage_callServiceItemName)
          .eq(1)
          .should('contain.text', 'Email Customer Service')
      })
    })

    it('should navigate to /updateShippingDetails page on click of Update Order option', () => {
      cy.getByData(testIds.orderDetailspage_menus).within(() => {
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).click()
        cy.url().should('include', testIds.url_updateShippingDetails)
      })
    })

    it('should validate update shipping form fields', () => {
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
    })

    it('should render success feedback modal when fill and save the update shipping form data', () => {
      cy.performUpdateOrder(updatedShippingDetailsResponse, 'updateOrder')
      cy.getByData(testIds.checkoutpage_form).should('be.visible')

      cy.getByData(testIds.orderDetailspage_updateShippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().type(shippingDetails.name)
          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(shippingDetails.mobileNumber)
          cy.getByData(testIds.checkoutpage_email).clear().type(shippingDetails.email)
          cy.getByData(testIds.checkoutpage_address).clear().type(shippingDetails.address)
          cy.getByData(testIds.checkoutpage_pinCode).clear().type(shippingDetails.pinCode)
          cy.getByData('submit').click()
          cy.wait('@updateOrder')
          cy.url().should('include', testIds.url_orderDetails)
          cy.performStatus(statusResponse, 'statusResponse')
          cy.wait('@statusResponse')
        })
    })
  })

  context('Should handle Invoice related tests', () => {
    it('should render the invoice modal on click of invoice icon', () => {
      cy.getByData(testIds.downloadInvoiceIcon).should('be.visible')
      cy.getByData(testIds.downloadInvoiceIcon).click()
      cy.getByData(testIds.invoiceModal).should('be.visible')
      cy.getByData(testIds.invoice).should('contain.text', 'Invoice Details')
    })

    it('should navigate to the invoice page on selection of Invoice Details option', () => {
      cy.getByData(testIds.invoice).should('contain.text', 'Invoice Details')
      cy.getByData(testIds.invoice).click()
      cy.url().should('include', testIds.url_invoice)
    })

    it('should render the invoice page', () => {
      cy.getByData(testIds.pageName).should('contain.text', 'Invoice Details')
    })

    it('should render the Placed At & Order fullfilled status', () => {
      cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
      cy.getByData(testIds.orderDetailspage_invoice_orderFullfilled).should('be.visible')
      cy.getByData(testIds.orderDetailspage_invoice_orderFullfilled).should('contain.text', '0 of 1')
    })

    it('should render the payment breakup details', () => {
      cy.getByData(testIds.orderDetailspage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹200.00')

        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹360.00')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹2,160.00')
      })
    })
  })
})
