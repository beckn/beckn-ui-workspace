import { testIds } from '../../../shared/dataTestIds'
import { billingDetails, shippingDetails } from '../../fixtures/checkoutPage/userDetails'
import { initResponse } from '../../fixtures/checkoutPage/initResponse'
// import { HomeIcon } from '../../../apps/taxi-bpp/src/lib/icons/home-icon';
describe('User Journey', () => {
  before(() => {
    cy.visit(testIds.deployed_industry_url_base)
  })
  context('Happy Flow', () => {
    // Valid login scenarios
    it('login with valid ID and Password', () => {
      cy.getByData(testIds.auth_inputEmail).clear().type('sanket@gmail.com')
      cy.getByData(testIds.auth_inputPassword).clear().type('P@ssw0rd')
      cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
      cy.wait(2000)
    })
    // Home Page
    it('should render the homepage components', () => {
      cy.getByData(testIds.homepage_image).should('be.visible')
      cy.getByData(testIds.homepge_text).should('be.visible')
      cy.getByData(testIds.homepge_text).should(
        'contain.text',
        'To proceed with creating your workflow, please set your location and search for services.'
      )
      cy.getByData(testIds.search_bar_main_container).should('be.visible')
      cy.getByData(testIds.search_input).should('be.visible')
      cy.getByData(testIds.search_button).should('be.visible')
    })
    it('should perform search and navigate to search results', () => {
      cy.wait(2000)
      cy.getByData(testIds.search_input).clear().type('assembly')
      cy.getByData(testIds.search_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
      cy.wait(16000)
    })
    it('should navigate to product details on item click', () => {
      cy.getByData(testIds.search_page_product_OnClick).first().click()
    })
    it('should navigate to assemblyDetails page on Book button click', () => {
      cy.getByData(testIds.product_page_book_button).click()
      cy.getByData(testIds.loadingIndicator).should('be.visible')
    })
    //Add Assembly Details
    it('should render the assembly details form with the correct title', () => {
      cy.get('h1').should('contain', 'Add Assembly Details')
    })
    it('should allow the user to select Type, Colour, and Shape', () => {
      cy.get(testIds.typeLabel).should('be.visible')
      cy.get(testIds.type).select('Plastic Box')
      cy.get(testIds.type).should('have.value', 'Plastic Box')
      cy.get(testIds.colorLabel).should('be.visible')
      cy.get(testIds.colour).select('Blue')
      cy.get(testIds.colour).should('have.value', 'Blue')
      cy.get(testIds.shapeLabel).should('be.visible')
      cy.get(testIds.shape).select('Circle')
      cy.get(testIds.shape).should('have.value', 'Circle')
    })
    it('should allow the user to increase and decrease quantity', () => {
      cy.get(testIds.increaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '2')
      cy.get(testIds.decreaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '1')
    })
    it('should allow the user to submit the form', () => {
      cy.get(testIds.length).type('10')
      cy.get(testIds.width).type('100')
      cy.get(testIds.weight).type('10')
      cy.get(testIds.increaseQuantity).click()
      cy.get(testIds.quantity).should('have.value', '2')
      cy.get('button[type="submit"]').click()
    })
    it('should fill and save the shipping form data', () => {
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
    it('should render the invoice modal on click of invoice icon and Render invoice details page', () => {
      cy.getByData(testIds.downloadInvoiceIcon).should('be.visible')
      cy.getByData(testIds.downloadInvoiceIcon).click()
      cy.getByData(testIds.invoice).click()
      cy.getByData(testIds.invoiceDetaislPage_orderOverview).should('be.visible')
      cy.getByData(testIds.invoiceDetaislPage_assembly_text).should('be.visible')
      cy.getByData(testIds.invoiceDetaislPage_price).should('be.visible')
    })
    it('should redirect to order history', () => {
      cy.get('.css-15mvw4m > .chakra-image').click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.orderHistory_text_click).click()
    })
    it('Should Logout from Application', () => {
      cy.get('.css-15mvw4m > .chakra-image').click()
      cy.getByData(testIds.threeDots).click()
      cy.getByData(testIds.Logout_text_click).click()
    })
  })
})
