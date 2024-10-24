import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
// import { HomeIcon } from '../../../apps/taxi-bpp/src/lib/icons/home-icon';
describe('User Journey', () => {
  before(() => {
    cy.visit(testIds.deployed_url_base)
  })

  // Sign In Page
  it('should display the sign-in form elements and handle form submission states', () => {
    // Check if the email and password fields exist and are visible
    cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
    cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')

    // Check if the sign-in and sign-up buttons exist and are visible
    cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
    cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')

    // Check if the sign-in button is disabled when form is submitted with empty fields
    cy.getByData(testIds.auth_loginButton).should('be.disabled')

    // Check if the sign-up button is enabled
    cy.getByData(testIds.auth_registerButton).should('be.enabled')
  })

  // // Invalid login scenarios
  // it('should handle invalid login scenarios', () => {
  //     const invalidEmail = 'sanket.com';
  //     const invalidPassword = 'password';
  //     const unregisteredEmail = 'unregistered@example.com';
  //     const unregisteredPassword = 'unreg@Pass123';

  //     // Invalid email and password
  //     cy.getByData(testIds.auth_inputEmail).clear().type(invalidEmail);
  //     cy.getByData(testIds.auth_inputPassword).clear().type(invalidPassword);
  //     cy.getByData(testIds.auth_loginButton).should('be.disabled');

  //     // Invalid password with valid email
  //     cy.getByData(testIds.auth_inputEmail).clear().type(testIds.user_validEmail);
  //     cy.getByData(testIds.auth_inputPassword).clear().type(testIds.user_invalidPassword);
  //     cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click();
  //     cy.getByData(testIds.feedback).should('contain.text', 'Error!');

  //     // Unregistered email and password
  //     cy.getByData(testIds.auth_inputEmail).clear().type(unregisteredEmail);
  //     cy.getByData(testIds.auth_inputPassword).clear().type(unregisteredPassword);
  //     cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click();
  //     cy.getByData(testIds.feedback).should('contain.text', 'Error!');
  // });

  // Valid login scenarios
  it('should enable the Sign In button when both fields are filled', () => {
    cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
    cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
    cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
    cy.wait(2000)
  })

  // Landing page components are present
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
  //My Profile validation
  it('should display profile, order history, and logout options, then navigate to the profile page after clicking the three dots menu', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.profile_text_click).should('be.visible')
    cy.getByData(testIds.orderHistory_text_click).should('be.visible')
    cy.getByData(testIds.Logout_text_click).should('be.visible')
    cy.getByData(testIds.profile_text_click).click()
    cy.performProfile({ fixture: 'profile/profileResponse.json' }, 'profileResponse')
    cy.wait('@profileResponse')
  })
  it('should validate profile form fields', () => {
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
      mobileNumber: '8275229000',
      city: 'Pune',
      zipCode: '444888',
      state: 'Maharashtra',
      country: 'India'
    }
    cy.intercept('POST', '/profile', { fixture: 'profile/profileResponse.json' }).as('profileCall')
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
    // cy.wait('@profileCall').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/')
  })

  // Wrong search keyword
  // it('should handle wrong search keyword', () => {
  //     const searchTerm = 'cake';
  //     cy.getByData(testIds.searchInput).type(searchTerm)
  //     cy.getByData(testIds.searchButton).click();
  //     cy.wait(20000)
  //     cy.getByData(testIds.noDataAvailable).should('be.visible')
  //     cy.getByData(testIds.noDataAvailable).should(
  //         'contain.text',
  //         'There are no products in this category yet! New products will be added soon.'
  //     )
  //     cy.getByData(testIds.goBack).click()
  // })
  //Empty cart
  it('should render the cart page with no items', () => {
    const searchTerm = 'sunglasses'
    cy.getByData(testIds.searchInput).clear().type(searchTerm)
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.cartButton).click()
    cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
    cy.getByData(testIds.cartpage_emptySubHeading).should('contain.text', 'Looks like you haven’t made your choice yet')
    cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
    cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Shop')
    cy.getByData(testIds.cartpage_emptyButton).click()
  })

  // Right search keyword
  it('should rendered home page component sunglasses', () => {
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

  it('should handle filter by rating option in filter', () => {
    cy.getByData(testIds.searchpage_sortByPrice).select(1)
    cy.getByData(testIds.searchpage_applyFilter).click()
  })
  it('should navigate to product details on item click', () => {
    cy.getByData(testIds.searchpage_products).first().click()
  })
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
  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_billingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
  })

  //checkout
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

    // cy.performInit(initResponse, 'initResponse')
    // cy.wait('@initResponse')
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

  it('should display the payment section', () => {
    cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
  })

  // it('should display the payment breakup details', () => {
  //     cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
  //         cy.getByData(testIds.payment_basePrice).should('contain.text', 'base-price')
  //         cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹1699.00')

  //         cy.getByData(testIds.payment_taxes).should('contain.text', 'taxes')
  //         cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹305.82')

  //         cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
  //         cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹2004.82')
  //     })
  // })

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
  it('should render the initial PROCESS order status map', () => {
    cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
      cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 1)

      cy.getByData(testIds.orderDetailspage_orderStateName).eq(0).should('contain.text', 'Processing your order')
      cy.getByData(testIds.orderDetailspage_orderStateTime).eq(0).should('be.visible')
    })
  })
  it('Click on home icon', () => {
    cy.get('.css-15mvw4m > .chakra-image').click()
    //cy.getByData(testIds.Logout_text_click).click()
  })
  // it('check order hisotry', () => {
  //     cy.getByData(testIds.threeDots).click()
  //     cy.getByData(testIds.orderHistory_text_click).click()
  // })

  // it('should render the diff sections of order detail page', () => {
  //     cy.getByData(testIds.homepage_appLogo).click()
  // })
})
