import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/INDUSTRY4.0/checkoutPage/initResponse'
import { shippingDetails } from '../../fixtures/INDUSTRY4.0/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/INDUSTRY4.0/orderDetails/statusResponse'
import { updatedShippingDetailsResponse } from '../../fixtures/INDUSTRY4.0/orderDetails/updateShippingDetails'

describe('Order Details Page', () => {
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
    cy.fillAssemblyDetails()
    cy.performXinput_Submit({ fixture: 'INDUSTRY4.0/x-input/x-inputResult.json' }, 'xinputResponse')
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData('submit').click()
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_payment)
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.performOrders(orderResponse, 'orderResponse')
    cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', '/orderConfirmation')
    cy.wait('@confirmResponse')
    cy.wait('@orderResponse')
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.performStatus(statusResponse('ORDER ACCEPTED'), 'processStatusResponse')
    cy.wait('@processStatusResponse')
  })

  context('Should render all the different components of Order Details', () => {
    it('should render order details page', () => {
      cy.url().should('include', testIds.url_orderDetails)
      cy.getByData(testIds.orderDetails_progress_summary).should('be.visible')
      cy.getByData(testIds.orderDetails_assembly_text).should('be.visible')
      cy.getByData(testIds.orderDetailspage_rtlAssembly_line).should('be.visible')
    })
  })
  context('When Case is ORDER ACCEPTED ', () => {
    it('should render the initial PROCESS order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 1)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(0).should('contain.text', 'ORDER ACCEPTED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(0).should('be.visible')
      })
    })
  })

  context('When Case status is updated to ORDER_PROCESSING', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('ORDER_PROCESSING'), 'orderProcessingResponse')
      cy.wait('@orderProcessingResponse')
    })

    it('should render the ORDER_PROCESSING in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 2)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(1).should('contain.text', 'ORDER_PROCESSING')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(1).should('exist')
      })
    })
  })

  context('When order status is updated to ORDER_DISPATCHED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('ORDER_DISPATCHED'), 'orderDispatchResponse')
      cy.wait('@orderDispatchResponse')
    })

    it('should render the ORDER_DISPATCHED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 3)
        cy.getByData(testIds.orderDetailspage_orderStateName).eq(2).should('contain.text', 'ORDER_DISPATCHED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(2).should('exist')
      })
    })
  })
  context('When order status is updated to ORDER_SHIPPED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('ORDER_SHIPPED'), 'orderShippedResponse')
      cy.wait('@orderShippedResponse')
    })

    it('should render the ORDER_SHIPPED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 4)
        cy.getByData(testIds.orderDetailspage_orderStateName).eq(3).should('contain.text', 'ORDER_SHIPPED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(3).should('exist')
      })
    })
  })

  context('When order status is updated to ORDER_DELIVERED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('DELIVERED'), 'orderDeliveredResponse')
      cy.wait('@orderDeliveredResponse')
    })

    it('should render the ORDER_DELIVERED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 5)
        cy.getByData(testIds.orderDetailspage_orderStateName).eq(4).should('contain.text', 'DELIVERED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(4).should('exist')
      })
    })
  })

  context('Should handle tracking, support, cancel & update order', () => {
    before(() => {
      cy.performTrack({ fixture: 'INDUSTRY4.0/orderDetails/trackResponse.json' }, 'trackResponse')
      cy.performSupport({ fixture: 'INDUSTRY4.0/orderDetails/supportResponse.json' }, 'supportResponse')
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
          cy.performStatus(statusResponse('DELIVERED'), 'statusResponse')
          cy.wait('@statusResponse')
        })
    })
  })

  context('Should handle Invoice related tests', () => {
    it('should render the invoice modal on click of invoice icon and Render invoice details page', () => {
      cy.getByData(testIds.downloadInvoiceIcon).should('be.visible')
      cy.getByData(testIds.downloadInvoiceIcon).click()
      cy.getByData(testIds.invoice).click()
      cy.url().should('include', testIds.url_invoice)
      cy.getByData(testIds.invoiceDetaislPage_orderOverview).should('be.visible')
      cy.getByData(testIds.invoiceDetaislPage_assembly_text).should('be.visible')
      cy.getByData(testIds.invoiceDetaislPage_price).should('be.visible')
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
  })
})
