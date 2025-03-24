import { testIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'sunglass'

  before(() => {
    cy.visit(testIds.deployed_url_home)
  })

  it('Happy Flow should work', () => {
    // should Login and render the homepage components
    cy.loginDynamic(testIds.user_validEmail, testIds.user_validPassword)
    cy.getByData(testIds.homepage_appTitle).should('be.visible')

    // should perform search and navigate to search results
    cy.performSearchDynamic('sunglass')

    // Verify search URL
    cy.url().should('include', `searchTerm=${searchTerm}`)

    //Select 1st product
    cy.getByData(testIds.searchpage_products).first().click()
    cy.url().should('include', testIds.url_product)

    //Should render product details of selected product
    cy.getByData(testIds.item_price).should('contain.text', '1,500.00 ₹')
    cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
    cy.getByData(testIds.productpage_counterValue).should('be.visible')
    cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
    cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Add To Cart')

    // Add product to cart
    cy.getByData(testIds.productpage_incrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.feedback).should('contain.text', 'Product added to cart')

    // Navigate to cart icon
    cy.getByData(testIds.cartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_cart)

    // Verify cart page
    cy.getByData(testIds.cartpage_orderSummaryText).should('contain.text', 'Order Summary')
    cy.getByData(testIds.cartpage_totalQuantityText).should('contain.text', 'Total Quantity')
    cy.getByData(testIds.cartpage_totalAmountText).should('contain.text', 'Total Amount')

    // Go to checkout page
    cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Order')
    cy.getByData(testIds.cartpage_cartOrderButton).click()

    // Verify billing and shipping page
    cy.getByData(testIds.item_details).should('have.length', 1)

    // Add shipping details
    cy.getByData(testIds.checkoutpage_shippingDetails).getByData(testIds.checkoutpage_openForm).click()
    cy.getByData(testIds.checkoutpage_form).should('be.visible')

    cy.getByData(testIds.checkoutpage_shippingDetails)
      .getByData(testIds.checkoutpage_form)
      .within(() => {
        cy.getByData('submit').click()
      })

    // Verify payment break up details
    cy.wait(2000)
    cy.getByData(testIds.checkoutpage_paymentDetails).within(() => {
      cy.get('[data-test="BASE PRICE"]').should('contain.text', 'BASE PRICE')
      // cy.getByData(testIds.checkoutpage_taxes).should('contain.text', 'taxes')
      cy.getByData(testIds.checkoutpage_totalPayment).should('contain.text', 'Total')
    })

    // Proceed to checkout

    cy.getByData(testIds.checkoutpage_proceedToCheckout).click()
    cy.url().should('include', '/paymentMode')

    // Verify payment page

    cy.contains(testIds.paymentpage_creditcardAndDebitCard).should('contain.text', 'Credit & Debit Cards')
    cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_phonePay).should('contain.text', 'PhonePe UPI')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash on Delivery')
    cy.getByData(testIds.paymentpage_image).should('have.attr', 'src')
    cy.getByData(testIds.paymentpage_radioButton).parent().find('img').should('have.length.greaterThan', 0)
    cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).contains('Confirm Order').should('be.disabled')

    // Confirm order and proceed to confirmation page
    cy.getByData(testIds.paymentpage_radioButton).eq(3).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.url().should('include', testIds.url_orderConfirmation)

    // Proceed to order details page
    cy.getByData(testIds.orderConfirmation_viewOrderButton).click()

    // Verify order details page
    cy.url().should('include', testIds.url_orderDetails)
    cy.getByData(testIds.orderDetailspage_orderOverview).should('be.visible')
    cy.getByData(testIds.orderDetailspage_progressSummary).should('be.visible')
    cy.getByData(testIds.orderDetailspage_shippingDetails).should('be.visible')
    cy.getByData(testIds.orderDetailspage_billingDetails).should('be.visible')
    cy.getByData(testIds.orderDetailspage_paymentDetails).should('be.visible')
    cy.getByData(testIds.orderDetailspage_productPlacedAt).should('be.visible')
    cy.getByData(testIds.orderDetailspage_orderStatus).should('contain.text', 'ACTIVE')

    // cy.getByData(testIds.orderDetailspage_orderStatusMap).within(() => {
    //   cy.getByData(testIds.orderDetailspage_orderStateName).should('have.length', 1)

    //   cy.getByData(testIds.orderDetailspage_orderStateName).eq(0).should('contain.text', 'Processing your order')
    //   cy.getByData(testIds.orderDetailspage_orderStateTime).eq(0).should('be.visible')
    // })

    cy.getByData(testIds.orderDetailspage_otherOptions).should('be.visible')
    cy.getByData(testIds.orderDetailspage_otherOptions).click()
    cy.wait(3000)
    cy.getByData(testIds.orderDetailspage_menus).should('exist')

    cy.getByData(testIds.orderDetailspage_menuItemName).eq(0).should('contain.text', 'Track Order')
    cy.getByData(testIds.orderDetailspage_menuItemName).eq(1).should('contain.text', 'Update Order')
    cy.getByData(testIds.orderDetailspage_menuItemName).eq(2).should('contain.text', 'Cancel Order')
    cy.getByData(testIds.orderDetailspage_callServiceItemName).eq(0).should('contain.text', 'Call Customer Service')
  })
})
