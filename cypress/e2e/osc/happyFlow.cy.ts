import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('Happy flow of OSC', () => {
  function verifyPrice(expectedPrice: string, index: number = 0) {
    cy.getByData(testIds.item_price)
      .eq(index)
      .should($price => {
        const priceText = $price.text().replace(/\u00A0/g, ' ') // Handle non-breaking space
        expect(priceText).to.contain(expectedPrice)
      })
  }
  before(() => {
    cy.visit(testIds.deployed_osc_url_base)
  })
  context('OSC Flow', () => {
    // Valid login scenarios
    it('should Sign In with valid ID and Password', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_appTitle).should('be.visible')
      cy.getByData(testIds.homepage_appDescription).should('be.visible')
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
    })
    it('should render the app title & description', () => {
      cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Localee Open')
      cy.getByData(testIds.homepage_appDescription).should(
        'contain.text',
        "A global marketplace to discover and buy anything you need. Just type what you want to buy and we'll take care of the rest."
      )
    })
    //Search By Location
    it('should perform navigate on click serach store by location', () => {
      cy.getByData(testIds.search_By_Location_Text).click()
      cy.url().should('include', `${testIds.url_search_StoreBy_Location}`)
    })
    it('Should render Search By Location Page with all Component', () => {
      cy.url().should('include', `${testIds.url_search_StoreBy_Location}`)
      cy.getByData(testIds.map_search_input_container).should('be.visible')
      cy.getByData(testIds.map_search_input).should('be.visible')
      cy.getByData(testIds.map_container).should('be.visible')
      cy.getByData(testIds.option_card).should('be.visible')
    })
    // should remove
    it('Should Click option card and type Paris in Input to get store', () => {
      cy.getByData(testIds.option_card).contains('Restaurant').click()
      cy.getByData(testIds.map_search_input).type('Ménilmontant - Pelleport, Paris, France')
      cy.getByData(testIds.locationList).should('be.visible')
      cy.getByData(testIds.location_List_item).eq(1).click()
      cy.get('img[alt="Marker"]').eq(2).click()
      cy.getByData(testIds.searchBy_Location_shop_button).click()
      cy.url().should('include', `${testIds.url_search}`)
      cy.wait(17000)
    })
    it('should render the search page components', () => {
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.searchButton).should('be.visible')
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
    })
    it('should render the filter section with default values', () => {
      cy.getByData(testIds.searchpage_sortByPrice).should('contain.text', 'Price')
      cy.getByData(testIds.searchpage_filterByRating).should('contain.text', 'Rating')
    })
    it('should perform search and display results', () => {
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).eq(9).click() //cheesecake
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.wait(4000)
      cy.getByData(testIds.cartButton).click()
    })
    it('should render and display cart page with result', () => {
      cy.getByData(testIds.cartpage_itemImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_itemName).should('be.visible')
      cy.getByData(testIds.cartpage_productPrice).should('be.visible')
      cy.url().should('include', testIds.url_cart)
    })
    it('should render and display cart page Order Summary ', () => {
      cy.getByData(testIds.cartpage_orderSummaryText).should('contain.text', 'order Summary')
      cy.getByData(testIds.cartpage_totalQuantityText).should('contain.text', 'Total Quantity')
      cy.getByData(testIds.cartpage_totalAmountText).should('contain.text', 'Total Amount')
    })
    it('Should conatin order Button and click on it render it on checkout page', () => {
      cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Proceed to checkout')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
    it('should fill and save the shipping form data', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
      cy.getByData(testIds.checkoutpage_form).should('be.visible')

      cy.getByData(testIds.checkoutpage_shippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().type(shippingDetails.name)
          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(shippingDetails.mobileNumber)
          cy.getByData(testIds.checkoutpage_email).clear().type(shippingDetails.email)
          cy.getByData(testIds.checkoutpage_address).clear().type(shippingDetails.address)
          cy.getByData(testIds.checkoutpage_pinCode).clear().type(shippingDetails.pinCode)
          cy.getByData('submit').click()
        })
    })
    it('should handle the "same as shipping" checkbox for billing form data', () => {
      cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
        cy.getByData(testIds.checkoutpage_checkbox).get('input').check()
        cy.getByData(testIds.checkoutpage_checkbox).click()
        cy.getByData(testIds.checkoutpage_changeFormDetails).click()
      })
      cy.getByData(testIds.checkoutpage_billingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).should('contain.value', shippingDetails.name)
          cy.getByData(testIds.checkoutpage_mobileNumber).should('contain.value', shippingDetails.mobileNumber)
          cy.getByData(testIds.checkoutpage_email).should('contain.value', shippingDetails.email)
          cy.getByData(testIds.checkoutpage_address).should('contain.value', shippingDetails.address)
          cy.getByData(testIds.checkoutpage_pinCode).should('contain.value', shippingDetails.pinCode)
        })
      cy.getByData(testIds.checkoutpage_billingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
    })
    it('should fill and save the billing form data', () => {
      cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
        cy.getByData(testIds.checkoutpage_changeFormDetails).click()
      })
      cy.getByData(testIds.checkoutpage_billingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().type(billingDetails.name)
          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(billingDetails.mobileNumber)
          cy.getByData(testIds.checkoutpage_email).clear().type(billingDetails.email)
          cy.getByData(testIds.checkoutpage_address).clear().type(billingDetails.address)
          cy.getByData(testIds.checkoutpage_pinCode).clear().type(billingDetails.pinCode)
          cy.getByData('submit').click()
          cy.wait(500)
        })
    })
    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        verifyPrice('4,80 €')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('0,86 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('5,66 €', 3)
      })
    })
    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', '/paymentMode')
    })
    it('should display payment method images and radio button', () => {
      cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
    })
    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
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
    it('should render the payment breakup details', () => {
      cy.getByData(testIds.orderDetailspage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        verifyPrice('4,80 €')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('0,86 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('5,66 €', 3)
      })
    })

    //Check for 'Search By Product' is working or not

    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.home_icon).click()
      cy.getByData(testIds.searchInput).type('cake')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', `${testIds.url_search}?searchTerm=cake`)
      cy.wait(17000)
    })
    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${'cake'}`)
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })
    it('Should Logout from Retail App', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
