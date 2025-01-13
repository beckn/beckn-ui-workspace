import { testIds } from '../../../../shared/dataTestIds'
describe('Cart Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })
  context('When there are no items in cart', () => {
    const searchTerm = 'data'
    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'forest-conservation/ENVIROGROWTH/searchPage/searchResults.json'
      })
      cy.selectProduct(0)
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.cartButton).click()
    })

    it('should render the cart page with no items', () => {
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(testIds.cartpage_emptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Add Request')
    })
  })
  context('should render When there are Items in Cart', () => {
    const searchTerm = 'floodprediction'
    beforeEach(() => {
      cy.visit(`${testIds.url_base}${testIds.url_home}`)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'forest-conservation/ENVIROGROWTH/searchPage/searchResults.json'
      })
      cy.selectProduct(0)
      cy.url().should('include', testIds.url_product)
      cy.getByData('"product-checkbox"').eq(0).click()
      cy.getByData('"product-checkbox"').eq(3).click()
      cy.getByData('"product-checkbox"').eq(5).click()
      cy.getByData('"product-checkbox"').eq(9).click()
      cy.getByData('product-radio').eq(0).click()
      cy.getByData('"product-checkbox"').eq(12).click()
      cy.getByData(testIds.Proceed_to_product).click()
      cy.intercept('POST', '/select', { fixture: 'forest-conservation/ENVIROGROWTH/cart/selectResult.json' }).as(
        'selectCall'
      )
      cy.wait('@selectCall')
      cy.getByData(testIds.feedback).should('contain.text', 'SuccessRequest added')
      cy.getByData(testIds.feedback).getByData('close').click()
      cy.url().should('include', testIds.url_cart)
    })

    it('should render and display cart page with result', () => {
      cy.getByData(testIds.feedback).getByData('close').click()
      cy.getByData(testIds.envirogrowth_shortDesc).should('be.visible')
      cy.getByData(testIds.envirogrowth_shortDesc).should('contain.text', 'Archive of climate and weather data')
      cy.getByData(testIds.envirogrowth_provider).should('be.visible')
      cy.getByData(testIds.envirogrowth_provider).should('contain.text', 'Provided by Nationa Met Dept')
      cy.getByData(testIds.Proceed).click()
      cy.url().should('include', testIds.url_checkout)
    })
  })
})
