import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('Negative TC for Tourism App', () => {
  before(() => {
    cy.visit(testIds.deployed_tourism_url_base)
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
  context('Valid Login and Home page', () => {
    // Valid login scenarios
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(2000)
    })
  })
  context('search with wrong keyword', () => {
    it('search with wrong keyword', () => {
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type('Pune')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_searchInput).should('have.value', 'Pune, Maharashtra, India')
      cy.getByData(testIds.homepage_search_button).click()
      cy.wait(17000)
    })
    it('should render the message if no product to display', () => {
      cy.getByData(testIds.noDataAvailable).should('be.visible')
      cy.getByData(testIds.noDataAvailable).should(
        'contain.text',
        'There are no products in this category yet! New products will be added soon.'
      )
    })
  })
  context('search with valid keyword', () => {
    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.home_icon).click()
      cy.getByData(testIds.homepage_searchInput).click()
      cy.getByData(testIds.loaction_list).type('Manali')
      cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
      cy.getByData(testIds.homepage_searchInput).should('have.value', 'Manali, Himachal Pradesh, India')
      cy.getByData(testIds.homepage_search_button).click()
      cy.wait(17000)
    })
  })
  context('Clear filters should reset all applied filters and show all results', () => {
    it('should handle reset applied filter', () => {
      cy.getByData(testIds.searchpage_sortByPrice).select(2)
      cy.getByData(testIds.searchpage_filterByRating).select(2)
      cy.getByData(testIds.searchpage_applyFilter).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Hampta Pass Trek - Manali - EACH')
      cy.getByData(testIds.searchpage_resetBtn).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Chandra Tal Trek - Manali')
    })
  })
  context('Should validate Billing & Shipping details', () => {
    it('should select and add Billing & Shipping details', () => {
      cy.selectProduct(0)
    })
    it('should not able to decrement the count when total count is 1', () => {
      cy.getByData(testIds.productpage_decrementCounter).click()
      cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.wait(2000)
    })
    it('should validate shipping form fields', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).first().click()

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
  context('Should checkout product', () => {
    it('should checkout product', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
      cy.getByData(testIds.paymentpage_confirmButton).click()
      cy.wait(300)
      cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
      cy.getByData(testIds.orderDetailspage_otherOptions).click()
      cy.get(':nth-child(2) > [data-test="menuItemName"]').click()
      cy.wait(1000)
    })
    it('should validate update order details', () => {
      cy.getByData(testIds.checkoutpage_name).clear().type('12345').blur()
      cy.contains('Name can only contain letters and spaces').should('be.visible')
      cy.getByData(testIds.checkoutpage_mobileNumber).clear().type('12345').blur()
      cy.contains('Invalid mobile number').should('be.visible')
      cy.getByData(testIds.checkoutpage_email).clear().type('invalid-email').blur()
      cy.contains('Invalid email format').should('be.visible')
      // cy.getByData(testIds.checkoutpage_address).clear().blur()
      // cy.contains('Complete Address is required').should('be.visible')
      cy.getByData(testIds.checkoutpage_pinCode).clear().type('123').blur()
      cy.contains('Invalid Zip Code').should('be.visible')
      cy.getByData('submit').should('be.disabled')
    })
    it('should update order', () => {
      cy.getByData(testIds.checkoutpage_name).clear().type(shippingDetails.name)
      cy.getByData(testIds.checkoutpage_mobileNumber).clear().type(shippingDetails.mobileNumber)
      cy.getByData(testIds.checkoutpage_email).clear().type(shippingDetails.email)
      cy.getByData(testIds.checkoutpage_address).clear().type(shippingDetails.address)
      cy.getByData(testIds.checkoutpage_pinCode).clear().type(shippingDetails.pinCode)
      cy.getByData('submit').click()
    })
  })
})
