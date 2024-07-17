// @ts-ignore
describe('Home Page Tests', () => {
  const baseUrl = 'http://localhost:3002'
  const homePageUrl = `${baseUrl}/`
  const searchPageUrl = `${baseUrl}/search?searchTerm=sunglasses`
  const validEmail = 'ankit@gmail.com'
  const validPassword = 'Enterthevoid@123'

  before(() => {
    cy.login(baseUrl, validEmail, validPassword)
  })

  beforeEach(() => {
    cy.visit(homePageUrl)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
  })

  it('should render the homepage components', () => {
    cy.getByData('header').should('be.visible')
    cy.getByData('description').should('be.visible')
    cy.getByData('search-input').should('be.visible')
    cy.getByData('footer').should('be.visible')
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData('search-input').type('sunglasses')
    cy.getByData('search-button').click()
    cy.getByData('loading-indicator').should('be.visible')
    cy.url().should('eq', searchPageUrl)
  })

  it('should handle address conversion based on coordinates', () => {
    cy.getByData('address').should('contain.text', 'Test Address, Test City, Test Country')
  })

  it('should fetch and display imported order details', () => {
    cy.window().then(win => {
      win.history.pushState({}, '', '/?external_url=http://example.com/importedOrder')
      cy.intercept('GET', 'http://example.com/importedOrder', {
        fixture: 'homePage/importedOrder.json'
      }).as('importedOrder')
      cy.reload()
    })

    cy.wait('@importedOrder')
    cy.getByData('imported-order').should('be.visible')
    cy.getByData('item-image').should('have.attr', 'src').and('include', 'dummy/img.png')
    cy.getByData('item-name').should('contain.text', 'Test Item')
  })

  it('should display chat GPT generated shopping list', () => {
    cy.window().then(win => {
      win.history.pushState({}, '', '/?external_url=http://example.com/importedOrder')
      cy.intercept('GET', 'http://example.com/importedOrder', {
        fixture: 'homePage/importedOrder.json'
      }).as('importedOrder')
      cy.reload()
    })

    cy.intercept('POST', '**/api.experience-gpt.becknprotocol.io/v2/search', {
      fixture: 'homePage/shoppingList.json'
    }).as('getShoppingList')

    cy.wait('@importedOrder')
    cy.getByData('imported-order-view-details').click()
    cy.getByData('go-back').click()
    cy.getByData('view-chat-gpt-list').click()
    cy.wait('@getShoppingList')
    cy.getByData('shopping-list-item').should('have.length', 3)
  })
})
