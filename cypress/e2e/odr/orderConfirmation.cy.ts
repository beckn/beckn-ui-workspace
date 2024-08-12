import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/ODR/checkoutPage/initResponse'
import { complaintsDetails, respondentDetails } from '../../fixtures/ODR/checkoutPage/userDetails'
import { confirmResponse } from '../../fixtures/ODR/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/ODR/orderConfirmation/orderResponse'
describe('Order Confirmation Page', () => {
  const searchTerm = 'mediation'

  context('should render orderDetail Page when user click on View Order Details button', () => {
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

      //on checkout page filled compliant details form
      cy.fillComplaintDetails(complaintsDetails)
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')

      //on checkout page filled compliant details form
      cy.fillRespondentDetails(respondentDetails)
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')

      //on checkout page filled dispute details form
      cy.fillDisputeDetails()
      cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/disputeSubmitFormResponse.json' }, 'disputeFormResponse')

      //on checkout page filled consent details form
      cy.fillConsentDetails()
      cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/consentFormResponse.json' }, 'consentFormResponse')

      //on checkout page all form filled and click on proceed button
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_orderConfirmation)
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.wait('@confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.wait('@orderResponse')
    })

    it('should display order confirmation details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'ORDER SUCCESFULL')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should('contain.text', 'Thank you for your order!')
      cy.getByData(testIds.orderConfirmation_trackOrderMessage).should(
        'contain.text',
        'You can track your order in "My Order" section'
      )
    })
    it('should render the correct order ID', () => {
      const orderId = '1001'
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is: ${orderId}`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })

  context('should render Homepage when user click on go back to home button', () => {
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
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.performSelect({ fixture: 'ODR/checkoutPage/selectResponse.json' }, 'selectResponse')
      cy.wait('@selectResponse')
      //on checkout page filled compliant details form
      cy.fillComplaintDetails(complaintsDetails)
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')

      //on checkout page filled respondent details form
      cy.fillRespondentDetails(respondentDetails)
      cy.performInit(initResponse, 'initResponse')
      cy.wait('@initResponse')

      //on checkout page filled dispute details form
      cy.fillDisputeDetails()
      cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/disputeSubmitFormResponse.json' }, 'disputeFormResponse')

      //on checkout page filled consent details form
      cy.fillConsentDetails()
      cy.performXinputSubmit({ fixture: 'ODR/checkoutPage/consentFormResponse.json' }, 'consentFormResponse')

      //on checkout page all form filled and click on proceed button
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_orderConfirmation)
      cy.performConfirm(confirmResponse, 'confirmResponse')
      cy.wait('@confirmResponse')
      cy.performOrders(orderResponse, 'orderResponse')
      cy.wait('@orderResponse')
    })

    it('should render homepage when click on go back to home', () => {
      cy.getByData(testIds.orderConfirmation_goBackToHome).click()
      cy.url().should('include', testIds.url_home)
    })
  })
})
