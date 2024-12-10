import { testIds } from '../../../shared/dataTestIds'

describe('Search Page Tests', () => {
  before(() => {
    cy.visit(`${testIds.url_base}${testIds.url_home}`)
    cy.setGeolocation('getAddress', { latitude: 18.6087413, longitude: 73.75189209999999 }, 'mobility-bap/address.json')
    cy.wait('@getAddress')
    cy.getByData(testIds.mobility_dropoff_address).click()
    cy.getByData(testIds.loaction_list).type('Maharashtra Cricket Association Stadium')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })

  context('When there are no search results', () => {
    before(() => {
      cy.performSearchWithoutSearchTerm({}, 'searchResultsWithoutSearchTerm')
      cy.performCheckViolation(
        {
          policyCheckResult: [
            {
              location: '18.6744633,73.7065161',
              violation: false,
              violatedPolicies: [
                {
                  id: '6b298',
                  name: 'Quarantine Policy'
                }
              ]
            }
          ]
        },
        'checkViolation'
      )
      cy.getByData(testIds.mobility_search_btn).click()
      cy.wait('@searchResultsWithoutSearchTerm')
    })

    it('should re-render the pickup-dropoff page', () => {
      cy.getByData(testIds.mobility_pickup_dropoff).should('be.visible')
    })
    it('should render the toast when no result found', () => {
      cy.getByData(testIds.feedback).should('contain.text', 'No ride available, please try again!')
    })
  })

  context('When there are search results', () => {
    before(() => {
      cy.performSearchWithoutSearchTerm(
        {
          fixture: 'mobility-bap/searchResults.json'
        },
        'searchResultsWithoutSearchTerm'
      )
      cy.performCheckViolation(
        {
          policyCheckResult: [
            {
              location: '18.6744633,73.7065161',
              violation: false,
              violatedPolicies: [
                {
                  id: '6b298',
                  name: 'Quarantine Policy'
                }
              ]
            }
          ]
        },
        'checkViolation'
      )
      cy.getByData(testIds.mobility_search_btn).click()
      cy.wait('@searchResultsWithoutSearchTerm')
    })

    it('should render the available provider rides category page', () => {
      cy.getByData(testIds.mobility_searchpage_container).should('be.visible')
    })

    it('should render the count of result found', () => {
      cy.getByData(testIds.mobility_total_cabs).should('contain.text', 'results found')
    })

    it('should render the provider wise catalogue', () => {
      cy.getByData(testIds.mobility_catalog_container).should('be.visible')
      cy.getByData(testIds.mobility_catalog_container).within(() => {
        cy.getByData(testIds.mobility_catalog_item).eq(0).should('be.visible')
        cy.getByData(testIds.mobility_catalog_item)
          .eq(0)
          .within(() => {
            cy.getByData(testIds.mobility_provider_details).should('be.visible')
            cy.getByData(testIds.mobility_provider_details)
              .eq(0)
              .within(() => {
                cy.getByData(testIds.mobility_provider_name).should('contain.text', 'XYZ Cab Services')
                cy.getByData(testIds.mobility_provider_rating).should('contain.text', '4.3')
              })

            cy.getByData(testIds.mobility_provider_item).should('be.visible')
            cy.getByData(testIds.mobility_provider_item)
              .eq(0)
              .within(() => {
                cy.getByData(testIds.mobility_provider_item_name).should('contain.text', 'XYZ Mini')
                cy.getByData(testIds.mobility_provider_item_fare).should('contain.text', '122.26')
              })
          })
      })
    })

    it('should able to select the catalogue item', () => {
      cy.getByData(testIds.mobility_catalog_container).within(() => {
        cy.getByData(testIds.mobility_catalog_item)
          .eq(0)
          .within(() => {
            cy.getByData(testIds.mobility_provider_item)
              .eq(0)
              .within(() => {
                cy.getByData(testIds.mobility_provider_item_name).should('contain.text', 'XYZ Mini')
                cy.getByData(testIds.mobility_provider_item_fare).should('contain.text', '122.26')
                cy.getByData(testIds.mobility_provider_item_select_button).should('contain.text', 'Select')
                cy.getByData(testIds.mobility_provider_item_select_button).should('not.be.disabled')
              })
          })
      })
    })

    it('should navigate to search ride details form onclick of select button', () => {
      cy.performSelect(
        {
          fixture: 'mobility-bap/selectResponse'
        },
        'selectRide'
      )
      cy.getByData(testIds.mobility_catalog_container).within(() => {
        cy.getByData(testIds.mobility_catalog_item)
          .eq(0)
          .within(() => {
            cy.getByData(testIds.mobility_provider_item)
              .eq(0)
              .within(() => {
                cy.getByData(testIds.mobility_provider_item_select_button).should('not.be.disabled')
                cy.getByData(testIds.mobility_provider_item_select_button).click()
                cy.wait('@selectRide')
              })
          })
      })
      cy.getByData(testIds.mobility_search_ride_details_form).should('be.visible')
    })
  })
})
