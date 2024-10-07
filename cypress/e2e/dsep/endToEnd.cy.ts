import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
import { orderResponse } from '../../fixtures/INDUSTRY4.0/orderConfirmation/orderResponse'
describe('end to end testing', () => {
  before(() => {
    cy.visit(testIds.deployed_dsep_url_base)
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
  context('Home Page and Components', () => {
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_appTitle).should('be.visible')
      cy.getByData(testIds.homepage_appDescription).should('be.visible')
      cy.getByData(testIds.searchInput).should('be.visible')
      cy.getByData(testIds.homepage_footer).should('be.visible')
    })
    it('should render the app title & description', () => {
      cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Skill Up')
      cy.getByData(testIds.homepage_appDescription).should(
        'contain.text',
        'Discover diverse online resources, scholarships, and job opportunities in one convenient platform, enhancing your expertise across multiple fields.'
      )
    })
    it('should perform search', () => {
      cy.getByData(testIds.searchInput).clear().type('java')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', `${testIds.url_search}?searchTerm=java`)
      cy.wait(500)
    })
    it('should navigate to cart on cart icon click', () => {
      cy.getByData(testIds.cartButton).click()
      cy.url().should('include', testIds.url_cart)
    })
    it('should render the cart page with no items', () => {
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'No Course!')
      cy.getByData(testIds.cartpage_emptySubHeading).should('contain.text', `Seems like you haven't selected a course`)
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Search Courses')
      cy.getByData(testIds.home_icon).click()
    })
    it('should perform search and navigate to search results', () => {
      cy.getByData(testIds.searchInput).clear().type('java')
      cy.getByData(testIds.searchButton).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.url().should('include', `${testIds.url_search}?searchTerm=java`)
      cy.wait(16000)
    })
  })
  context('Search result and Sort', () => {
    it('should perform search and display results', () => {
      cy.url().should('include', `searchTerm=${'java'}`)
      cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
    })

    it('should handle sort by All Option', () => {
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'java springboot book')
    })

    it('should handle sort by Cheapest Option', () => {
      cy.getByData('cheapest').eq(0).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'Everyday Conversational EnglishDuration')
    })

    it('should handle sort by Expensive Option', () => {
      cy.getByData('expensive').eq(0).click()
      cy.getByData(testIds.searchpage_products).eq(0).should('contain.text', 'java springboot book')
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
    })
    it('should render the product details component', () => {
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
    })
    it('should render details of selected product', () => {
      //cy.getByData(testIds.item_title).should('contain.text', 'java springboot book One')
      cy.getByData('rating-container').should('be.visible')
      // cy.getByData(testIds.item_description).should('contain.text', 'java springboot book One')
      // cy.getByData(testIds.item_price).should('contain.text', '₹2,000.00')
      cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Add to Cart')
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
    it('should display the item details', () => {
      //cy.getByData(testIds.item_title).should('contain.text', 'java springboot')
      //cy.getByData(testIds.item_provider).should('contain.text', 'Edureka')
      cy.getByData('item-price').should('contain.text', '₹1,000.00')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
    it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
      cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
      cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
      cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
      cy.wait(3000)
    })

    it('should Billing  form fields', () => {
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
          cy.wait(3000)
        })
    })

    it('should display the payment section', () => {
      cy.getByData(testIds.checkoutpage_paymentDetails).should('be.visible')
    })
    it('should display the payment breakup details', () => {
      //cy.get('[data-test="Course Fee"]').should('be.visible')
      cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹1,000.00')

      // cy.get('[data-test="Course Discount"]').should('contain.text', 'Course Discount')
      cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹1,000.00')

      //cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
      cy.getByData(testIds.item_price).eq(3).should('contain.text', '₹0.00')
    })

    it('should proceed to checkout when valid data is provided', () => {
      cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
      cy.url().should('include', '/orderConfirmation')
    })
  })
})
