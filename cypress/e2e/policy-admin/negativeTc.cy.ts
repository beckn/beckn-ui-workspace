import { testIds } from '../../../shared/dataTestIds'

describe('Negative TC for Policy Admin', () => {
  context('Signin flow and validation', () => {
    beforeEach(() => {
      cy.visit(testIds.deployed_policy_url_base)
    })
    it('should display the sign-in form with email and password fields', () => {
      cy.getByData('input-email').should('exist').and('be.visible')
      cy.getByData('input-password').should('exist').and('be.visible')
    })

    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData('login-button').should('be.disabled')
    })

    it('should update email and password fields when typed into', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-email').should('have.value', testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_validPassword)
      cy.getByData('input-password').should('have.value', testIds.user_validPassword)
    })

    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_validPassword)
      cy.getByData('login-button').should('not.be.disabled')
    })

    it('should show error toast on unsuccessful login', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_invalidPassword)
      cy.getByData('login-button').click()
      cy.getByData(testIds.feedback).should('contain.text', 'Error!Wrong Password')
    })

    it('should open the forgot password modal', () => {
      cy.getByData('forgot-button').click()
      cy.getByData('forgot-password').should('exist').and('be.visible')
    })

    it('should show an error for an invalid email in forgot password modal', () => {
      cy.getByData('forgot-button').click()
      cy.getByData('enter-email').type('invalid-email')
      cy.getByData('forgot-password-email-error').should('contain', 'Please enter a valid email address')
    })

    it('should allow valid email input in forgot password modal', () => {
      cy.getByData('forgot-button').click()
      cy.getByData('enter-email').type(testIds.user_validEmail)
      cy.getByData('forgot-password-email-error').should('not.exist')
    })

    it('should send reset link and show success toast', () => {
      cy.getByData('forgot-button').click()
      cy.getByData('enter-email').type(testIds.user_validEmail)
      cy.getByData('send-link').click()

      cy.getByData(testIds.feedback).should(
        'contain.text',
        'SuccessPlease check your email for the password reset link.'
      )
    })
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_validPassword)
      cy.getByData('login-button').should('not.be.disabled')
      cy.getByData('login-button').click()
    })
  })
  context('Create policy and validation ', () => {
    it('should Render CreateNewPolicy page when click on Create New Button', () => {
      cy.getByData(testIds.create_new_policy).click()
      cy.url().should('include', '/createPolicy')
    })
    it('should render the homepage components', () => {
      cy.getByData(testIds.add_info_metadata).should('be.visible')
      cy.getByData(testIds.switch_btn).should('be.visible')
      cy.getByData(testIds.switch_btn_text).should('be.visible')
      cy.getByData(testIds.policy_title).should('be.visible')
      cy.getByData(testIds.policy_title_input).should('be.visible')
      cy.getByData(testIds.policy_info_category).should('be.visible')
      cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
      cy.getByData(testIds.info_source_owner).should('be.visible')
      cy.getByData(testIds.info_source_owner_input).should('be.visible')
      cy.getByData(testIds.policy_description).should('be.visible')
      cy.getByData(testIds.policy_description_textArea).should('be.visible')
      cy.getByData(testIds.country).scrollIntoView().should('be.visible')
      cy.getByData(testIds.country_dropdown).should('be.visible')
      cy.getByData(testIds.city).scrollIntoView().should('be.visible')
      cy.getByData(testIds.city_dropdown).should('be.visible')
      cy.getByData(testIds.policy_from_date).should('be.visible')
      cy.getByData(testIds.date_pick_from).find('input').should('be.visible')
      cy.getByData(testIds.policy_to_date).should('be.visible')
      cy.getByData(testIds.date_pick_to).find('input').should('be.visible')
      cy.getByData(testIds.policy_source).should('be.visible')
      cy.getByData(testIds.policy_source_input).should('be.visible')
      cy.getByData(testIds.policy_applicable_to).should('be.visible')
      cy.getByData(testIds.policy_rules).should('be.visible')
      cy.getByData(testIds.policy_rules_code).should('be.visible')
      cy.getByData(testIds.go_back_home).scrollIntoView().should('be.visible')
      cy.getByData(testIds.save_policy).should('be.visible')
    })
    it('should display validation errors for empty required fields on submit', () => {
      cy.getByData(testIds.save_policy).click()
      cy.getByData(testIds.title_error).should('contain', 'Title is required')
      cy.getByData(testIds.policy_info_category_error).should('contain', 'Information category is required')
      cy.getByData(testIds.info_source_owner_input_error).should('contain', 'Owner name is required')
      cy.getByData(testIds.policy_description_textArea_error).should('contain', 'Description is required')
      cy.getByData(testIds.city_error).should('contain', 'City is required')
      cy.getByData(testIds.policy_source_error).should('contain', 'Source url is required')
      cy.getByData(testIds.policy_applicable_to_error).should('contain', 'Applicable To is required')
    })
    it('should display validation errors with invalid value', () => {
      cy.getByData(testIds.policy_title_input).clear().type('policy')

      cy.getByData(testIds.info_source_owner_input).clear()
      cy.getByData(testIds.policy_description_textArea).clear().type('policy')
      cy.getByData(testIds.date_pick_from).find('input').clear()
      cy.getByData(testIds.date_pick_to).find('input').clear()
      cy.getByData(testIds.policy_source_input).clear().type('policy')
      cy.getByData(testIds.save_policy).click()
      cy.getByData(testIds.title_error).should('contain', 'The title must be between 10 and 100 characters long.')
      cy.getByData(testIds.policy_from_date_error).should('contain', 'Start date is required')
      cy.getByData(testIds.policy_to_date_error).should('contain', 'End date is required')
      cy.getByData(testIds.info_source_owner_input_error).should('contain', 'Owner name is required')
      cy.getByData(testIds.policy_description_textArea_error).should(
        'contain',
        'The description must be between 20 and 500 characters long.'
      )
      cy.getByData(testIds.policy_source_error).should(
        'contain',
        "Please enter a valid URL, starting with 'http://' or 'https://'."
      )
    })
  })
})
