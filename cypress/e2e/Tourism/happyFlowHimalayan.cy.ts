import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('Happy flow of Himalayan', () => {
  before(() => {
    cy.visit(testIds.deployed_tourism_url_base)
  })
  context('Hiamalayan Flow', () => {
    // Valid login scenarios
    it('should Sign In with valid ID and Password', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type('Manali')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_searchInput).should('have.value', 'Manali, Himachal Pradesh, India')
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
      cy.selectProduct(0)
      cy.url().should('include', `${testIds.url_search}?searchTerm=Manali`)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).first().click()

      cy.getByData('submit').click()
    })
    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹14,500.00')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹2,610.00')
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹17,110.00')
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
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹14,500.00')

        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹2,610.00')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹17,110.00')
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
    it('should Click on proceed button and navigate to Retail App', () => {
      cy.getByData(testIds.orderDetails_tourism_QR_external_link).click()
      cy.getByData(testIds.orderDetails_tourism_QR_procedd_button).click()
      cy.visit(
        'https://retail-dev.becknprotocol.io/signIn?external_url=https://beckn-order-json-dev.s3.ap-south-1.amazonaws.com/2024/8fc21a189c389c251139b2ef3198c1580e776ab84265852479ed864389c971f3_4cfb9798-b4f5-4496-b85a-4f26db086881.json'
      )
    })
    it('Should login in retail app', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.homepage_viewChatGPTList).click()
      cy.wait(12000)
      cy.getByData(testIds.chat_gpt_list).eq(0).click()
      cy.getByData(testIds.chat_gpt_button).click()
      cy.getByData(testIds.chat_Gpt_List_Radio_Button).click()
      cy.getByData(testIds.chat_gpt_address_button).click()
      cy.wait(17000)
    })
    it('Should select and add product to cart', () => {
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.cartButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_cartOrderButton).click()
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
    it('Should Add details and checkout', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
      cy.getByData(testIds.checkoutpage_form).should('be.visible')

      cy.getByData(testIds.checkoutpage_shippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData('submit').click()
        })
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', '/paymentMode')
      cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', testIds.url_orderConfirmation)
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    })

    it('Should check other details', () => {
      cy.getByData(testIds.orderDetailspage_otherOptions).click()
      cy.wait(300)
      cy.getByData(testIds.orderDetailspage_menus).should('exist')
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(0).should('contain.text', 'Track Order')
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(2).should('contain.text', 'Cancel Order')
      cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(0).should('contain.text', 'Call Customer Service')
      cy.get('body').type('{esc}')
    })
    it('Should Logout from Retail App', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
