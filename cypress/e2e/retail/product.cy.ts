import { testIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'sunglass'

  before(() => {
    cy.login(Cypress.env('CYPRESS_BASE_URL'), testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${Cypress.env('CYPRESS_BASE_URL')}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'searchPage/searchResults.json'
    })
    cy.selectProduct(0)
  })

  it('should render the product details component', () => {
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
  })

  it('should render details of selected product', () => {
    cy.getByData(testIds.item_title).should('contain.text', 'sunglass One')
    cy.getByData(testIds.item_rating).eq(4)
    cy.getByData(testIds.item_description).should('contain.text', 'Protect you from sun rays and wind Polarised')
    cy.getByData(testIds.item_price).should('contain.text', '100.00 ₹')
    cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
    cy.getByData(testIds.productpage_counterValue).should('be.visible')
    cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
    cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Add To Cart')
  })

  it('should not able to decrement the count when total count is 1', () => {
    cy.getByData(testIds.productpage_decrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
  })

  it('should increment the count', () => {
    cy.getByData(testIds.productpage_incrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
  })

  it('should add product in cart on add to cart btn click', () => {
    cy.getByData(testIds.productpage_incrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.feedback).should('contain.text', 'Product added to cart')
  })

  it('should navigate to cart on cart icon click', () => {
    cy.getByData(testIds.cartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_cart)
  })
})
