import { testIds } from '../../../shared/dataTestIds'
import { initResponse } from '../../fixtures/DSEP/checkoutPage/initResponse'
import { confirmResponse } from '../../fixtures/DSEP/orderConfirmation/confirmResponse'
import { orderResponse } from '../../fixtures/DSEP/orderConfirmation/orderResponse'
describe('Order Confirmation Page', () => {
  const searchTerm = 'Java'

  context('should render orderDetail Page when user click on View Order Details button', () => {
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
      cy.wait('@confirmResponse')
      cy.wait('@orderResponse')
      cy.url().should('include', '/orderConfirmation')
    })

    it('should display order confirmation details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should('contain.text', 'Course Reserved Successfully!')
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should(
        'contain.text',
        'Get ready to embark your learning journey!'
      )
    })

    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })

  context('should render My Learning Page  when user click on go My Learning button', () => {
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
      cy.wait('@confirmResponse')
      cy.wait('@orderResponse')
      cy.url().should('include', '/orderConfirmation')
    })
    it('should render homepage when click on go back to home', () => {
      cy.getByData(testIds.orderConfirmation_myLearning).click()
      cy.url().should('include', '/myLearningOrderHistory')
    })
  })
})
