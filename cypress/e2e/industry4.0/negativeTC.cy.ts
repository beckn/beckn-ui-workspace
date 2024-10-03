import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
// import { HomeIcon } from '../../../apps/taxi-bpp/src/lib/icons/home-icon';
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_industry_url_base)
  })
  context('Authentication Scenarios', () => {
    // Sign In Page
    it('should display the sign-in form elements and handle form submission states', () => {
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
    // Invalid login scenarios
    it('should handle various invalid login scenarios', () => {
      const invalidEmail = 'invalid.com'
      const invalidPassword = 'password'
      const unregisteredEmail = 'unregistered@example.com'
      const unregisteredPassword = 'unreg@Pass123'

      // Scenario 1: Invalid email and password
      cy.getByData(testIds.auth_inputEmail).clear().type(invalidEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(invalidPassword)
      cy.getByData(testIds.auth_loginButton).should('be.disabled')

      // Scenario 2: Invalid password with valid email
      cy.getByData(testIds.auth_inputEmail).clear().type(testIds.user_validEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(testIds.user_invalidPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')

      // Scenario 3: Unregistered email and password
      cy.getByData(testIds.auth_inputEmail).clear().type(unregisteredEmail)
      cy.getByData(testIds.auth_inputPassword).clear().type(unregisteredPassword)
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')
    })
  })
  context('Login and Home page', () => {
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(2000)
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
  context('Wrong search keyword', () => {
    it('should perform search and navigate to search results', () => {
      cy.wait(2000)
      cy.getByData(testIds.search_input).clear().type('cake')
      cy.getByData(testIds.search_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(18000)
    })
    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })
  })
  context('Proceed without entering details', () => {
    it('should perform search and navigate to search results', () => {
      cy.get('.css-15mvw4m > .chakra-image').click()
      // cy.getByData('home-icon').click()
      cy.wait(2000)
      cy.getByData(testIds.search_input).clear().type('assembly')
      cy.getByData(testIds.search_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(16000)
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.search_page_product_OnClick).first().click()
    })
    it('should display error and and not proceed', () => {
      cy.getByData(testIds.product_page_book_button).click()
      cy.get('button[type="submit"]').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!')
      cy.request({
        method: 'POST',
        url: 'https://bap-gcl-prod.becknprotocol.io/x-input/submit',
        failOnStatusCode: false,
        body: {
          /*payload*/
        }
      })
        .its('status')
        .should('eq', 400)
    })
    it('should allow the user to submit the form', () => {
      cy.get(testIds.length).type('10')
      cy.get(testIds.width).type('100')
      cy.get(testIds.weight).type('10')
      cy.get(testIds.increaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '2')
      cy.get('button[type="submit"]').click()
    })
  })
  context('Proceed without entering Shipping and Billing details', () => {
    it('save details', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
      cy.getByData('submit').click()
    })
    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    })
    it('should navigate to the order confirmation page upon clicking confirm button', () => {
      cy.getByData(testIds.paymentpage_radioButton).eq(4).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
    })
    it('Click on view order details button', () => {
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.wait(3000)
    })
    it('Should Logout from Application', () => {
      cy.get('.css-15mvw4m > .chakra-image').click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
