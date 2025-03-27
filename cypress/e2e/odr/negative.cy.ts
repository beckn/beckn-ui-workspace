import { testIds } from '../../../shared/dataTestIds'
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_odr_url_base)
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
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(100)
    })
  })
  context('My Profile Validation', () => {
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
  })
  context('Should performed search using wrong keyword ', () => {
    it('should select an item from the dropdown', () => {
      const itemToSelect = 'Financial Disputes'
      cy.wait(2000)
      cy.getByData(testIds.select_input).click()
      cy.getByData(testIds.dropdown_item_list).eq(1).click()
      cy.getByData(testIds.select_input).should('contain.text', itemToSelect)
    })

    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.select_input).click()
      cy.getByData(testIds.dropdown_item_list).eq(1).click()
      cy.getByData(testIds.searchInput).type('cake')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(16000)
    })
    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
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
