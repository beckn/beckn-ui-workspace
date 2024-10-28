import { testIds } from '../../../shared/dataTestIds'
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_osc_url_base)
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
    context('My Profile Validation', () => {
      // My Profile validation
      it('should display profile, order history, and logout options, then navigate to the profile page after clicking the three dots menu', () => {
        cy.getByData(testIds.threeDots).click()
        cy.getByData(testIds.profile_text_click).should('be.visible')
        cy.getByData(testIds.orderHistory_text_click).should('be.visible')
        cy.getByData(testIds.Logout_text_click).should('be.visible')
        cy.getByData(testIds.profile_text_click).click()
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

          cy.getByData(testIds.profile_city).clear().type('12345').blur()
          cy.contains('City can only contain letters and spaces').should('be.visible')

          cy.getByData(testIds.profile_zipCode).clear().type('pune').blur()
          cy.contains('Invalid Zip code').should('be.visible')

          cy.getByData(testIds.profile_state).clear().type('12345').blur()
          cy.contains('State can only contain letters and spaces').should('be.visible')

          cy.getByData(testIds.profile_country).clear().type('12345').blur()
          cy.contains('State can only contain letters and spaces').should('be.visible')

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
            cy.wait(3000)
          })
      })
    })
  })
  context('Wrong store location', () => {
    it('should perform navigate on click serach store by location', () => {
      cy.getByData(testIds.search_By_Location_Text).click()
      cy.url().should('include', `${testIds.url_search_StoreBy_Location}`)
    })
    it('Should not get store for wrong location', () => {
      cy.getByData(testIds.option_card).contains('Restaurant').click()
      cy.getByData(testIds.map_search_input).type('Pune')
      cy.getByData(testIds.location_List_item).eq(1).click()
      cy.get('img[alt="Marker"]').eq(2).should('not.exist')
      cy.url().should('include', `${testIds.url_search}`)
    })
    it('Should not get search result for wrong keyword', () => {
      cy.getByData(testIds.home_icon).click()
      cy.getByData(testIds.searchInput).type('assembly')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(16000)
      cy.url().should('include', `${testIds.url_search}?searchTerm=assembly`)
    })

    it('Should Logout from Retail App', () => {
      cy.getByData(testIds.home_icon).click()
      cy.wait(100)
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
