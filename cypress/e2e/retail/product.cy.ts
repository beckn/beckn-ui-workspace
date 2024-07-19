import { Urls, UserCredentials, GeneralTestIds, ProductPageTestIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'sunglass'

  before(() => {
    cy.login(Urls.baseUrl, UserCredentials.validEmail, UserCredentials.validPassword)
  })

  beforeEach(() => {
    cy.visit(Urls.homePageUrl)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'searchPage/searchResults.json'
    })
    cy.selectProduct(0)
  })

  it('should render the product details component', () => {
    cy.url().should('include', Urls.productPageUrl)
    cy.getByData(ProductPageTestIds.addTocartButton).should('be.visible')
  })

  it('should render details of selected product', () => {
    cy.getByData(ProductPageTestIds.itemTitle).should('contain.text', 'sunglass One')
    cy.getByData(ProductPageTestIds.itemRating).eq(4)
    cy.getByData(ProductPageTestIds.itemDescription).should(
      'contain.text',
      'Protect you from sun rays and wind Polarised'
    )
    cy.getByData(ProductPageTestIds.itemPrice).should('contain.text', '₹100.00')
    cy.getByData(ProductPageTestIds.incrementCounter).should('be.visible')
    cy.getByData(ProductPageTestIds.counterValue).should('be.visible')
    cy.getByData(ProductPageTestIds.decrementCounter).should('be.visible')
    cy.getByData(ProductPageTestIds.addTocartButton).should('contain.text', 'Add To Cart')
  })

  it('should not able to decrement the count when total count is 1', () => {
    cy.getByData(ProductPageTestIds.decrementCounter).click()
    cy.getByData(ProductPageTestIds.counterValue).should('contain.text', '1')
  })

  it('should increment the count', () => {
    cy.getByData(ProductPageTestIds.incrementCounter).click()
    cy.getByData(ProductPageTestIds.counterValue).should('contain.text', '2')
  })

  it('should add product in cart on add to cart btn click', () => {
    cy.getByData(ProductPageTestIds.incrementCounter).click()
    cy.getByData(ProductPageTestIds.counterValue).should('contain.text', '2')
    cy.getByData(ProductPageTestIds.addTocartButton).click()
    cy.getByData(GeneralTestIds.feedback).should('contain.text', 'Product added to cart')
  })

  it('should navigate to cart on cart icon click', () => {
    cy.getByData(GeneralTestIds.cartButton).click()
    cy.getByData(GeneralTestIds.loadingIndicator).should('be.visible')
    cy.url().should('include', Urls.cartPageUrl)
  })
})
