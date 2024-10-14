import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
describe('Happy flow of DSEP', () => {
  before(() => {
    cy.visit(testIds.deployed_dsep_url_base)
  })
  // Valid login scenarios
  it('should enable the Sign In button when both fields are filled', () => {
    cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
    cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
    cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
    cy.wait(100)
  })
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
  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.searchInput).clear().type('java')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=java`)
    cy.wait(16000)
  })
  it('should perform search and display results', () => {
    cy.url().should('include', `searchTerm=${'java'}`)
    cy.getByData(testIds.searchpage_products).should('have.length.greaterThan', 0)
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
    cy.wait(5000)
    //cy.getByData(testIds.item_title).should('contain.text', 'java springboot')
    //cy.getByData(testIds.item_provider).should('contain.text', 'Edureka')
    cy.getByData('item-price').should('contain.text', '₹1,000.00')
  })
  it('Should Click on Check for Scholarship and Navigate to myScholarship page', () => {
    cy.getByData(testIds.myScholarship_button).click()
    cy.url().should('include', '/myScholarship')
    cy.wait(1000)
    cy.getByData(testIds.scholarshipCardButton).click()
    cy.wait(17000)
  })
  it('Should Render Scholarship Search Page ', () => {
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', '/scholarshipSearchPage')
    cy.getByData(testIds.search_card_Name).eq(0).should('be.visible')
    cy.getByData(testIds.search_Card_long_desc).eq(0).should('be.visible')
    cy.getByData(testIds.search_card_providerName).eq(0).should('be.visible')
  })
  it('Should Render Scholarship Search Page All Elements', () => {
    cy.getByData(testIds.search_card_Name).eq(0).should('contain.text', 'MS Ramaiah Memorial Scholarship')
    cy.getByData(testIds.search_Card_long_desc)
      .eq(0)
      .should(
        'contain.text',
        'Scholarship Details:\nScholarship amount: Rs. 50,000 scholarship overall\n\nEligibility criteria: CAT/XAT Scores grater than or equal to 80% percentile, and MAT Scores greater than or equal to 90% percentile + throughout 1st division in 10th, 12th and UG'
      )
    cy.getByData(testIds.search_card_providerName)
      .eq(0)
      .should('contain.text', 'By: MS Ramaiah University of Applied Sciences')
  })
  it('Should Navigate to scholarshipDetailsPage when click on 1st Card', () => {
    cy.getByData(testIds.search_card_link).eq(0).click()
    cy.url().should('include', '/scholarshipDetailsPage')
  })
  it('Apply Scholarship', () => {
    cy.getByData(testIds.scholarship_details_Button).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.wait(11000)
    cy.url().should('include', '/applyScholarship')
  })
  it('Should Render Scholarship Apply page With Valid data and navigate to Scholarship Confirmation page ', () => {
    cy.get('#name').clear().type('John Doe')
    cy.get('#mobile').clear().type('6091234567')
    cy.get('#reasonLabel').type('Financial need')
    cy.get('#email').clear().type('john.doe@example.com')
    cy.get('#address').type('sector 56,new delhi')
    cy.get('#zipcode').clear().type('440022')
    cy.get('#submitButton').click()
    cy.wait(8000)
  })
  it('Should nevigate to cart ', () => {
    cy.getByData(testIds.cartButton).click()
  })
  it('should check the shipping, billing, payment section rendered or not & proceed btn', () => {
    cy.getByData(testIds.cartpage_cartOrderButton).click()
    cy.getByData(testIds.checkoutpage_shippingDetails).should('be.visible')
    cy.getByData(testIds.checkoutpage_paymentDetails).should('not.exist')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')
    cy.wait(3000)
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
        cy.wait(8000)
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
    cy.wait(8000)
  })
  it('should render order details page', () => {
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.url().should('include', testIds.url_orderDetails)
    cy.wait(5000)
  })
  it('should render the diff sections of order detail page', () => {
    cy.getByData(testIds.job_main_container).should('be.visible')
    cy.getByData(testIds.orderDetailspage_orderSummary).should('be.visible')
    cy.getByData(testIds.orderDetailspage_orderId_container).should('be.visible')
    cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
    cy.getByData(testIds.orderDetailspage_paymentDetails_container).should('be.visible')
  })
  it('should render the Job Switch Card including all element', () => {
    cy.getByData(testIds.job_main_container_text).should('contain.text', 'Looking to switch jobs?')
    cy.getByData(testIds.job_main_container_job_change_text).should(
      'contain.text',
      'Click here for a tailored job search experience!'
    )
    cy.getByData(testIds.job_main_container_job_search_link).should('contain.text', 'Search for jobs')
  })
  it('should render the order details in Order summary section', () => {
    cy.getByData(testIds.orderDetailspage_orderSummary).should('be.visible')
    cy.getByData(testIds.orderDetails_bookenIn_text).should('contain.text', 'Booked in')
    cy.getByData(testIds.orderDetails_timestamp).should('be.visible')
    cy.getByData(testIds.orderDetails_ordersFulfilled_text).should('contain.text', 'Orders Fulfilled')
    cy.getByData(testIds.orderDetails_ordersFulfilled_length).should('be.visible')
  })
  it('should render the Order ID Section', () => {
    cy.getByData(testIds.orderDetailspage_orderId_container).should('be.visible')
    cy.getByData(testIds.orderDetailspage_orderId).should('be.visible')
    cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('be.visible')
    cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'PAYMENT_RECEIVED')
  })
  it('should render the billing details', () => {
    cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
    cy.getByData(testIds.orderDetailspage_name).should('contain.text', shippingDetails.name)
    cy.getByData(testIds.orderDetailspage_address).eq(0).should('contain.text', shippingDetails.address)
    cy.getByData(testIds.orderDetailspage_mobileNumber).eq(0).should('contain.text', shippingDetails.mobileNumber)
  })
  it('should render the payment breakup details', () => {
    cy.getByData(testIds.orderDetailspage_paymentDetails_container).should('be.visible')
    cy.getByData(testIds.accordion_click).click()
    // cy.get('[data-test="Course Fee"]').should('be.visible')
    cy.getByData(testIds.item_price).eq(0).should('contain.text', '₹1,000.00')
    cy.get('[data-test="Course Discount"]').should('contain.text', 'Course Discount')
    cy.getByData(testIds.item_price).eq(1).should('contain.text', '₹1,000.00')
    cy.getByData(testIds.payment_totalPayment).should('contain.text', 'Total')
    cy.getByData(testIds.item_price).eq(2).should('contain.text', '₹0.00')
  })
  it('Should render job search page', () => {
    cy.getByData(testIds.job_main_container_job_search_link).click()
    cy.wait(20000)
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.job_name).eq(1).should('be.visible')
    cy.getByData(testIds.job_providerName).eq(1).should('be.visible')
    cy.getByData(testIds.job_cityName).eq(1).should('be.visible')
    cy.getByData(testIds.jobBy_providername).eq(1).should('be.visible')
  })
  it('Should render job search page all elements', () => {
    cy.getByData(testIds.job_name).eq(1).should('contain.text', 'Data Analyst - Analytics- Senior Analyst')
    cy.getByData(testIds.job_providerName).eq(1).should('contain.text', 'PWC')
    cy.getByData(testIds.job_cityName).eq(1).should('contain.text', 'Delhi')
    cy.getByData(testIds.jobBy_providername).eq(1).should('contain.text', 'PWC')
  })
  it('Should navigate to job details page', () => {
    cy.getByData('job-detail-link').eq(1).click()
    cy.url().should('include', '/jobDetails?jobDetails')
  })
  it('Should render job details page', () => {
    cy.getByData(testIds.job_details_name).should('be.visible')
    cy.getByData(testIds.job_details_provider_name).should('be.visible')
    cy.getByData(testIds.job_details_description).should('be.visible')
  })
  it('Should render job details page by all elements', () => {
    cy.getByData(testIds.job_details_name).should('contain.text', 'Data Analyst - Analytics- Senior Analyst')
    cy.getByData(testIds.job_details_provider_name).should('contain.text', 'PWC')
    cy.getByData(testIds.job_details_description).should(
      'contain.text',
      'You will be part of the team which partners with the business leaders to provide data driven strategies to grow business KPIs like acquisition, customer engagement & retention, campaign optimization, personalized offering, etc.'
    )
  })
  it('Should navigate to job details page', () => {
    cy.getByData(testIds.job_details_apply).click()
    cy.url().should('include', '/jobApply?jobDetails')
  })
  it('Should render job apply page', () => {
    cy.wait(10000)
    cy.get('#xinputform').should('be.visible')
    cy.get('#nameLabel').should('be.visible')
    cy.get('#mobileLabel').should('be.visible')
    cy.get('#emailLabel').should('be.visible')
  })
  it('Should show error messages for invalid data fields', () => {
    cy.get('#name').clear().type('1')
    cy.get('#mobile').clear().type('w')
    cy.get('#email').clear().type('2')
    cy.get('#nameError').should('contain', 'Please enter a valid name.')
    cy.get('#mobileError').should('contain', 'Please enter a valid 10-digit mobile number.')
    cy.get('#emailError').should('contain', 'Please enter a valid email address.')
    cy.get('#submitButton').should('be.disabled')
  })
  it('should have a button to go back home and navigate to home page when clicked', () => {
    cy.get('#name').clear().type('John Doe')
    cy.get('#mobile').clear().type('6091234567')
    cy.get('#email').clear().type('john.doe@example.com')
    cy.get('#declaration').check().should('be.checked')
    cy.get('#submitButton').click()
    cy.wait(6000)
  })
  it('should have a button to go back home and navigate to home page when clicked', () => {
    cy.getByData(testIds.jobSubmitted_viewToHomePage).click()
    cy.url().should('include', '/')
  })
  it('Should check three dot options', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.myLearning_text_click).should('exist')
    cy.getByData(testIds.myScholarship_text).should('exist')
    //cy.getByData(testIds.Logout_text_click).should('exist')
    cy.get('body').type('{esc}')
  })
  it('should navigate to Scholarship order history', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.myScholarship_text).click()
  })
  it('Should render My Scholarship Page All Elements', () => {
    cy.getByData(testIds.scholarshipCardHeading).eq(1).should('be.visible')
    cy.getByData(testIds.scholarshipCardTime).eq(1).should('be.visible')
    cy.getByData(testIds.scholarshipCardID).eq(1).should('be.visible')
  })
  it('Should render My Scholarship Page', () => {
    cy.getByData(testIds.scholarshipCardHeading).eq(1).should('contain.text', 'MS Ramaiah Memorial Scholarship')
  })
  it('should navigate to order history', () => {
    cy.visit(testIds.deployed_dsep_url_base)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.myLearning_text_click).click()
    cy.getByData(testIds.myLearning_headingText).last().should('contain.text', 'java springboot book')
    cy.getByData(testIds.myLearning_createdAt).eq(1).should('exist')
    cy.getByData(testIds.myLearning_order_id).eq(1).should('exist')
    cy.getByData(testIds.myLearning_order_id).eq(1).should('contain.text', `ID:`)
    cy.getByData('item-price').eq(1).should('contain.text', `₹1,000.00`)
  })
  it('should navigate to perticular courses when click on view courses', () => {
    cy.getByData(testIds.view_course_btn).last().click()
  })
  it('Should Logout from app', () => {
    cy.visit(testIds.deployed_dsep_url_base)
    //cy.getByData(testIds.home_icon).click();
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.Logout_text).click()
  })
})
