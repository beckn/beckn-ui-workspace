import { testIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'Manali'

  before(() => {
    cy.login(testIds.url_base_tourism, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base_tourism}${testIds.url_home}`)
    cy.getByData(testIds.homepage_searchInput).click()
    cy.getByData(testIds.loaction_list).type(searchTerm)
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
    cy.getByData(testIds.homepage_search_button).click()
    cy.performSearch(searchTerm, {
      fixture: 'TOURISM/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
  })

  it('should render the product details component', () => {
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
  })

  it('should render details of selected product', () => {
    cy.getByData(testIds.item_title).should('contain.text', 'Hampta Pass Trek - Manali One')
    cy.getByData(testIds.item_rating).eq(4)
    cy.getByData(testIds.item_description).should(
      'contain.text',
      'It is called Moon Lake because of its crescent shape and is the origin of Chander River.'
    )
    cy.getByData(testIds.item_price).should('contain.text', '₹100.00')
    cy.getByData(testIds.productpage_incrementCounter).should('be.visible')
    cy.getByData(testIds.productpage_counterValue).should('be.visible')
    cy.getByData(testIds.productpage_decrementCounter).should('be.visible')
    cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Book Now')
  })

  it('should not able to decrement the count when total count is 1', () => {
    cy.getByData(testIds.productpage_decrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '1')
  })

  it('should increment the count', () => {
    cy.getByData(testIds.productpage_incrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
  })

  it('should navigate to Checkout Page on Book Now Button click', () => {
    cy.getByData(testIds.productpage_incrementCounter).click()
    cy.getByData(testIds.productpage_counterValue).should('contain.text', '2')
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_checkout)
  })
})
