import { testIds } from '../../../shared/dataTestIds'

describe('Assembly Details Page Tests', () => {
  const searchTerm = 'assembly'

  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.performSearch(searchTerm, {
      fixture: 'INDUSTRY4.0/searchPage/searchResults.json'
    })
    cy.getByData(testIds.search_page_product_OnClick).first().click()
    cy.url().should('include', testIds.url_product)
    cy.getByData(testIds.product_page_book_button).click()
    cy.performSelect({ fixture: 'INDUSTRY4.0/select/selectResult.json' }, 'selectResponse')
  })

  it('should render the assembly details form with the correct title', () => {
    cy.get('h1').should('contain', 'Add Assembly Details')
  })

  it('should allow the user to select Type, Colour, and Shape', () => {
    cy.get(testIds.typeLabel).should('be.visible')
    cy.get(testIds.type).select('Plastic Box')
    cy.get(testIds.type).should('have.value', 'Plastic Box')
    cy.get(testIds.colorLabel).should('be.visible')
    cy.get(testIds.colour).select('Blue')
    cy.get(testIds.colour).should('have.value', 'Blue')
    cy.get(testIds.shapeLabel).should('be.visible')
    cy.get(testIds.shape).select('Circle')
    cy.get(testIds.shape).should('have.value', 'Circle')
  })

  it('should allow the user to increase and decrease quantity', () => {
    cy.get(testIds.increaseQuantity).click()
    cy.get(testIds.quantity).should('have.value', '2')
    cy.get(testIds.decreaseQuantity).click()
    cy.get(testIds.quantity).should('have.value', '1')
  })

  it('should allow the user to submit the form', () => {
    cy.get(testIds.length).type('10')
    cy.get(testIds.width).type('100')
    cy.get(testIds.weight).type('10')
    cy.get(testIds.increaseQuantity).click()
    cy.get(testIds.quantity).should('have.value', '2')
    cy.get('button[type="submit"]').click()
    cy.performXinput_Submit({ fixture: 'INDUSTRY4.0/x-input/x-inputResult.json' }, 'xinputResponse')
    cy.url().should('include', testIds.url_checkoutPage)
  })
})
