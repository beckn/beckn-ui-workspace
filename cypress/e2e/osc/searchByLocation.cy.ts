import { testIds } from '../../../shared/dataTestIds'

describe('SearchByLocation Page Tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
  })

  beforeEach(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress')
    cy.wait('@getAddress')
    cy.getByData(testIds.search_By_Location_Text).click()
  })

  it('Should render Search By Location Page with all Component', () => {
    cy.url().should('include', `${testIds.url_search_StoreBy_Location}`)
    cy.getByData(testIds.map_search_input_container).should('be.visible')
    cy.getByData(testIds.map_search_input).should('be.visible')
    cy.getByData(testIds.map_container).should('be.visible')
    cy.getByData(testIds.option_card).should('be.visible')
  })

  it('Should Click option card and type Paris in Input to get store', () => {
    cy.intercept('GET', '**/reverse?format=jsonv2&lat=**&lon=**', {
      fixture: 'OSC/searchByLocation/coordsLocation.json'
    }).as('fetchLocationByCoords')

    cy.intercept('GET', '**/stores?tagName=becknified&tagValue=true&latitude=**&longitude=**&filter=bakery', {
      fixture: 'OSC/searchByLocation/storesByLocation.json'
    }).as('fetchStoresByLocation')

    cy.getByData(testIds.option_card).contains('Restaurant').click()
    cy.getByData(testIds.map_search_input).type('Paris')

    cy.wait('@fetchStoresByLocation')

    cy.getByData(testIds.locationList).should('be.visible')
    cy.getByData(testIds.location_List_item).eq(1).click()
    cy.get('img[alt="Marker"]').first().click()
    cy.getByData(testIds.searchBy_Location_shop_button).click()
    cy.url().should('include', `${testIds.url_search}`)
  })
})
