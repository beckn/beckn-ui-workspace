import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_tourism_url_base)
  })
  context('Sign in With Valid ID and Password', () => {
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
  })
  context('Home page', () => {
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_appTitle).should('be.visible')
      cy.getByData(testIds.homepage_appDescription).should('be.visible')
      cy.getByData(testIds.searchInput_container).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
    })

    it('should render the app title & description', () => {
      cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Travel Experience')
      cy.getByData(testIds.homepage_appDescription).should(
        'contain.text',
        "A global marketplace to discover anything you need. Just type where you want to go and we'll take care of the rest."
      )
      cy.getByData(testIds.homepage_searchInput).should('have.attr', 'placeholder', 'Search For Travel Location')
    })
  })
  context('Should apply filter on search results', () => {
    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type('Manali')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_searchInput).should('have.value', 'Manali, Himachal Pradesh, India')
      cy.getByData(testIds.homepage_search_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(17000)
    })
    it('should render the search page components', () => {
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.searchButton).should('be.visible')
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
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
    it('should handle sort by price option in filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Chandra Tal Trek - Manali')
    })

    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_filterByRating).select(1)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Chandra Tal Trek - Manali')
    })

    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_filterByRating).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Hampta Pass Trek - Manali - EACH')
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Chandra Tal Trek - Manali')
    })

    it('should select and render details of product', () => {
      cy.selectProduct(0)
      cy.url().should('include', `${testIds.url_search}?searchTerm=Manali`)
      const item_price = '₹14,500.00'
      cy.getByData(testIds.item_title).should('contain.text', 'Chandra Tal Trek - Manali')
      cy.getByData(testIds.item_rating).eq(4)
      cy.getByData(testIds.item_description).should(
        'contain.text',
        'It is called Moon Lake because of its crescent shape and is the origin of Chander River.'
      )
      cy.getByData(testIds.item_price).should('contain.text', item_price)
      cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_counterValue).should('be.visible')
      cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Book Now')
    })
    it('should not able to decrement the count when total count is 1', () => {
      cy.getByData(testIds.productpage_decrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
    })
    it('should increment the count', () => {
      cy.getByData(testIds.productpage_incrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
    })
    it('should navigate to Checkout Page on Book Now Button click', () => {
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
      cy.getByData(testIds.productpage_addTocartButton).click()
      //cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', testIds.url_checkout)
    })
    it('should display the item details', () => {
      const item_price = '₹14,500.00'
      cy.getByData(testIds.item_details).should('have.length', 1)
      cy.getByData(testIds.item_title).should('contain.text', 'Chandra Tal Trek - Manali')
      cy.getByData(testIds.item_quantity).should('contain.text', 2)
      cy.getByData(testIds.item_price).should('contain.text', '₹29,000.00')
    })
  })
  context('Filling Traveller details', () => {
    it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
    })
    it('should fill and save the shipping form data', () => {
      cy.wait(300)
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).first().click()
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
    it('should validate billing form fields', () => {
      cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
        cy.getByData(testIds.checkoutpage_changeFormDetails).click()
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
        })
    })

    context('Payment details and checkout', () => {
      it('should display the payment section', () => {
        cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
      })

      it('should display the payment breakup details', () => {
        cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
          cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
          cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹29,000.00')
          cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
          cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹5,220.00')
          cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
          cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹34,220.00')
        })
      })

      it('should proceed to checkout when valid data is provided', () => {
        cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
        cy.url().should('include', '/paymentMode')
      })
    })
  })
  context('Payment details and checkout', () => {
    it('should display payment Page with Result', () => {
      cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
      cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
      cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
      cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash on Arrival')
      cy.getByData(testIds.paymentpage_image).should('have.attr', 'src')
    })
    it('should display payment method images and radio button', () => {
      cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
    })

    it('should disable the confirm button when no radio button is selected', () => {
      cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).contains('Confirm Booking').should('be.disabled')
    })

    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.wait(3000)
      cy.url().should('include', testIds.url_orderConfirmation)
    })
  })
  context('Order confirmation', () => {
    it('should display order confirmation details after API call', () => {
      cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
      cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'Order Placed!')
      cy.getByData(testIds.orderConfirmation_gratefulMessage).should(
        'contain.text',
        'Thank you! Your booking will be confirm shortly!'
      )
      cy.getByData(testIds.orderConfirmation_trackOrderMessage).should(
        'contain.text',
        'You can track your order in "My Order" section'
      )
    })
    it('should render the correct order ID', () => {
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('exist')
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is:`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
    //For Go Back click
    // it('should render homepage when click on go back to home', () => {
    //     cy.getByData(testIds.orderConfirmation_goBackToHome).click()
    //     cy.url().should('include', testIds.url_home)
    // })
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
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('contain.text', 'Chandra Tal Trek - Manali')
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
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹29,000.00')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹5,220.00')
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹34,220.00')
      })
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
  })
  context('Retail Flow', () => {
    it('should Click on proceed button and navigate to Retail App', () => {
      cy.getByData(testIds.orderDetails_tourism_QR_external_link).click()
      cy.getByData(testIds.orderDetails_tourism_QR_procedd_button).click()
      cy.visit(
        'https://retail-dev.becknprotocol.io/signIn?external_url=https://beckn-order-json-dev.s3.ap-south-1.amazonaws.com/2024/8fc21a189c389c251139b2ef3198c1580e776ab84265852479ed864389c971f3_4cfb9798-b4f5-4496-b85a-4f26db086881.json'
      )
    })
  })
  context('Login into Retail Flow', () => {
    it('Should login in retail app', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.homepage_viewChatGPTList).click()
      cy.wait(12000)
      cy.getByData(testIds.chat_gpt_list).eq(0).click()
      cy.getByData('chat_gpt_button').click()
      cy.getByData('chat-Gpt-List-Radio-Button').eq(1).click()
      cy.getByData('chat_gpt_address_button').click()
      cy.wait(17000)
    })
  })
  context('Search the product', () => {
    it('should render the search page components', () => {
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.searchButton).should('be.visible')
      cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
      cy.getByData(testIds.searchpage_resetBtn).should('be.visible')
      cy.getByData(testIds.searchpage_sortByPrice).should('be.visible')
      cy.getByData(testIds.searchpage_filterByRating).should('be.visible')
      cy.getByData(testIds.searchpage_applyFilter).should('be.visible')
    })
    it('should render the filter section with default values', () => {
      cy.getByData(testIds.searchpage_sortByPrice).should('contain.text', 'Price')
      cy.getByData(testIds.searchpage_filterByRating).should('contain.text', 'Rating')
    })
    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(1)
      cy.getByData(testIds.searchpage_applyFilter).click()
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).first().click()
    })
  })
  context('Verify and select product', () => {
    it('should render details of selected product', () => {
      cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_counterValue).should('be.visible')
      cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Add To Cart')
    })
    it('should add product in cart on add to cart btn click', () => {
      cy.getByData(testIds.productpage_incrementCounter).click()
      cy.getByData(testIds.productpage_decrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.feedback).should('contain.text', 'Product added to cart')
    })
    it('should navigate to cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
    })
    it('Should conatin order Button and click on it render it on checkout page', () => {
      cy.getByData(testIds.cartpage_productPrice).should('be.visible')
      cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Order')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
  })
  context('Add Billing and Shipping details', () => {
    it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
    })
    it('should display the item details', () => {
      cy.getByData(testIds.item_details).should('have.length', 1)
      cy.getByData(testIds.item_quantity).should('contain.text', 1)
    })
    it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
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
    it('should validate billing form fields', () => {
      cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
        cy.getByData(testIds.checkoutpage_changeFormDetails).click()
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
        })
    })
    it('should display the payment section', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
    })
  })
  context('Should proceed to checkout ', () => {
    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    })
    it('should display payment Page with Result', () => {
      cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
      cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
      cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
      cy.getByData(testIds.paymentpage_phonePay).should('contain.text', 'PhonePe UPI')
      cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash on Delivery')
      cy.getByData(testIds.paymentpage_image).should('have.attr', 'src')
    })
    it('should display payment method images and radio button', () => {
      cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
    })

    it('should disable the confirm button when no radio button is selected', () => {
      cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).contains('Confirm Order').should('be.disabled')
    })

    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', testIds.url_orderConfirmation)
    })
    it('should render order details when click view order details button', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
      cy.wait(500)
    })
    it('should render the diff sections of order detail page', () => {
      cy.getByData(testIds.orderDetailspage_orderOverview).should('be.visible')
      cy.getByData(testIds.orderDetailspage_progressSummary).should('be.visible')
      cy.getByData(testIds.orderDetailspage_shippingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_paymentDetails).should('be.visible')
    })
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
  })
  context('Logout from Retail App', () => {
    it('Should Logout from Retail App', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
