import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('Happy flow of Himalayan', () => {
  function verifyPrice(expectedPrice: string, index: number = 0) {
    cy.getByData(testIds.item_price)
      .eq(index)
      .should($price => {
        const priceText = $price.text().replace(/\u00A0/g, ' ') // Handle non-breaking space
        expect(priceText).to.contain(expectedPrice)
      })
  }
  before(() => {
    cy.visit(testIds.deployed_tourism_url_base)
  })
  context('City Of Light Flow', () => {
    // Valid login scenarios
    it('should Sign In with valid ID and Password', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type('Paris')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_searchInput).should('have.value', 'Paris, France')
      cy.getByData(testIds.homepage_search_button).click()
      cy.wait(17000)
    })
    it('should render the filter section with sort & reset options', () => {
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
      cy.getByData(testIds.searchpage_resetBtn).should('be.visible')
      cy.getByData(testIds.searchpage_sortByPrice).should('be.visible')
      cy.getByData(testIds.searchpage_filterByRating).should('be.visible')
      cy.getByData(testIds.searchpage_applyFilter).should('be.visible')
      cy.getByData(testIds.searchpage_sortByPrice).should('contain.text', 'Price')
      cy.getByData(testIds.searchpage_filterByRating).should('contain.text', 'Rating')
    })
    it('should select and add Billing & Shipping details', () => {
      cy.selectProduct(2)
      cy.url().should('include', `${testIds.url_search}?searchTerm=Paris`)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).first().click()

      cy.getByData('submit').click()
    })
    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        verifyPrice('17,00 €', 0)
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('3,06 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('20,06', 3)
      })
    })
    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', '/paymentMode')
    })
    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.wait(3000)
      cy.url().should('include', testIds.url_orderConfirmation)
    })
    it('should render the correct order ID', () => {
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('exist')
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is:`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
    it('should render the payment breakup details', () => {
      cy.getByData(testIds.orderDetailspage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        verifyPrice('17,00 €', 0)
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('3,06 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('20,06', 3)
      })
    })
    it('should render all the option in Other options modal', () => {
      cy.getByData(testIds.orderDetailspage_otherOptions).click()
      cy.wait(100)
      cy.getByData(testIds.orderDetailspage_menus).should('exist')
      cy.getByData(testIds.orderDetailspage_menus).within(() => {
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(0).should('contain.text', 'Track Order')
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
        cy.getByData(testIds.orderDetailspage_menuItemName).eq(2).should('contain.text', 'Cancel Order')
        cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(0).should('contain.text', 'Call Customer Service')
        cy.getByData(testIds.orderDetailspage_callServiceItemName)
          .eq(1)
          .should('contain.text', 'Email Customer Service')
      })
      cy.get('body').type('{esc}')
    })
  })
  context('Retail Flow', () => {
    //Test Ids Are not available
  })
})
