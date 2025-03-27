import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
// import { HomeIcon } from '../../../apps/taxi-bpp/src/lib/icons/home-icon';
describe('End to End', () => {
  before(() => {
    cy.visit(testIds.deployed_odr_url_base)
  })
  context('Sign in With Valid ID and Password', () => {
    // Valid login scenarios
    it('should display the sign-in form with email and password fields', () => {
      cy.getByData(testIds.auth_inputEmail).should('exist').and('be.visible')
      cy.getByData(testIds.auth_inputPassword).should('exist').and('be.visible')
    })

    it('should display the sign-in and sign-up buttons', () => {
      cy.getByData(testIds.auth_loginButton).should('exist').and('be.visible')
      cy.getByData(testIds.auth_registerButton).should('exist').and('be.visible')
    })
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
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
        cy.contains('Zip Code is required').should('be.visible')

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
          cy.wait(2000)
        })
    })
  })
  context('Home page components and Search', () => {
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_appTitle).should('be.visible')
      cy.getByData(testIds.homepage_appDescription).should('be.visible')
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
    })

    it('should open the selectInput dropdown when clicked', () => {
      cy.getByData(testIds.select_input).click()
      cy.getByData(testIds.dropdown_item).should('be.visible')
    })

    it('should render the app title & description', () => {
      cy.getByData(testIds.homepage_appTitle).should('contain.text', 'LegalEase')
      cy.getByData(testIds.homepage_appDescription).should(
        'contain.text',
        'LegalEase allows anyone to discover lawyers, online dispute resolution (ODR) service providers, paralegals and other legal services and information in a quick and seamless manner'
      )
    })
    it('should select an item from the dropdown', () => {
      const itemToSelect = 'Financial Disputes'
      cy.wait(1000)
      cy.getByData(testIds.select_input)
      cy.getByData(testIds.dropdown_item_list).eq(1).click()
      cy.getByData(testIds.select_input).should('contain.text', itemToSelect)
    })

    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.select_input).click()
      cy.getByData(testIds.dropdown_item_list).eq(1).click()
      cy.getByData(testIds.searchInput).type('mediation')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(16000)
    })
  })
  context('Should render the product details page', () => {
    it('should render the product details component', () => {
      cy.selectProduct(0)
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
    })

    it('should render details of selected product', () => {
      cy.getByData(testIds.item_title).should('contain.text', 'Mediation Services')
      cy.getByData(testIds.item_description).should(
        'contain.text',
        'At HarmonyArbitrators, our mediation services are designed to guide you through civil, family, employment, commercial, and financial disputes with skill and compassion. Our experienced mediators foster open communication, facilitating collaborative solutions that prioritize fairness and client satisfaction.'
      )
      cy.getByData(testIds.item_price).should('contain.text', '₹3,000.00')
      cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Proceed')
    })

    it('should navigate to checkout page on Proceed button click', () => {
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', testIds.url_checkout)
    })
  })
  context('Should render and validate Complainant & Billing Details', () => {
    it('should check the Complainant & Billing Details, Respondent Details section rendered or not & Confirm btn', () => {
      cy.getByData(testIds.checkoutpage_complaints_Details).should('be.visible')
      cy.getByData(testIds.checkoutpage_respondent_Details).should('be.visible')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
    })

    it('should validate Complainant & Billing Details form fields', () => {
      cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()

      cy.getByData(testIds.checkoutpage_complaints_Details)
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
      cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_form).type('{esc}')
    })

    it('should fill and save the Complainant & Billing Details', () => {
      cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()
      cy.getByData(testIds.checkoutpage_form).should('be.visible')

      cy.getByData(testIds.checkoutpage_complaints_Details)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().type('santosh kumar')
          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('6251423251')
          cy.getByData(testIds.checkoutpage_email).clear().type('santosh.k@gmail.com')
          cy.getByData(testIds.checkoutpage_address).clear().type('151-e, janpath road, new delhi')
          cy.getByData(testIds.checkoutpage_pinCode).clear().type('110001')
          cy.getByData('submit').click()
        })
    })

    it('should validate Respondent Details form fields', () => {
      cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()

      cy.getByData(testIds.checkoutpage_respondent_Details)
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
      cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_form).type('{esc}')
    })

    it('should fill and save the Respondent Details ', () => {
      cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()
      cy.getByData(testIds.checkoutpage_form).should('be.visible')

      cy.getByData(testIds.checkoutpage_respondent_Details)
        .getByData(testIds.checkoutpage_form)
        .within(() => {
          cy.getByData(testIds.checkoutpage_name).clear().type('jay d')
          cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('9871432309')
          cy.getByData(testIds.checkoutpage_email).clear().type('jay.d@gmail.com')
          cy.getByData(testIds.checkoutpage_address).clear().type('23, east end , sector 10, pritampura, delhi')
          cy.getByData(testIds.checkoutpage_pinCode).clear().type('110034')
          cy.getByData('submit').click()
        })
    })
    it('should fill and save the Dispute Details', () => {
      cy.getByData(testIds.checkoutpage_dispute_Details).click()
      cy.getByData(testIds.xinput_form_open).should('be.visible')

      cy.getByData(testIds.xinput_form).within(() => {
        cy.getByData('details').type('sanket')
        cy.getByData('"claimValue"').type('1234')
        cy.getByData('btnSave').click()
      })
    })

    it('should fill and save the Consent Form', () => {
      cy.getByData(testIds.checkoutpage_consent_Details).click()
      cy.getByData(testIds.xinput_form_open).should('be.visible')

      cy.getByData(testIds.xinput_form).within(() => {
        cy.getByData('name').type('sanket')
        cy.getByData('"place"').type('pune')
        cy.getByData('btnConfirm').click()
      })
    })

    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', testIds.url_orderConfirmation)
    })
  })
  context('Order Details', () => {
    it('should render homepage when click on go back to home', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    })
    it('should render the diff sections of order detail page', () => {
      cy.getByData(testIds.orderDetailspage_orderOverview).should('be.visible')
      cy.getByData(testIds.orderDetailspage_progressSummary).should('be.visible')
      cy.getByData(testIds.orderDetailspage_shippingDetails).should('be.visible')
      cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
    })

    it('should render the order product details in order overview section', () => {
      cy.getByData(testIds.orderDetailspage_productName).should('contain.text', 'Mediation Services')
      cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
    })

    it('should render the order details in progress summary section', () => {
      //cy.getByData(testIds.orderDetailspage_orderId).should('include.text', '1001')
      cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('contain.text', 'Alpha Pvt Ltd., India.')
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
  context('Order History', () => {
    it('Should redirect to  Order History Page', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
    })
    it('Should render Order History Page', () => {
      cy.getByData(testIds.orderHistory_createdAt).eq(1).should('exist')
      cy.getByData(testIds.orderHistory_createdAt).eq(1).should('contain.text', `Placed at`)
      cy.getByData(testIds.orderHistory_order_id).eq(1).should('exist')
      cy.getByData(testIds.orderHistory_order_id).eq(1).should('contain.text', `Order ID:`)
      cy.getByData(testIds.orderHistory_order_id).eq(1).should('exist')
      cy.getByData(testIds.orderHistory_Price).eq(1).should('contain.text', `INR`)
      cy.getByData(testIds.orderHistory_pendingIcon).eq(1).should('have.attr', 'src')
    })
    it('should navigate to orderDetails page when click on perticular order Id', () => {
      cy.getByData(testIds.order_history_main_container).eq(0).click()
      cy.url().should('include', testIds.url_orderDetails)
    })
  })
  context('Logout from ODR App', () => {
    it('Should Logout from App', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
