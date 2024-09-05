import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base_retail, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base_retail}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
  })

  it('should handle address conversion based on coordinates', () => {
    cy.getByData(testIds.location).should('be.visible')
  })
  it('should render the homepage components', () => {
    cy.getByData(testIds.homepage_appTitle).should('be.visible')
    cy.getByData(testIds.homepage_appDescription).should('be.visible')
    cy.getByData(testIds.searchInput).should('be.visible')
    cy.getByData(testIds.homepage_footer).should('be.visible')
  })

  it('should render the app title & description', () => {
    cy.getByData(testIds.homepage_appTitle).should('contain.text', 'Kuza One')
    cy.getByData(testIds.homepage_appDescription).should(
      'contain.text',
      "A global marketplace to discover anything you need. Just type where you want to go and we'll take care of the rest."
    )
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(testIds.searchInput).type('sunglasses')
    cy.getByData(testIds.searchButton).click()
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.url().should('include', `${testIds.url_search}?searchTerm=sunglasses`)
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
    cy.getByData(testIds.homepage_importOrderContainer).should('be.visible')
    cy.getByData(testIds.item_image).should('have.attr', 'src').and('include', 'dummy/img.png')
    cy.getByData(testIds.item_title).should('contain.text', 'Test Item')
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
    cy.getByData(testIds.homepage_viewDetailsButton).click()
    cy.getByData(testIds.goBack).click()
    cy.getByData(testIds.homepage_viewChatGPTList).click()
    cy.wait('@getShoppingList')
    cy.getByData(testIds.homepage_shoppingListItem).should('have.length', 3)
  })
})
