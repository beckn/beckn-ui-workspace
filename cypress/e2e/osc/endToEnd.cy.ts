import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('End to End Flow', () => {
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
  context('Sign in With Valid ID and Password', () => {
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
  })
  context('Home page and components', () => {
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
  })
  context('Should render and validate My Profile page', () => {
    it('should display profile, order history, and logout options, then navigate to the profile page after clicking the three dots menu', () => {
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.profile_text_click).should('be.visible')
      cy.getByData(testIds.orderHistory_text_click).should('be.visible')
      cy.getByData(testIds.Logout_text_click).should('be.visible')
      cy.getByData(testIds.profile_text_click).click()
      cy.performProfile({ fixture: 'profile/profileResponse.json' }, 'profileResponse')
    })
    it('should validate profile form fields', () => {
      cy.getByData(testIds.profile_form).within(() => {
        cy.getByData(testIds.profile_inputName).clear()
        cy.contains('Name is required').should('be.visible')

        cy.getByData(testIds.profile_inputName).clear().type('1235')
        cy.contains('Name can only contain letters and spaces').should('be.visible')

        cy.getByData(testIds.profile_inputMobileNumber).clear().type('12345')
        cy.contains('Invalid Mobile Number').should('be.visible')

        cy.getByData(testIds.profile_city).clear()
        cy.contains('City is Required').should('be.visible')

        cy.getByData(testIds.profile_zipCode).clear()
        cy.contains('Zip code is required').should('be.visible')

        cy.getByData(testIds.profile_state).clear()
        cy.contains('State is Required').should('be.visible')

        cy.getByData(testIds.profile_country).clear()
        cy.contains('Country is Required').should('be.visible')
        cy.getByData(testIds.profile_saveandContinue).should('be.disabled')
      })
    })
    it('should fill and save the profile form data, click on Save and Continue, and navigate to the homepage', () => {
      const profileDetails = {
        name: 'John Doe',
        mobileNumber: '8275229000',
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
          cy.wait(1000)
        })
    })
  })
  context('Empty cart', () => {
    it('should perform search', () => {
      cy.getByData(testIds.searchInput).type('cake')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', `${testIds.url_search}?searchTerm=cake`)
    })
    it('should render the cart page with no items', () => {
      cy.getByData(testIds.cartButton).click()
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(testIds.cartpage_emptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Shop')
      cy.getByData(testIds.home_icon).click()
    })
  })
  context('Search by Location', () => {
    it('Should render Search By Location Page with all Component', () => {
      cy.getByData(testIds.search_By_Location_Text).click()
      cy.url().should('include', `${testIds.url_search_StoreBy_Location}`)
      cy.getByData(testIds.map_search_input_container).should('be.visible')
      cy.getByData(testIds.map_search_input).should('be.visible')
      cy.getByData(testIds.map_container).should('be.visible')
      cy.getByData(testIds.option_card).should('be.visible')
    })
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
    it('should perform search and display results', () => {
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })
  })
  context('Should apply filter on search results', () => {
    it('should handle sort by price option in filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Brunch salé')
    })
    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_filterByRating).select(1)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Brunch sucré')
    })
    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_filterByRating).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Brunch sucré')
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Brunch sucré')
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).filter(':contains("Cheesecake")').click()
      //select cheesecake as product
    })
  })
  context('Should render the product details page', () => {
    it('should render the product details component', () => {
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
    })
    it('should render details of selected product', () => {
      cy.getByData(testIds.item_title).should('contain.text', 'Cheesecake')
      cy.getByData(testIds.item_rating).eq(4)
      cy.getByData(testIds.item_description).should(
        'contain.text',
        'Originally from the East, then moved to the West where it was popularized by New Yorkers'
      )

      verifyPrice('4,80 €')
      cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_counterValue).should('be.visible')
      cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
      cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Add To Cart')
    })

    it('should not able to decrement the count when total count is 1', () => {
      cy.getByData(testIds.productpage_decrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
    })

    it('should increment the count', () => {
      cy.getByData(testIds.productpage_incrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
    })

    it('should add product in cart on add to cart btn click', () => {
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.feedback).should('contain.text', 'Product added to cart')
    })

    it('should navigate to cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', testIds.url_cart)
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
      cy.wait(2000)
    })
  })
  context('Should render and validate Billing & Shipping Details', () => {
    it('should display the item details', () => {
      cy.getByData(testIds.item_details).should('have.length', 1)
      cy.getByData(testIds.item_title).should('contain.text', 'Cheesecake')
      cy.getByData(testIds.item_quantity).should('contain.text', 'X 2')
      verifyPrice('9,60 €')
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
          cy.contains('Invalid Zip code').should('be.visible')

          cy.getByData('submit').should('be.disabled')
        })
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_form).type('{esc}')
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
          cy.contains('Invalid Zip code').should('be.visible')

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
  context('Payment details and checkout', () => {
    it('should display the payment section', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
    })

    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        verifyPrice('9,60 €')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('1,72 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('11,32 €', 3)
      })
    })
    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', '/paymentMode')
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
      cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.url().should('include', testIds.url_orderConfirmation)
    })
  })
  context('Order confirmation', () => {
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
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('exist')
      cy.getByData(testIds.orderConfirmation_orderIdMessage).should('contain.text', `Order number is:`)
    })
    it('should have a button to view order details and navigate to order details page when clicked', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })
  context('Should render and validate Order Details', () => {
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
      cy.getByData(testIds.orderDetailspage_productName).should('contain.text', 'Cheesecake')
      cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
    })

    it('should render the order details in progress summary section', () => {
      cy.getByData(testIds.orderDetailspage_orderId).should('exist')
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('contain.text', 'Cheesecake')
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
        verifyPrice('9,60 €')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('1,72 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('11,32 €', 3)
      })
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
  context('Should render and validate Order History', () => {
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
    })
    it('should render the payment breakup details', () => {
      cy.getByData(testIds.orderDetailspage_paymentDetails).within(() => {
        cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
        verifyPrice('9,60 €')
        cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
        verifyPrice('1,72 €', 2)
        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        verifyPrice('11,32 €', 3)
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
