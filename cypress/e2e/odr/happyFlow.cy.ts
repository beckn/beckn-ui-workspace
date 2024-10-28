import { testIds } from '../../../shared/dataTestIds'

describe('ODR Application Testcases', () => {
  before(() => {
    cy.visit(testIds.deployed_odr_url_base)
  })

  it('Happy Flow should work', () => {
    // should Login and render the homepage components
    cy.loginDynamic(testIds.user_validEmail, testIds.user_validPassword)
    cy.getByData(testIds.homepage_appTitle).should('be.visible')
    cy.getByData(testIds.homepage_appDescription).should('be.visible')
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.homepage_footer).should('be.visible')

    // drop down should open
    cy.getByData(testIds.select_input).click()
    cy.getByData(testIds.dropdown_item).should('be.visible')

    // Verify app title and description
    cy.getByData(testIds.homepage_appTitle).should('contain.text', 'LegalEase')
    cy.getByData(testIds.homepage_appDescription).should(
      'contain.text',
      'LegalEase allows anyone to discover lawyers, online dispute resolution (ODR) service providers, paralegals and other legal services and information in a quick and seamless manner'
    )

    // Select item from drop down
    const itemToSelect = 'Financial Disputes'

    // cy.contains('Select Category')
    // .click()
    cy.getByData(testIds.select_input)
    // .click()
    cy.getByData(testIds.dropdown_item_list).eq(1).click()
    cy.getByData(testIds.select_input).should('contain.text', itemToSelect)

    // Perform search
    cy.getByData(testIds.searchInput).type('mediation')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=mediation&selectedItem=financial-dispute`)
    cy.wait(16000)
    // Verify search result page renders page components
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.searchButton).should('be.visible')
    cy.getByData(testIds.searchpage_filterContainer).should('be.visible')

    // Verify filter and sort functionality
    cy.getByData(testIds.searchpage_filterContainer).should('be.visible')
    cy.getByData(testIds.searchpage_resetBtn).should('be.visible')
    cy.getByData(testIds.searchpage_sortByPrice).should('be.visible')
    cy.getByData(testIds.searchpage_filterByRating).should('be.visible')
    cy.getByData(testIds.searchpage_applyFilter).should('be.visible')

    // Click on 1st product displayed
    cy.getByData(testIds.searchpage_products).first().click()
    cy.url().should('include', testIds.url_product)

    // Verify product details page
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.productpage_addTocartButton).should('be.visible')

    cy.getByData(testIds.item_title).should('contain.text', 'Mediation Services')
    cy.getByData(testIds.item_description).should(
      'contain.text',
      'At HarmonyArbitrators, our mediation services are designed to guide you through civil, family, employment, commercial, and financial disputes with skill and compassion. Our experienced mediators foster open communication, facilitating collaborative solutions that prioritize fairness and client satisfaction.'
    )
    cy.getByData(testIds.item_price).should('contain.text', '₹3,000.00')
    cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Proceed')

    // Navigate to checkout page
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_checkout)

    // Verify all components are rendered on checkout page
    cy.wait(2000)
    cy.getByData(testIds.checkoutpage_complaints_Details).should('be.visible')
    cy.getByData(testIds.checkoutpage_respondent_Details).should('be.visible')
    cy.getByData(testIds.checkoutpage_proceedToCheckout).should('be.disabled')

    // fill and save the Complainant & Billing Details form
    cy.getByData(testIds.checkoutpage_complaints_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()
    cy.getByData(testIds.checkoutpage_form).should('be.visible')

    cy.getByData(testIds.checkoutpage_complaints_Details)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData('submit').click()
      })

    // fill and save the Respondent Details form
    cy.getByData(testIds.checkoutpage_respondent_Details).getByData(testIds.checkoutpage_openForm).eq(0).click()
    cy.getByData(testIds.checkoutpage_form).should('be.visible')

    cy.getByData(testIds.checkoutpage_respondent_Details)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData('submit').click()
      })

    // fill and save the Dispute Details form
    cy.getByData(testIds.checkoutpage_dispute_Details).click()
    cy.getByData(testIds.xinput_form_open).should('be.visible')

    cy.getByData(testIds.xinput_form).within(() => {
      cy.getByData('details').type('sanket')
      cy.getByData('"claimValue"').type('1234')
      cy.getByData('btnSave').click()
    })

    // fill and save the Consent Form
    cy.getByData(testIds.checkoutpage_consent_Details).click()
    cy.getByData(testIds.xinput_form_open).should('be.visible')

    cy.getByData(testIds.xinput_form).within(() => {
      cy.getByData('name').type('sanket')
      cy.getByData('"place"').type('pune')
      cy.getByData('btnConfirm').click()
    })

    // Proceed to checkout
    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', testIds.url_orderConfirmation)

    // Verify order confirmation page
    cy.getByData(testIds.confirmPageImage).should('have.attr', 'src')
    cy.getByData(testIds.orderConfirmation_successOrderMessage).should('contain.text', 'ORDER SUCCESFULL')
    cy.getByData(testIds.orderConfirmation_gratefulMessage).should('contain.text', 'Thank you for your order!')
    cy.getByData(testIds.orderConfirmation_trackOrderMessage).should(
      'contain.text',
      'You can track your order in "My Order" section'
    )

    // Proceed to view case details page
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()
    cy.url().should('include', testIds.url_orderDetails)

    // Go back to home page
    // cy.getByData(testIds.orderConfirmation_goBackToHome).click()
    // cy.url().should('include', testIds.url_home)

    // Verifuy case details page
    cy.url().should('include', testIds.url_orderDetails)
    cy.getByData(testIds.orderDetailspage_orderOverview).should('be.visible')
    cy.getByData(testIds.orderDetailspage_progressSummary).should('be.visible')
    cy.getByData(testIds.orderDetailspage_shippingDetails).should('be.visible')
    cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')

    // Verify the order product details in order overview section
    cy.getByData(testIds.orderDetailspage_productName).should('contain.text', 'Mediation Services')
    cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')

    // the order provider details in order overview section
    cy.getByData(testIds.orderDetailspage_orderSummaryItemName).should('contain.text', 'Alpha Pvt Ltd., India.')

    //verify "REQUEST_RECEIVED" order status in progress summary
    cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'REQUEST_RECEIVED')

    // Verify all the option in Other options modal
    cy.getByData(testIds.orderDetailspage_otherOptions).should('be.visible')
    cy.getByData(testIds.orderDetailspage_otherOptions).click()

    cy.getByData(testIds.orderDetailspage_menus).within(() => {
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(0).should('contain.text', 'Track Order')
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(2).should('contain.text', 'Cancel Order')
      cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(0).should('contain.text', 'Call Customer Service')
      cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(1).should('contain.text', 'Email Customer Service')
    })

    // Verify update order page
    cy.getByData(testIds.orderDetailspage_menus).within(() => {
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
      cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).click()
      cy.url().should('include', testIds.url_updateShippingDetails)
    })

    cy.getByData(testIds.orderDetailspage_updateShippingDetails)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData(testIds.checkoutpage_name).type('omkar')
        cy.getByData(testIds.checkoutpage_mobileNumber).type('1234567890')
        cy.getByData(testIds.checkoutpage_email).type('omkar@eminds.ai')
        cy.getByData('submit').click()
      })
    cy.wait(4000)
    //check order history
    cy.getByData(testIds.home_icon).click()
    cy.wait(100)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.orderHistory_text_click).click()
    cy.getByData(testIds.order_history_main_container).eq(0).click()
    cy.url().should('include', testIds.url_orderDetails)
    //Logout from app
    cy.getByData(testIds.home_icon).click()
    cy.wait(100)
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.Logout_text_click).click()
  })
})
