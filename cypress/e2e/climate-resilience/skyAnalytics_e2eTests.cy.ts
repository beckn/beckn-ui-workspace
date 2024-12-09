import { testIds } from '../../../shared/dataTestIds'
describe('End to End test cases for Dragon Food app', () => {
  const deployed_url = 'https://skyanalytics-dev.becknprotocol.io/signIn'
  const invalidEmail = 'sanket.com'
  const invalidPassword = 'password'
  const unregisteredEmail = 'unregistered@example.com'
  const unregisteredPassword = 'unreg@Pass123'
  const validInputEmail = 'sanketbk@gmail.com'
  const validInputPassword = 'P@ssw0rd'
  const searchTerm = 'data'
  const wrongSearchTerm = 'cake'
  const product = 'Satellite based high resolution weather historical and forecast data'
  const selectProductForCheckout = 'Satellite based high resolution weather historical and forecast data'
  const filterByPriceProduct = 'Satellite based high resolution weather historical and forecast data'
  const filterByRatingProduct = 'Surface and space based high resolution weather historical and forecast data'
  const filterReset = 'Surface and space based high resolution weather historical and forecast data'
  const item_quantity = 'X 1'
  const item_price = '₹10.00'
  const totalPayment = '₹10.00'
  const billing_name = 'Anand'
  const billing_number = '9890989000'
  const billing_email = 'anand@gmail.com'
  const billing_pin_code = '1202 b2, Bengaluru urban, Bengaluru, Karnataka'
  const billing_address = '560078'

  before(() => {
    cy.visit(deployed_url)
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
      cy.getByData(testIds.auth_inputEmail).clear().type(validInputEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(validInputPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(2000)
    })
  })
  context('Landing Page', () => {
    it('should render the homepage components', () => {
      // cy.getByData(testIds.homepage_appTitle).should('be.visible').and('contain.text', 'Sky Analytics')
      // cy.getByData(testIds.homepage_appDescription)
      //     .should('be.visible')
      cy.getByData(testIds.locationIcon).should('be.visible')
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
      cy.getByData(testIds.threeDots).should('be.visible')
      //cy.getByData(testIds.footer).should('be.visible') need to add footer amd logo
      //cy.getByData(testIds.frequently_accessed).should('be.visible').and('contain.text', 'Frequently Accessed');
    })
  })
  context('Search Functionality', () => {
    // it('should handle wrong search keyword gracefully', () => {
    //     cy.getByData(testIds.searchInput).type(wrongSearchTerm)
    //     cy.getByData(testIds.searchButton).click()
    //     cy.wait(18000)
    //     cy.getByData(testIds.noDataAvailable).should('be.visible')
    //     cy.getByData(testIds.noDataAvailable).should(
    //         'contain.text',
    //         'There are no products in this category yet! New products will be added soon.'
    //     )
    //     cy.getByData(testIds.goBack).click()
    // })
    //Empty cart
    // it('should render the cart page with no items', () => {
    //     cy.getByData(testIds.searchInput).clear().type(searchTerm)
    //     cy.getByData(testIds.searchButton).click()
    //     cy.getByData(testIds.cartButton).click()
    //     cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
    //     cy.getByData(testIds.cartpage_emptySubHeading).should(
    //         'contain.text',
    //         'Looks like you haven’t made your choice yet'
    //     )
    //     cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
    //     cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Add Request')
    //     cy.getByData(testIds.cartpage_emptyButton).click()
    // })

    it('should render home page component for Search result', () => {
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
      cy.getByData(testIds.searchpage_sortByPrice).click()
      cy.getByData(testIds.sort_by_price_menu_list).find('[data-test="menu-item-1"]').click()
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', filterByPriceProduct)
    })
    it('should handle filter by rating option in filter', () => {
      cy.getByData(testIds.searchpage_filterByRating).click()
      cy.getByData(testIds.filter_by_rating_menu_list).find('[data-test="menu-item-2"]').click()
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', filterByRatingProduct)
    })
    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', filterReset)
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).contains(selectProductForCheckout).click()
    })
  })
  context('Product Details', () => {
    it('should render details of the selected product', () => {
      cy.getByData(testIds.cartButton).should('be.visible')
      cy.getByData(testIds.goBack).should('be.visible')
      cy.getByData(testIds.product_page_Image).should('be.visible')
      cy.getByData(testIds.item_title).should('contain.text', product)
      //cy.getByData(testIds.item_title).should('contain.text', 'Provided by Climatic')
      cy.getByData(testIds.rating_container).should('be.visible')
      cy.wait(1000)
    })
    it('should render about section of the selected product', () => {
      // cy.getByData(testIds.).should('be.visible')
      // cy.getByData(testIds.).should('be.visible')
      // cy.getByData(testIds.).should('be.visible')
    })
    it('should validate and select all checkbox from every section ', () => {
      cy.getByData(testIds.product_details_checkbox).eq(0).should('contain.text', 'Model Confidence Levels')
      cy.getByData(testIds.product_checkbox).eq(0).should('contain.text', '70%')
      cy.getByData(testIds.product_checkbox).eq(1).should('contain.text', '90%')
      cy.getByData(testIds.product_checkbox).eq(2).should('contain.text', '85%').click()

      cy.getByData(testIds.product_details_checkbox).eq(1).should('contain.text', 'Spatial Representation Type')
      cy.getByData(testIds.product_checkbox).eq(3).should('contain.text', 'Vector')
      cy.getByData(testIds.product_checkbox).eq(4).should('contain.text', 'Raster').click()

      cy.getByData(testIds.product_details_checkbox).eq(2).should('contain.text', 'Spatial Coverage')
      cy.getByData(testIds.product_checkbox).eq(5).should('contain.text', 'Beanibazar')
      cy.getByData(testIds.product_checkbox).eq(6).should('contain.text', 'Gopalganj')
      cy.getByData(testIds.product_checkbox).eq(7).should('contain.text', 'Balaganj')
      cy.getByData(testIds.product_checkbox).eq(8).should('contain.text', 'Biswanath')
      cy.getByData(testIds.product_checkbox).eq(9).should('contain.text', 'Kanaigath').click()

      cy.getByData(testIds.product_details_checkbox).eq(3).should('contain.text', 'Spatial Resolutions')
      cy.getByData(testIds.product_checkbox).eq(10).should('contain.text', '1 km')
      cy.getByData(testIds.product_checkbox).eq(11).should('contain.text', '2.5 km')
      cy.getByData(testIds.product_checkbox).eq(12).should('contain.text', '5 km').click()

      cy.getByData(testIds.product_details_checkbox).eq(4).should('contain.text', 'Data Formats')
      cy.getByData(testIds.product_checkbox).eq(13).should('contain.text', 'XML')
      cy.getByData(testIds.product_checkbox).eq(14).should('contain.text', 'CSV')
      cy.getByData(testIds.product_checkbox).eq(15).should('contain.text', 'NetCDF')
      cy.getByData(testIds.product_checkbox).eq(16).should('contain.text', 'HDF').click()

      cy.getByData(testIds.product_details_checkbox).eq(5).should('contain.text', 'Data Sharing Modes')
      cy.getByData(testIds.product_radio_text).eq(0).should('contain.text', 'FTP')
      cy.getByData(testIds.product_radio_text).eq(1).should('contain.text', 'SOAP_API')
      cy.getByData(testIds.product_radio_text).eq(2).should('contain.text', 'Rest API').click()

      cy.getByData(testIds.product_details_checkbox).eq(6).should('contain.text', 'Subscription Duration')
      cy.getByData(testIds.product_radio_text).eq(3).should('contain.text', 'One time')
      cy.getByData(testIds.product_radio_text).eq(4).should('contain.text', '3 months').click()

      cy.getByData(testIds.product_checkbox).eq(17).should('contain.text', 'Accept').click()
      cy.get('.chakra-button').click()
      //cy.getByData(testIds.Proceed_to_product).click()
      cy.wait(3000)
      cy.get('.chakra-button').click()
      //cy.getByData(testIds.Proceed).click()
    })
  })
  context('Billing Details', () => {
    it('should validate Billing Details', () => {
      cy.getByData(testIds.open_form).click()
      cy.getByData(testIds.billing_name).clear().blur()
      cy.contains('Name is required').should('be.visible')
      cy.getByData(testIds.billing_number).clear().blur()
      cy.contains('Mobile Number is required').should('be.visible')
      cy.getByData(testIds.billing_email).clear().blur()
      cy.contains('Email ID is required').should('be.visible')
      cy.getByData(testIds.billing_address).clear().blur()
      cy.contains('Complete Address is required').should('be.visible')
      cy.getByData(testIds.billing_pin_code).clear().blur()
      cy.contains('Zip Code is required').should('be.visible').type('{esc}')
    })
    it('Should fill Billing Details with valid data', () => {
      cy.getByData(testIds.open_form).click()
      cy.getByData(testIds.billing_name).clear().type(billing_name)
      cy.getByData(testIds.billing_number).clear().type(billing_number)
      cy.getByData(testIds.billing_email).clear().type(billing_email)
      cy.getByData(testIds.billing_address).clear().type(billing_pin_code)
      cy.getByData(testIds.billing_pin_code).clear().type(billing_address)

      cy.getByData(testIds.add_billing_details).click()
    })
    it('Product Details ', () => {
      cy.getByData(testIds.item_title).should('contain.text', selectProductForCheckout)
      cy.getByData(testIds.item_quantity).should('contain.text', item_quantity)
      cy.getByData(testIds.item_price).should('contain.text', item_price)
      cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
      cy.getByData(testIds.item_price).should('contain.text', totalPayment)

      cy.getByData(testIds.checkoutpage_changeFormDetails).should('be.visible')
      cy.getByData(testIds.proceed_to_checkout).should('be.visible').click()
    })
  })
  context('Proceed to Checkout', () => {
    it('should display payment Page with Result', () => {
      cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
      cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
      cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
      cy.getByData(testIds.paymentpage_phonePay).should('contain.text', 'PhonePe UPI')
      cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Wallet')
      cy.getByData(testIds.paymentpage_image).should('have.attr', 'src')
      cy.getByData(testIds.confirm_button).should('be.disabled')
    })
    it('should display payment method images and radio button', () => {
      cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
    })
    it('should disable the confirm button when no radio button is selected', () => {
      cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
      cy.getByData(testIds.confirm_button).contains('Confirm Order').should('be.disabled')
    })
    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).should('be.enabled').click()
      cy.wait(3000)
    })
  })
  context('Order Details', () => {
    it('should render order details when click view order details button', () => {
      cy.getByData(testIds.confirmPageImage).should('be.visible')
      cy.getByData(testIds.grateful_message).should('be.visible')
      cy.getByData(testIds.track_order).should('be.visible')
      cy.getByData(testIds.track_order).should('contain.text', validInputEmail)
      cy.wait(3000)
      cy.getByData(testIds.orderConfirmation_goBackToHome).should('be.visible').click()
    })
  })
  context('Request History ', () => {
    it('Should nevigate to Frequently Accessed items', () => {
      // add code
    })
    it('Should nevigate to Request History', () => {
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
      cy.wait(3000)
    })
    it('Should check all component of Request History', () => {
      cy.getByData(testIds.order_history_item_name).eq(0).should('contain.text', selectProductForCheckout)
      cy.getByData(testIds.accordion_click).eq(0).click()

      cy.getByData(testIds.order_history_Status).eq(0).should('contain.text', 'Pending')
      cy.getByData(testIds.order_history_main_container).eq(0).should('be.visible')

      cy.getByData(testIds.order_history_provider)
        .eq(0)
        .should('be.visible')
        .should('contain.text', 'Provide by Climatic')
      cy.getByData(testIds.order_history_description)
        .eq(0)
        .should('be.visible')
        .should(
          'contain.text',
          'Founded in 2019, Climatic is a climate disaster modelling company based out of Dhaka, offering high resolution services for flood modelling.'
        )
      cy.getByData(testIds.order_History_createdAt).eq(0).should('be.visible')

      cy.getByData(testIds.statusName).should('be.visible')
      cy.getByData(testIds.statusTime).should('be.visible')
    })
  })
  context('Logout Functionality  ', () => {
    it('Should Logout from Dragon Food App', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
