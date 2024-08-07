import { testIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'mediation'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'ODR/searchPage/searchResults.json'
    })
    cy.selectProduct(0)
  })

  it('should render the product details component', () => {
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.productpage_addTocartButton).should('be.visible')
  })

  it('should render details of selected product', () => {
    cy.getByData(testIds.item_title).should('contain.text', 'Mediation Services One')
    cy.getByData(testIds.item_description).should(
      'contain.text',
      'At HarmonyArbitrators, our mediation services are designed to guide you through civil, family, employment, commercial, and financial disputes with skill and compassion. Our experienced mediators foster open communication, facilitating collaborative solutions that prioritize fairness and client satisfaction.'
    )
    cy.getByData(testIds.item_price).should('contain.text', '₹100.00')
    cy.getByData(testIds.productpage_addTocartButton).should('contain.text', 'Proceed')
  })

  it('should navigate to checkout page on Proceed button click', () => {
    cy.getByData(testIds.productpage_addTocartButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', testIds.url_checkout)
  })
})
