import { testIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'Java'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.performSearch(searchTerm, {
      fixture: 'DSEP/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
  })

  it('should render the product details component', () => {
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
  })
  it('should navigate to cart on cart icon click', () => {
    cy.getByData(testIds.cartButton).click()
    cy.url().should('include', testIds.url_cart)
  })

  it('should render details of selected product', () => {
    cy.getByData(testIds.item_title).should('contain.text', 'java springboot book One')
    cy.getByData('rating-container').should('be.visible')
    cy.getByData(testIds.item_description).should('contain.text', 'java springboot book One')
    cy.getByData(testIds.item_price).should('contain.text', '₹2,000.00')
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
})
