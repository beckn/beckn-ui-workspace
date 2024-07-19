import { Urls, UserCredentials, GeneralTestIds, HomePageTestIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {
    cy.login(Urls.baseUrl, UserCredentials.validEmail, UserCredentials.validPassword)
  })

  beforeEach(() => {
    cy.visit(Urls.homePageUrl)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
  })

  it('should render the homepage components', () => {
    cy.getByData(HomePageTestIds.appTitle).should('be.visible')
    cy.getByData(HomePageTestIds.appDescription).should('be.visible')
    cy.getByData(HomePageTestIds.searchInput).should('be.visible')
    cy.getByData(HomePageTestIds.footer).should('be.visible')
  })

  it('should render the app title & description', () => {
    cy.getByData(HomePageTestIds.appTitle).should('contain.text', 'Kuza One')
    cy.getByData(HomePageTestIds.appDescription).should(
      'contain.text',
      "A global marketplace to discover anything you need. Just type where you want to go and we'll take care of the rest."
    )
  })

  it('should perform search and navigate to search results', () => {
    cy.getByData(HomePageTestIds.searchInput).type('sunglasses')
    cy.getByData(HomePageTestIds.searchButton).click()
    cy.getByData(GeneralTestIds.loadingIndicator).should('be.visible')
    cy.url().should('eq', `${Urls.searchPageUrl}?searchTerm=sunglasses`)
  })

  it('should handle address conversion based on coordinates', () => {
    cy.getByData(GeneralTestIds.location).should('contain.text', 'Test Address, Test City, Test Country')
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
    cy.getByData(HomePageTestIds.container).should('be.visible')
    cy.getByData(HomePageTestIds.itemImage).should('have.attr', 'src').and('include', 'dummy/img.png')
    cy.getByData(HomePageTestIds.itemTitle).should('contain.text', 'Test Item')
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
    cy.getByData(HomePageTestIds.viewDetailsButton).click()
    cy.getByData(GeneralTestIds.goBack).click()
    cy.getByData(HomePageTestIds.viewChatGPTList).click()
    cy.wait('@getShoppingList')
    cy.getByData(HomePageTestIds.shoppingListItem).should('have.length', 3)
  })
})
