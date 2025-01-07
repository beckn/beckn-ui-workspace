import { testIds } from '../../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'weather forecast'
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)

    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'Climate-resilience/SKY-ANALYTICS/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
  })

  it('should render the product details component', () => {
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.Proceed_to_product).should('be.disabled')
    cy.getByData(testIds.item_title).should('be.visible')
    cy.getByData(testIds.product_page_Image).should('be.visible')
    cy.getByData(testIds.product_about_section).should('be.visible')
    cy.getByData(testIds.product_about_short_desc).should('be.visible')
    cy.getByData(testIds.product_about_productInfo).should('be.visible')
  })

  it('should render  Model Confidence Levels and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(0).click()
  })
  it('should render  Spacial representation type and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(4).click()
  })
  it('should render  Flood Prediction Data Points and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(5).click()
  })
  it('should render Spatial Representation Type and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(8).click()
  })
  it('should render Spatial Coverage and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(11).click()
  })
  it('should render Spatial Resolutions and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(15).click()
  })

  it('should render   Temporal Coverage and click On Checkbox', () => {
    cy.getByData('"product-checkbox"').eq(18).click()
  })

  it('should render Data Sharing Modes and click On Radio Button', () => {
    cy.getByData('product-radio').eq(0).click()
  })
  it('should render Subscription Duration and click On Radio Button', () => {
    cy.getByData('product-radio').eq(4).click()
  })
  it('should navigate to Cart page on Proceed button click', () => {
    cy.getByData('"product-checkbox"').eq(19).click()
    cy.getByData(testIds.Proceed_to_product).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_cart)
  })
})
