import {
  Urls,
  UserCredentials,
  GeneralTestIds,
  AuthPageTestIds,
  SearchPageTestIds,
  ProductPageTestIds
} from '../../../shared/dataTestIds'
describe('Search Page Tests', () => {
  before(() => {
    cy.login(Urls.baseUrl, UserCredentials.validEmail, UserCredentials.validPassword)
  })
  context('When there are no items in cart', () => {
    const searchTerm = 'sunglass'
    beforeEach(() => {
      cy.visit(Urls.homePageUrl)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/searchResults.json'
      })
      cy.getByData(GeneralTestIds.cartButton).click()
    })

    it('should render the cart page with no items', () => {
      cy.url().should('include', Urls.cartPageUrl)
      cy.getByData(AuthPageTestIds.cartEmptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(AuthPageTestIds.cartEmptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(AuthPageTestIds.cartEmptyImage).should('have.attr', 'src')
      cy.getByData(AuthPageTestIds.cartEmptyButton).should('contain.text', 'Shop')
    })
  })
  context('should render When there are Items in Cart', () => {
    const searchTerm = 'sunglass'
    beforeEach(() => {
      cy.visit(Urls.homePageUrl)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/searchResults.json'
      })
      cy.getByData(SearchPageTestIds.products).first().click()
      cy.url().should('include', Urls.productPageUrl)
      cy.getByData(ProductPageTestIds.addTocartButton).click()
      cy.intercept('POST', '/select', { fixture: 'cart/selectResult.json' }).as('selectCall')
      cy.getByData(GeneralTestIds.cartButton).click()
      cy.wait('@selectCall')
    })

    afterEach(() => {
      cy.clearAllLocalStorage()
    })

    it('should render and display cart page with result', () => {
      cy.getByData(AuthPageTestIds.cartListImage).should('have.attr', 'src')
      cy.getByData(AuthPageTestIds.cartListName).should('be.visible')
      cy.getByData(AuthPageTestIds.productPrice).should('be.visible')
      cy.url().should('include', Urls.cartPageUrl)
    })
    it('should render and display cart page Order Summary ', () => {
      cy.getByData(AuthPageTestIds.orderSummaryText).should('contain.text', 'Order Summary')
      cy.getByData(AuthPageTestIds.totalQuantityText).should('contain.text', 'Total Quantity')
      cy.getByData(AuthPageTestIds.totalAmountText).should('contain.text', 'Total Amount')
    })

    it('should render the cart page when counter is one and trash button is clicked', () => {
      cy.getByData(AuthPageTestIds.cartTrashButton).click()
      cy.url().should('include', Urls.cartPageUrl)
      cy.getByData(AuthPageTestIds.cartEmptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(AuthPageTestIds.cartEmptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(AuthPageTestIds.cartEmptyImage).should('have.attr', 'src')
      cy.getByData(AuthPageTestIds.cartEmptyButton).should('contain.text', 'Shop')
    })
    it('increments the counter and updates the total amount when the increment button is clicked', () => {
      cy.fixture('cart/selectResult.json').then(data => {
        const item = data.data[0].message.order.items[0]
        const initialQuantity = item.quantity.selected.count
        const itemPrice = parseFloat(item.price.value)

        const expectedQuantity = initialQuantity + 1
        const expectedTotalPrice = (itemPrice * expectedQuantity).toFixed(2)

        cy.performSelect({ fixture: 'cart/selectResult.json' }, AuthPageTestIds.cartIncrementButton)
        cy.getByData(AuthPageTestIds.cartInput)
          .invoke('val')
          .then(val => {
            expect(Number(val)).to.equal(expectedQuantity)
          })
        cy.getByData(AuthPageTestIds.productPrice).should('be.visible')
        cy.getByData(ProductPageTestIds.itemPrice).should('contain.text', `₹${expectedTotalPrice}`)
      })
    })

    it('decrements the counter and updates the total amount correctly', () => {
      cy.performSelect({ fixture: 'cart/selectResult.json' }, AuthPageTestIds.cartIncrementButton)
      cy.fixture('cart/selectResult.json').then(data => {
        const item = data.data[0].message.order.items[0]
        const initialQuantity = item.quantity.selected.count
        const itemPrice = parseFloat(item.price.value)
        const decrementedQuantity = initialQuantity
        const expectedDecrementedTotalPrice = (itemPrice * decrementedQuantity).toFixed(2)

        cy.getByData(AuthPageTestIds.cartDecrementButton).click()
        cy.getByData(AuthPageTestIds.cartInput)
          .invoke('val')
          .then(val => {
            expect(Number(val)).to.equal(decrementedQuantity)
          })
        cy.getByData(AuthPageTestIds.productPrice).should('be.visible')
        cy.getByData(ProductPageTestIds.itemPrice).should('contain.text', `₹${expectedDecrementedTotalPrice}`)
      })
    })

    it('Should conatin order Button and click on it render it on checkout page', () => {
      cy.getByData(AuthPageTestIds.cartOrderButton).should('contain.text', 'Order')
      cy.getByData(AuthPageTestIds.cartOrderButton).click()
    })
  })
})
