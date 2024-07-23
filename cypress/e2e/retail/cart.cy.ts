import { testIds } from '../../../shared/dataTestIds'
describe('Search Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })
  context('When there are no items in cart', () => {
    const searchTerm = 'sunglass'
    beforeEach(() => {
      cy.visit(testIds.url_home)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/searchResults.json'
      })
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
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Shop')
    })
  })
  context('should render When there are Items in Cart', () => {
    const searchTerm = 'sunglass'
    beforeEach(() => {
      cy.visit(testIds.url_home)
      cy.setGeolocation('getAddress')
      cy.wait('@getAddress')
      cy.performSearch(searchTerm, {
        fixture: 'searchPage/searchResults.json'
      })
      cy.getByData(testIds.searchpage_products).first().click()
      cy.url().should('include', testIds.url_product)
      cy.getByData(testIds.productpage_addTocartButton).click()
      cy.intercept('POST', '/select', { fixture: 'cart/selectResult.json' }).as('selectCall')
      cy.getByData(testIds.cartButton).click()
      cy.wait('@selectCall')
    })

    afterEach(() => {
      cy.clearAllLocalStorage()
    })

    it('should render and display cart page with result', () => {
      cy.getByData(testIds.cartpage_itemImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_itemName).should('be.visible')
      cy.getByData(testIds.cartpage_productPrice).should('be.visible')
      cy.url().should('include', testIds.url_cart)
    })
    it('should render and display cart page Order Summary ', () => {
      cy.getByData(testIds.cartpage_orderSummaryText).should('contain.text', 'Order Summary')
      cy.getByData(testIds.cartpage_totalQuantityText).should('contain.text', 'Total Quantity')
      cy.getByData(testIds.cartpage_totalAmountText).should('contain.text', 'Total Amount')
    })

    it('should render the cart page when counter is one and trash button is clicked', () => {
      cy.getByData(testIds.cartpage_trashButton).click()
      cy.url().should('include', testIds.url_cart)
      cy.getByData(testIds.cartpage_emptyheading).should('contain.text', 'The Cart is Empty')
      cy.getByData(testIds.cartpage_emptySubHeading).should(
        'contain.text',
        'Looks like you haven’t made your choice yet'
      )
      cy.getByData(testIds.cartpage_emptyImage).should('have.attr', 'src')
      cy.getByData(testIds.cartpage_emptyButton).should('contain.text', 'Shop')
    })
    it('increments the counter and updates the total amount when the increment button is clicked', () => {
      cy.fixture('cart/selectResult.json').then(data => {
        const item = data.data[0].message.order.items[0]
        const initialQuantity = item.quantity.selected.count
        const itemPrice = parseFloat(item.price.value)

        const expectedQuantity = initialQuantity + 1
        const expectedTotalPrice = (itemPrice * expectedQuantity).toFixed(2)

        cy.performSelect({ fixture: 'cart/selectResult.json' }, testIds.cartpage_incrementButton)
        cy.getByData(testIds.cartpage_input)
          .invoke('val')
          .then(val => {
            expect(Number(val)).to.equal(expectedQuantity)
          })
        cy.getByData(testIds.cartpage_productPrice).should('be.visible')
        cy.getByData(testIds.item_price).should('contain.text', `₹${expectedTotalPrice}`)
      })
    })

    it('decrements the counter and updates the total amount correctly', () => {
      cy.performSelect({ fixture: 'cart/selectResult.json' }, testIds.cartpage_incrementButton)
      cy.fixture('cart/selectResult.json').then(data => {
        const item = data.data[0].message.order.items[0]
        const initialQuantity = item.quantity.selected.count
        const itemPrice = parseFloat(item.price.value)
        const decrementedQuantity = initialQuantity
        const expectedDecrementedTotalPrice = (itemPrice * decrementedQuantity).toFixed(2)

        cy.getByData(testIds.cartpage_decrementButton).click()
        cy.getByData(testIds.cartpage_input)
          .invoke('val')
          .then(val => {
            expect(Number(val)).to.equal(decrementedQuantity)
          })
        cy.getByData(testIds.cartpage_productPrice).should('be.visible')
        cy.getByData(testIds.item_price).should('contain.text', `₹${expectedDecrementedTotalPrice}`)
      })
    })

    it('Should conatin order Button and click on it render it on checkout page', () => {
      cy.getByData(testIds.cartpage_cartOrderButton).should('contain.text', 'Order')
      cy.getByData(testIds.cartpage_cartOrderButton).click()
    })
  })
})
