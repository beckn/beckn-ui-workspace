import { testIds } from '../../../shared/dataTestIds'

describe('Product details Page Tests', () => {
  const searchTerm = 'assembly'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'INDUSTRY4.0/searchPage/searchResults.json'
    })
    cy.getByData(testIds.search_page_product_OnClick).first().click()
  })

  it('should render the product details component', () => {
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.product_page_Image).should('be.visible')
    cy.getByData(testIds.product_page_short_desc).should('be.visible')
    cy.getByData(testIds.product_page_long_desc).should('be.visible')
    cy.getByData(testIds.product_page_book_button).should('be.visible')
  })

  it('should render details of selected product', () => {
    cy.getByData(testIds.product_page_short_desc).should('contain.text', 'This is an intermittent assembly type.')
    cy.getByData(testIds.product_page_book_button).should('contain.text', 'Book')
  })

  it('should navigate to assemblyDetails page on Book button click', () => {
    cy.getByData(testIds.product_page_book_button).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.performSelect({ fixture: 'INDUSTRY4.0/select/selectResult.json' }, 'selectResponse')
    cy.url().should('include', testIds.url_assembly)
  })
})
