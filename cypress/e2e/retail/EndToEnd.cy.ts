import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
describe('End to End test cases for Retail app', () => {
  before(() => {
    cy.visit(testIds.deployed_url_base)
  })
  context('Sign In Page', () => {
    it('should display the sign-in form elements and handle form submission states', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_loginButton).should('be.disabled')
      cy.getByData(testIds.auth_registerButton).should('be.enabled')
    })

    it('should handle invalid login scenarios', () => {
      const invalidEmail = 'sanket.com'
      const invalidPassword = 'password'
      const unregisteredEmail = 'unregistered@example.com'
      const unregisteredPassword = 'unreg@Pass123'

      // Invalid email and password
      cy.getByData(testIds.auth_inputEmail).clear().type(invalidEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(invalidPassword)
      cy.getByData(testIds.auth_loginButton).should('be.disabled')

      // Invalid password with valid email
      cy.getByData(testIds.auth_inputEmail).clear().type(testIds.user_validEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(testIds.user_invalidPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')

      // Unregistered email and password
      cy.getByData(testIds.auth_inputEmail).clear().type(unregisteredEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(unregisteredPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanketbk@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(2000)
    })
  })
  context('Landing Page', () => {
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_appTitle).should('be.visible').and('contain.text', 'Kuza One')
      cy.getByData(testIds.homepage_appDescription)
        .should('be.visible')
        .and(
          'contain.text',
          "A global marketplace to discover anything you need. Just type where you want to go and we'll take care of the rest."
        )
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
      cy.getByData(testIds.threeDots).should('be.visible')
    })
  })
  context('My Profile Section', () => {
    it('should display profile, order history, and logout options, then navigate to the profile page', () => {
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.profile_text_click).should('be.visible')
      cy.getByData(testIds.orderHistory_text_click).should('be.visible')
      cy.getByData(testIds.Logout_text_click).should('be.visible')
      cy.getByData(testIds.profile_text_click).click()
    })

    it('should validate profile form fields', () => {
      cy.wait(1000)
      cy.getByData(testIds.profile_form).within(() => {
        cy.getByData(testIds.profile_inputName).clear().blur()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(testIds.profile_inputName).clear().type('1235').blur()
        cy.contains('Name can only contain letters and spaces').should('be.visible')

        cy.getByData(testIds.profile_inputMobileNumber).clear().type('12345').blur()
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(testIds.profile_city).clear().blur()
        cy.contains('City is Required').should('be.visible')

        cy.getByData(testIds.profile_zipCode).clear().blur()
        cy.contains('Zip Code is required').should('be.visible')

        cy.getByData(testIds.profile_zipCode).clear().type('1235').blur()
        cy.contains('Invalid Zip Code').should('be.visible')
        cy.getByData(testIds.profile_zipCode).clear().type('abcd').blur()
        cy.contains('Invalid Zip Code').should('be.visible')

        cy.getByData(testIds.profile_state).clear().blur()
        cy.contains('State is Required').should('be.visible')

        cy.getByData(testIds.profile_country).clear().blur()
        cy.contains('Country is Required').should('be.visible')

        cy.getByData(testIds.profile_saveandContinue).should('be.disabled')
      })
    })

    it('should fill and save the profile form data, click on Save and Continue, and navigate to the homepage', () => {
      const profileDetails = {
        name: 'John Doe',
        mobileNumber: '8275229011',
        city: 'Pune',
        zipCode: '444888',
        state: 'Maharashtra',
        country: 'India'
      }
      cy.getByData(testIds.profile_form)
        .should('be.visible')
        .within(() => {
          cy.getByData(testIds.profile_inputName).clear().type(profileDetails.name)
          cy.getByData(testIds.profile_inputMobileNumber).clear().type(profileDetails.mobileNumber)
          cy.getByData(testIds.profile_city).clear().type(profileDetails.city)
          cy.getByData(testIds.profile_zipCode).clear().type(profileDetails.zipCode)
          cy.getByData(testIds.profile_state).clear().type(profileDetails.state)
          cy.getByData(testIds.profile_country).clear().type(profileDetails.country)
          cy.getByData(testIds.profile_saveandContinue).click()
        })
    })
  })
  context('Search Functionality', () => {
    it('should handle wrong search keyword gracefully', () => {
      const searchTerm = 'cake'
      cy.getByData(testIds.searchInput).type(searchTerm)
      cy.getByData(testIds.searchButton).click()
      cy.wait(18000)
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
      cy.getByData(testIds.goBack).click()
    })
    //Empty cart
    it('should render the cart page with no items', () => {
      const searchTerm = 'sunglasses'
      cy.getByData(testIds.searchInput).clear().type(searchTerm)
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.cartButton).click()
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(testIds.cartpage_emptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Shop')
      cy.getByData(testIds.cartpage_emptyButton).click()
    })

    it('should render home page component for sunglasses', () => {
      const searchTerm = 'sunglasses'
      cy.getByData(testIds.searchInput).clear().type(searchTerm)
      cy.getByData(testIds.searchButton).click()
      cy.wait(16000)
    })

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
  })
  context('Sort Functionality', () => {
    it('should handle filter by price option in filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(1)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products)
        .eq(0)
        .should('contain.text', 'Adult Hiking Sunglasses Cat 3 - MH140 Dark Grey')
    })
    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_filterByRating).select(1)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products)
        .eq(0)
        .should('contain.text', 'Quechua MH140 Polarized Category 3 Hiking Sunglasses - Sunglasses')
    })
    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products)
        .eq(0)
        .should('contain.text', 'Quechua MH140 Polarized Category 3 Hiking Sunglasses - Sunglasses')
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).contains('Adult Hiking Sunglasses Cat 3 - MH140 Dark Grey').click()
    })
  })
  context('Product Details', () => {
    it('should render details of the selected product', () => {
      cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_counterValue).should('be.visible')
      cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Add To Cart')
    })

    it('should add product to the cart on add to cart button click', () => {
      cy.getByData(testIds.productpage_incrementCounter).click()
      cy.getByData(testIds.productpage_decrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.feedback).should('contain.text', 'Product added to cart')
    })
  })
  context('Cart Functionality', () => {
    it('should navigate to the cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
    })
    it('should contain an order button and render checkout page on click', () => {
      cy.getByData(testIds.cartpage_productPrice).should('be.visible')
      cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Order')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
  })
  context('Checkout Functionality', () => {
    it('should check if the shipping, billing, and payment sections are rendered and proceed button is enabled', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
    })
    it('should display the item details', () => {
      cy.getByData(testIds.item_details).should('have.length', 1)
      //cy.getByData(testIds.item_title).should('contain.text', 'sunglass One')
      cy.getByData(testIds.item_quantity).should('contain.text', 1)
      //cy.getByData(testIds.item_price).should('contain.text', '₹3600.00')
    })
    it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
    })
    it('should validate shipping form fields', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()

      cy.getByData(testIds.checkoutpage_shippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().blur()
          cy.contains('Name is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
          cy.contains('Invalid Mobile Number').should('be.visible')

          cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
          cy.contains('Invalid email format').should('be.visible')

          cy.getByData(testIds.checkoutpage_address).clear().blur()
          cy.contains('Complete Address is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
          cy.contains('Invalid Zip Code').should('be.visible')

          cy.getByData('submit').should('be.disabled')
        })
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
    })
  })
  context('Billing and Shipping Details', () => {
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
      cy.getByData(testIds.checkoutpage_billingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().blur()
          cy.contains('Name is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
          cy.contains('Invalid Mobile Number').should('be.visible')

          cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
          cy.contains('Invalid email format').should('be.visible')

          cy.getByData(testIds.checkoutpage_address).clear().blur()
          cy.contains('Complete Address is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
          cy.contains('Invalid Zip Code').should('be.visible')

          cy.getByData('submit').should('be.disabled')
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
  })
  context('Payment Details', () => {
    it('should display the payment section', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
    })
    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹1,699.00')

        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹305.82')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹2,004.82')
      })
    })
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
  })
  context('Product Checkout Functionality', () => {
    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', testIds.url_orderConfirmation)
    })
  })
  context('Order Details', () => {
    it('should render order details when click view order details button', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
      cy.wait(5000)
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
  })
  context('Order History', () => {
    it('should navigate to order History page when click on perticular order Id', () => {
      cy.getByData(testIds.home_icon).click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.getByData(testIds.order_history_main_container).eq(0).click()
      cy.url().should('include', testIds.url_orderDetails)
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
      it('should render the payment breakup details', () => {
        cy.getByData(testIds.orderDetailspage_paymentDetails).within(() => {
          cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
          cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹1,699.00')
          cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
          cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹305.82')
          cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
          cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹2,004.82')
        })
      })
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
