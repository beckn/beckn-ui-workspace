import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
// import { HomeIcon } from '../../../apps/taxi-bpp/src/lib/icons/home-icon';
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_industry_url_base)
  })
  context('Login and Home page', () => {
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('aan@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(200)
    })
    // Home Page
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_image).should('be.visible')
      cy.getByData(testIds.homepge_text).should('be.visible')
      cy.getByData(testIds.homepge_text).should(
        'contain.text',
        'To proceed with creating your workflow, please set your location and search for services.'
      )
      cy.getByData(testIds.search_bar_main_container).should('be.visible')
      cy.getByData(testIds.search_input).should('be.visible')
      cy.getByData(testIds.search_button).should('be.visible')
    })
  })
  context('Profile Form Validation ', () => {
    // My Profile validation
    it('should display profile, order history, and logout options, then navigate to the profile page after clicking the three dots menu', () => {
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.profile_text_click).should('be.visible')
      cy.getByData(testIds.orderHistory_text_click).should('be.visible')
      cy.getByData(testIds.Logout_text_click).should('be.visible')
      cy.getByData(testIds.profile_text_click).click()
      cy.performProfile({ fixture: 'profile/profileResponse.json' }, 'profileResponse')
      cy.wait('@profileResponse')
    })
    // Profile form validation
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
        cy.contains('Zip code is required').should('be.visible')
        cy.getByData(testIds.profile_state).clear().blur()
        cy.contains('State is Required').should('be.visible')
        cy.getByData(testIds.profile_country).clear().blur()
        cy.contains('Country is Required').should('be.visible')
        cy.getByData(testIds.profile_saveandContinue).should('be.disabled')
      })
    })
    //Fill and save profile form
    it('should fill and save the profile form data, click on Save and Continue, and navigate to the homepage', () => {
      const profileDetails = {
        name: 'John Doe',
        mobileNumber: '8275229001',
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
  context('Search and Select Functionality', () => {
    // Search with valid keyword
    it('should perform search and navigate to search results', () => {
      cy.wait(2000)
      cy.getByData(testIds.search_input).clear().type('assembly')
      cy.getByData(testIds.search_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(18000)
    })
    it('should perform search and display results', () => {
      cy.getByData(testIds.search_page_product_image).should('be.visible')
      cy.getByData(testIds.search_page_product_name).should('be.visible')
      cy.getByData(testIds.search_page_product_providerName).should('be.visible')
      cy.getByData(testIds.search_page_product_short_desc).should('be.visible')
      cy.getByData(testIds.search_page_product_rating).should('be.visible')
      cy.getByData(testIds.search_page_product_OnClick).should('be.visible')
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.search_page_product_OnClick).first().click()
    })
    it('should render the product details component', () => {
      cy.getByData(testIds.product_page_Image).should('be.visible')
      cy.getByData(testIds.product_page_short_desc).should('be.visible')
      cy.getByData(testIds.product_page_long_desc).should('be.visible')
      cy.getByData(testIds.product_page_book_button).should('be.visible')
    })
    it('should render details of selected product', () => {
      cy.getByData(testIds.product_page_short_desc).should('contain.text', 'This is an intermittent assembly type.')
      cy.getByData(testIds.product_page_book_button).should('contain.text', 'Book')
    })
    it('should navigate to assemblyDetails page on Book button click', () => {
      cy.getByData(testIds.product_page_book_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
    })
    //Add Assembly Details
    it('should render the assembly details form with the correct title', () => {
      cy.get('h1').should('contain', 'Add Assembly Details')
    })
    it('should allow the user to select Type, Colour, and Shape', () => {
      cy.get(testIds.typeLabel).should('be.visible')
      cy.get(testIds.type).select('Plastic Box')
      cy.get(testIds.type).should('have.value', 'Plastic Box')
      cy.get(testIds.colorLabel).should('be.visible')
      cy.get(testIds.colour).select('Blue')
      cy.get(testIds.colour).should('have.value', 'Blue')
      cy.get(testIds.shapeLabel).should('be.visible')
      cy.get(testIds.shape).select('Circle')
      cy.get(testIds.shape).should('have.value', 'Circle')
    })
    it('should allow the user to increase and decrease quantity', () => {
      cy.get(testIds.increaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '2')
      cy.get(testIds.decreaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '1')
    })
    it('should allow the user to submit the form', () => {
      cy.get(testIds.length).type('10')
      cy.get(testIds.width).type('100')
      cy.get(testIds.weight).type('10')
      cy.get(testIds.increaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '2')
      cy.get('button[type="submit"]').click()
    })
    //Review Purchase Order
    it('should display the item details', () => {
      cy.url().should('include', testIds.url_checkoutPage)
      cy.getByData(testIds.item_title).should('contain.text', 'Assembly')
      cy.getByData(testIds.item_name).should('contain.text', 'Intermittent assembly type')
      cy.getByData(testIds.item_quantity).should('contain.text', 2)
      cy.getByData(testIds.item_price).should('contain.text', 'EUR 300')
    })
  })
  context('Billing and Shipping details Validation ', () => {
    it('should validate shipping form fields', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()

      cy.getByData(testIds.checkoutpage_shippingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().blur()
          cy.contains('Name is required').should('be.visible')

          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
          cy.contains('Invalid mobile number').should('be.visible')

          cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
          cy.contains('Invalid email format').should('be.visible')

          cy.getByData(testIds.checkoutpage_address).clear().blur()
          cy.contains('Address is required').should('be.visible')

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
    })

    it('should handle the "same as shipping" checkbox for billing form data', () => {
      cy.getByData(testIds.checkoutpage_billingDetails).within(() => {
        cy.getByData(testIds.checkoutpage_checkbox).get('input').check()
        cy.getByData(testIds.checkoutpage_checkbox).click()
        cy.getByData(testIds.checkoutpage_changeFormDetails).click()
      })
      cy.getByData(testIds.checkoutpage_billingDetails)
        .getByData(testIds.checkoutpage_form)
        .within(() => {})
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
          cy.contains('Invalid mobile number').should('be.visible')
          cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
          cy.contains('Invalid email format').should('be.visible')
          cy.getByData(testIds.checkoutpage_address).clear().blur()
          cy.contains('Address is required').should('be.visible')
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
  context('Payment details and Checkout', () => {
    //Payment and checkout
    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.get('[data-test="Base Price"]').should('contain.text', 'Base Price')
        cy.getByData(testIds.item_price).eq(0).should('be.visible')

        cy.get('[data-test="Shipping Cost"]').should('contain.text', 'Shipping Cost')
        cy.getByData(testIds.item_price).eq(1).should('be.visible')

        cy.getByData('Tax').should('contain.text', 'Tax')
        cy.getByData(testIds.item_price).eq(2).should('be.visible')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        //cy.getByData(testIds.item_price).eq(3).should('be.visible')
      })
    })
    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.wait(100)
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
  context('Order details and Invoice Details', () => {
    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
    })

    //view order details
    it('Click on view order details button', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.wait(1000)
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
    it('should render order details page', () => {
      cy.getByData(testIds.orderDetails_progress_summary).should('be.visible')
      cy.getByData(testIds.orderDetails_assembly_text).should('be.visible')
      cy.getByData(testIds.orderDetailspage_rtlAssembly_line).should('be.visible')
    })

    //Invoice

    it('should render the invoice modal on click of invoice icon and Render invoice details page', () => {
      cy.getByData(testIds.downloadInvoiceIcon).should('be.visible')
      cy.getByData(testIds.downloadInvoiceIcon).click()
      cy.getByData(testIds.invoice).click()
      cy.getByData(testIds.invoiceDetaislPage_orderOverview).should('be.visible')
      cy.getByData(testIds.invoiceDetaislPage_assembly_text).should('be.visible')
      cy.getByData(testIds.invoiceDetaislPage_price).should('be.visible')
    })

    it('should display the payment section', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
    })

    it('should display the payment breakup details', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
        cy.get('[data-test="Base Price"]').should('contain.text', 'Base Price')
        cy.getByData(testIds.item_price).eq(0).should('be.visible')

        cy.get('[data-test="Shipping Cost"]').should('contain.text', 'Shipping Cost')
        cy.getByData(testIds.item_price).eq(1).should('be.visible')

        cy.getByData('Tax').should('contain.text', 'Tax')
        cy.getByData(testIds.item_price).eq(2).should('be.visible')

        cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
        cy.getByData(testIds.item_price).eq(3).should('be.visible')
      })
    })
  })
  context('Order history Details', () => {
    it('should navigate to order history', () => {
      cy.get('.css-15mvw4m > .chakra-image').click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
    })
  })
  context('Should Logout from Application', () => {
    it('Should Logout from Application', () => {
      cy.get('.css-15mvw4m > .chakra-image').click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
