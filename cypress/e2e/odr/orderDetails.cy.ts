import { statusResponse } from '../../fixtures/ODR/orderDetails/statusResponse'
import { updatedShippingDetailsResponse } from '../../fixtures/ODR/orderDetails/updateShippingDetails'

import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/ODR/checkoutPage/initResponse'
import { complaintsDetails, respondentDetails } from '../../fixtures/ODR/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/ODR/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/ODR/orderConfirmation/orderResponse'

describe('Order Details Page', () => {
  const searchTerm = 'mediation'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'ODR/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.performSelect({ fixture: 'ODR/checkoutPage/selectResponse.json' }, 'selectResponse')
    cy.wait('@selectResponse')
    cy.fillComplaintDetails(complaintsDetails)
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.fillRespondentDetails(respondentDetails)
    cy.performInit(initResponse, 'initResponse')
    cy.wait('@initResponse')
    cy.fillDisputeDetails()
    cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/disputeSubmitFormResponse.json' }, 'disputeFormResponse')
    cy.fillConsentDetails()
    cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/consentFormResponse.json' }, 'consentFormResponse')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_orderConfirmation)
    cy.performConfirm(confirmResponse, 'confirmResponse')
    cy.wait('@confirmResponse')
    cy.performOrders(orderResponse, 'orderResponse')
    cy.wait('@orderResponse')

    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.performStatus(statusResponse('REQUEST_RECEIVED'), 'processStatusResponse')
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
    })

    it('should render the order product details in order overview section', () => {
      cy.getByData(testIds.orderDetailspage_productName).should('contain.text', 'Conciliation Services')
      cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
    })

    it('should render the order details in progress summary section', () => {
      cy.getByData(testIds.orderDetailspage_orderId).should('include.text', '1001')
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('contain.text', 'Alpha Pvt Ltd., India.')
    })

    it('should render the shipping details', () => {
      cy.getByData(testIds.orderDetailspage_shippingDetails).within(() => {
        cy.getByData(testIds.orderDetailspage_name).should('contain.text', complaintsDetails.name)
        cy.getByData(testIds.orderDetailspage_address).eq(0).should('contain.text', complaintsDetails.email)
        cy.getByData(testIds.orderDetailspage_mobileNumber).eq(0).should('contain.text', complaintsDetails.mobileNumber)
      })
    })

    it('should render the billing details', () => {
      cy.getByData(testIds.orderDetailspage_billingDetails).within(() => {
        cy.getByData(testIds.orderDetailspage_name).should('contain.text', respondentDetails.name)
        cy.getByData(testIds.orderDetailspage_address).eq(0).should('contain.text', respondentDetails.address)
        cy.getByData(testIds.orderDetailspage_mobileNumber).eq(0).should('contain.text', respondentDetails.mobileNumber)
      })
    })
  })

  context('When Case is REQUEST_RECEIVED ', () => {
    it('should render "REQUEST_RECEIVED" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'REQUEST_RECEIVED')
    })

    it('should render the initial PROCESS order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 1)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(0).should('contain.text', 'REQUEST_RECEIVED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(0).should('be.visible')
      })
    })
  })

  context('When Case status is updated to UNDER_INVESTIGATION', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('UNDER_INVESTIGATION'), 'underInvistigationResponse')
      cy.wait('@underInvistigationResponse')
    })

    it('should render "UNDER_INVESTIGATION" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'UNDER_INVESTIGATION')
    })

    it('should render the UNDER_INVESTIGATION in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 2)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(1).should('contain.text', 'UNDER_INVESTIGATION')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(1).should('exist')
      })
    })
  })

  context('When order status is updated to RESOLVED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('RESOLVED'), 'resolvedStatusResponse')
      cy.wait('@resolvedStatusResponse')
    })

    it('should render "RESOLVED" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'RESOLVED')
    })

    it('should render the RESOLVED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 3)
        cy.getByData(testIds.orderDetailspage_orderStateName).eq(2).should('contain.text', 'RESOLVED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(2).should('exist')
      })
    })
  })

  context('When order status is updated to CLOSED', () => {
    before(() => {
      cy.reload()
      cy.performStatus(statusResponse('CLOSED'), 'closedStatusResponse')
      cy.wait('@closedStatusResponse')
    })

    it('should render "CLOSED" order status in progress summary', () => {
      cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'CLOSED')
    })

    it('should render the CLOSED in order status map', () => {
      cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
        cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 4)

        cy.getByData(testIds.orderDetailspage_orderStateName).eq(3).should('contain.text', 'CLOSED')
        cy.getByData(testIds.orderDetailspage_orderStateTime).eq(3).should('exist')
      })
    })
  })

  context('Should handle tracking, support, cancel & update order', () => {
    before(() => {
      cy.performTrack({ fixture: 'ODR/orderDetails/trackResponse.json' }, 'trackResponse')
      cy.performSupport({ fixture: 'ODR/orderDetails/supportResponse.json' }, 'supportResponse')
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
          cy.getByData('submit').should('be.disabled')
        })
    })

    it('should render success feedback modal when fill and save the update shipping form data', () => {
      cy.performUpdateOrder(updatedShippingDetailsResponse, 'updateOrder')
      cy.getByData(testIds.checkoutpage_form).should('be.visible')

      cy.getByData(testIds.orderDetailspage_updateShippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().type(complaintsDetails.name)
          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(complaintsDetails.mobileNumber)
          cy.getByData(testIds.checkoutpage_email).clear().type(complaintsDetails.email)
          cy.getByData('submit').click()
          cy.wait('@updateOrder')
          cy.url().should('include', testIds.url_orderDetails)
          cy.performStatus(statusResponse('CLOSED'), 'closedStatusResponse')
          cy.wait('@closedStatusResponse')
        })
    })
  })

  context('Should Visible rate us Component', () => {
    it('Should visible Rate us Component and Click on it should navigate to feedback page', () => {
      cy.getByData(testIds.rateUsBox).should('be.visible')
      cy.getByData(testIds.orderDetails_rateUs_mainContainer).click()
      cy.url().should('include', testIds.url_feedback)
    })
  })
})
