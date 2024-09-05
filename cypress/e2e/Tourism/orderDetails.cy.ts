import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/TOURISM/checkoutPage/initResponse'
import { billingDetails, shippingDetails } from '../../fixtures/TOURISM/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/TOURISM/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/TOURISM/orderConfirmation/orderResponse'
import { statusResponse } from '../../fixtures/TOURISM/orderDetails/statusResponse'
import { updatedShippingDetailsResponse } from '../../fixtures/TOURISM/orderDetails/updateShippingDetails'

describe('Order Details Page', () => {
  const searchTerm = 'Manali'

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
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData('submit').click()
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.performTourismOrders(orderResponse, 'orderResponse')
    cy.performStatus(statusResponse('ACTIVE', 'ArrangingPayment'), 'processStatusResponse')

    cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', '/orderConfirmation')
    cy.wait('@confirmResponse')
    cy.wait('@orderResponse')
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.wait('@processStatusResponse')
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
      cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
      cy.getByData(testIds.orderDetailspage_order_fulfilled).should('be.visible')
    })

    it('should render the order details in progress summary section', () => {
      cy.getByData(testIds.orderDetailspage_orderId).should('exist')
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should(
        'contain.text',
        'Hampta Pass Trek - Manali One'
      )
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
        cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹22.00')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹222.00')
      })
    })
  })

  context('When order status is initiated with PROCESSING', () => {
    it('should render "ACTIVE" order status in progress summary', () => {
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

  context('When order status is updated to READY TO SHIP', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('ACTIVE', 'PaymentSettled'), 'readyToShipStatusResponse')
      cy.wait('@readyToShipStatusResponse')
    })

    it('should render "ACTIVE" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'ACTIVE')
    })

    it('should render the READY TO SHIP in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 2)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(1).should('contain.text', 'Ready to ship')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(1).should('exist')
      })
    })
  })

  context('When order status is updated to ORDER SHIPPED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('ACTIVE', 'Shipped'), 'shippedStatusResponse')
      cy.wait('@shippedStatusResponse')
    })

    it('should render "ACTIVE" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'ACTIVE')
    })

    it('should render the ORDER SHIPPED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 3)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(2).should('contain.text', 'Order Shipped')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(2).should('exist')
      })
    })
  })

  context('When order status is updated to ORDER DELIVERED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('COMPLETE', 'Delivered'), 'deliveredStatusResponse')
      cy.wait('@deliveredStatusResponse')
    })

    it('should render "COMPLETE" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'COMPLETE')
    })

    it('should render the ORDER DELIVERED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 4)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(3).should('contain.text', 'Order Delivered')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(3).should('exist')
      })
    })
  })

  context('Should handle tracking, support, cancel & update order', () => {
    before(() => {
      cy.performTrack({ fixture: 'TOURISM/orderDetails/trackResponse.json' }, 'trackResponse')
      cy.performSupport({ fixture: 'TOURISM/orderDetails/supportResponse.json' }, 'supportResponse')
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
          cy.performStatus(statusResponse('COMPLETE', 'Delivered'), 'statusResponse')
          cy.wait('@statusResponse')
        })
    })
  })
  context('should Navigate to another broweser when click on external link and procedd button', () => {
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
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
      cy.getByData('submit').click()
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', '/paymentMode')
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.performTourismOrders(orderResponse, 'orderResponse')
      cy.performStatus(statusResponse('ACTIVE', 'ArrangingPayment'), 'processStatusResponse')

      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', '/orderConfirmation')
      cy.wait('@confirmResponse')
      cy.wait('@orderResponse')
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.wait('@processStatusResponse')
    })
    it('should Click on proceed button and navigate', () => {
      cy.getByData(testIds.orderDetails_tourism_QR_external_link).click()
      cy.getByData(testIds.orderDetails_tourism_QR_procedd_button).click()
      cy.visit(
        'https://retail-prod.becknprotocol.io/signIn?external_url=https://beckn-order-json-dev.s3.ap-south-1.amazonaws.com/2024/8fc21a189c389c251139b2ef3198c1580e776ab84265852479ed864389c971f3_4cfb9798-b4f5-4496-b85a-4f26db086881.json'
      )
      // cy.url().should('include', 'https://retail-prod.becknprotocol.io')
    })
  })
})
