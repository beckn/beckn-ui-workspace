import { testIds } from '../../../shared/dataTestIds'

describe('create new policy tests', () => {
  before(() => {
    cy.login(testIds.url_base, testIds.user_validEmail, testIds.user_validPassword)
    cy.getByData(testIds.create_new_policy).click()
    cy.url().should('include', '/createPolicy')
  })

  it('should render the homepage components', () => {
    cy.getByData(testIds.add_info_metadata).should('be.visible')
    cy.getByData(testIds.switch_btn).should('be.visible')
    cy.getByData(testIds.switch_btn_text).should('be.visible')
    cy.getByData(testIds.policy_title).should('be.visible')
    cy.getByData(testIds.policy_title_input).should('be.visible')
    cy.getByData(testIds.policy_info_category).should('be.visible')
    cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
    cy.getByData(testIds.info_source_owner).should('be.visible')
    cy.getByData(testIds.info_source_owner_input).should('be.visible')
    cy.getByData(testIds.policy_description).should('be.visible')
    cy.getByData(testIds.policy_description_textArea).should('be.visible')
    cy.getByData(testIds.country).scrollIntoView().should('be.visible')
    cy.getByData(testIds.country_dropdown).should('be.visible')
    cy.getByData(testIds.city).scrollIntoView().should('be.visible')
    cy.getByData(testIds.city_dropdown).should('be.visible')
    cy.getByData(testIds.policy_from_date).should('be.visible')
    cy.getByData(testIds.date_pick_from).find('input').should('be.visible')
    cy.getByData(testIds.policy_to_date).should('be.visible')
    cy.getByData(testIds.date_pick_to).find('input').should('be.visible')
    cy.getByData(testIds.policy_source).should('be.visible')
    cy.getByData(testIds.policy_source_input).should('be.visible')
    cy.getByData(testIds.policy_applicable_to).should('be.visible')
    cy.getByData(testIds.policy_rules).should('be.visible')
    cy.getByData(testIds.policy_rules_code).should('be.visible')
    cy.getByData(testIds.go_back_home).scrollIntoView().should('be.visible')
    cy.getByData(testIds.save_policy).should('be.visible')
  })

  it('should display validation errors for empty required fields on submit', () => {
    cy.getByData(testIds.save_policy).click()
    cy.getByData(testIds.title_error).should('contain', 'Title is required')
    cy.getByData(testIds.policy_info_category_error).should('contain', 'Information category is required')
    cy.getByData(testIds.info_source_owner_input_error).should('contain', 'Owner name is required')
    cy.getByData(testIds.policy_description_textArea_error).should('contain', 'Description is required')
    cy.getByData(testIds.city_error).should('contain', 'City is required')
    cy.getByData(testIds.policy_source_error).should('contain', 'Source url is required')
    cy.getByData(testIds.policy_applicable_to_error).should('contain', 'Applicable To is required')
  })
  it('should display validation errors with invalid value', () => {
    cy.getByData(testIds.policy_title_input).clear().type('policy')

    cy.getByData(testIds.info_source_owner_input).clear()
    cy.getByData(testIds.policy_description_textArea).clear().type('policy')
    cy.getByData(testIds.date_pick_from).find('input').clear()
    cy.getByData(testIds.date_pick_to).find('input').clear()
    cy.getByData(testIds.policy_source_input).clear().type('policy')
    cy.getByData(testIds.save_policy).click()
    cy.getByData(testIds.title_error).should('contain', 'The title must be between 10 and 100 characters long.')
    cy.getByData(testIds.policy_from_date_error).should('contain', 'Start date is required')
    cy.getByData(testIds.policy_to_date_error).should('contain', 'End date is required')
    cy.getByData(testIds.info_source_owner_input_error).should('contain', 'Owner name is required')
    cy.getByData(testIds.policy_description_textArea_error).should(
      'contain',
      'The description must be between 20 and 500 characters long.'
    )
    cy.getByData(testIds.policy_source_error).should(
      'contain',
      "Please enter a valid URL, starting with 'http://' or 'https://'."
    )
  })

  it('should allow user to fill the form and submit with select privacy', () => {
    cy.getByData(testIds.policy_title_input).type('Sample Policy Title')
    cy.getByData(testIds.policy_info_category_dropdown).click()
    cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
    cy.getByData('menu-list').should('be.visible').contains('Privacy').click()
    cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
    cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
    cy.getByData(testIds.country_dropdown).click()
    cy.getByData('menu-list').should('be.visible')
    cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
    cy.wait(5000)
    cy.getByData(testIds.city_dropdown).click()
    cy.get('[data-test="menu-list"]').should('be.visible')
    cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
    cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
    cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
    cy.getByData(testIds.policy_source_input).clear().type('https://www.google.com/')
    cy.getByData(testIds.policy_applicable_to_select).click()
    cy.getByData('policy-applicable-list')
      .should('be.visible')
      .first()
      .within(() => {
        cy.contains('label', 'BAP').click()
      })
    cy.getByData(testIds.policy_rules_code).should('not.be.empty')
  })
  it('should allow user to fill the form and submit with select alcohol', () => {
    cy.getByData(testIds.policy_title_input).type('Sample Policy Title')
    cy.getByData(testIds.policy_info_category_dropdown).click()
    cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
    cy.getByData('menu-list').should('be.visible').contains('Alcohol').click()
    cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
    cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
    cy.getByData(testIds.country_dropdown).click()
    cy.getByData('menu-list').should('be.visible')
    cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
    cy.wait(5000)
    cy.getByData(testIds.city_dropdown).click()
    cy.get('[data-test="menu-list"]').should('be.visible')
    cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
    cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
    cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
    cy.getByData(testIds.policy_source_input).clear().type('https://www.google.com/')
    cy.getByData(testIds.policy_applicable_to_select).click()
    cy.getByData('policy-applicable-list')
      .should('be.visible')
      .first()
      .within(() => {
        cy.contains('label', 'BAP').click()
      })
  })

  it('should allow user to fill the form and submit with geofence', () => {
    cy.getByData(testIds.policy_title_input).type('Sample Policy Title')
    cy.getByData(testIds.policy_info_category_dropdown).click()
    cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
    cy.getByData('menu-list').should('be.visible').contains('Geofence').click()
    cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
    cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
    cy.getByData(testIds.country_dropdown).click()
    cy.getByData('menu-list').should('be.visible')
    cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
    cy.wait(500)
    cy.getByData(testIds.city_dropdown).click()
    cy.get('[data-test="menu-list"]').should('be.visible')
    cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
    cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
    cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
    cy.getByData(testIds.policy_source_input).type('https://www.google.com/')
    cy.getByData(testIds.policy_applicable_to_select).click()
    cy.getByData('policy-applicable-list')
      .should('be.visible')
      .first()
      .within(() => {
        cy.contains('label', 'BAP').click()
      })
    cy.getByData(testIds.geofence).should('be.visible')
    cy.getByData(testIds.geofence_icon).should('be.visible')
    cy.getByData(testIds.geofence_text).should('be.visible')
    cy.getByData(testIds.create_geofence).click()
    cy.url().should('include', '/createGeofence')

    cy.getByData(testIds.draw_geofence_text).should('be.visible')
    cy.getByData(testIds.clear_geofence_text).should('be.visible')

    const polygonPoints = [
      { lat: 12.954423066538682, lng: 77.52976174501953 },
      { lat: 12.94739668785578, lng: 77.70794625429687 },
      { lat: 12.853692748106544, lng: 77.6052927508789 }
    ]

    // Intercept the Google Maps API call and mock the response
    cy.intercept(
      'POST',
      'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo',
      {
        statusCode: 200,
        body: {
          viewport: {
            // Mock any relevant data your application uses
            northeast: {
              lat: 13.1,
              lng: 78.0
            },
            southwest: {
              lat: 12.8,
              lng: 77.0
            }
          }
        }
      }
    ).as('getViewportInfo')

    cy.wait(500)
    cy.get('.gm-style', { timeout: 10000 })
      .should('be.visible')
      .then(mapElement => {
        cy.window().then(win => {
          const htmlMapElement = mapElement[0] as HTMLElement

          const map = new win.google.maps.Map(htmlMapElement, {
            center: { lat: 12.954423066538682, lng: 77.52976174501953 },
            zoom: 12
          })

          // Create a polygon and add it to the map
          const geofencePolygon = new win.google.maps.Polygon({
            paths: polygonPoints,
            strokeColor: '#01326A',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#01326A',
            fillOpacity: 0.35
          })
          geofencePolygon.setMap(map)
        })
      })
    const coordinatesForForm: any = polygonPoints.map(point => `${point.lat}, ${point.lng}`)

    cy.updatePolygon(coordinatesForForm)
    cy.getByData(testIds.cancel_geofence_btn).should('be.visible')
    cy.getByData(testIds.save_geofence_btn).should('be.visible')
    cy.wait(5000)
    cy.getByData(testIds.save_geofence_btn).click()

    cy.updatePolygon(coordinatesForForm)
    cy.getByData(testIds.policy_rules_code).should('not.be.empty')
    cy.getByData(testIds.save_policy).click()
    cy.url().should('include', '/')
  })
})
