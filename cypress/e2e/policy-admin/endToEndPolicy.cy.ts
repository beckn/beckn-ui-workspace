import { testIds } from '../../../shared/dataTestIds'

describe('End to End Flow of Policy Admin', () => {
  context('Signin flow', () => {
    beforeEach(() => {
      cy.visit(testIds.deployed_policy_url_base)
    })
    it('should display the sign-in form with email and password fields', () => {
      cy.getByData('input-email').should('exist').and('be.visible')
      cy.getByData('input-password').should('exist').and('be.visible')
    })
    it('should disable the signin button when form is submitted with empty fields', () => {
      cy.getByData('login-button').should('be.disabled')
    })
    it('should enable the Sign In button when both fields are filled', () => {
      cy.getByData('input-email').type(testIds.user_validEmail)
      cy.getByData('input-password').type(testIds.user_validPassword)
      cy.getByData('login-button').should('not.be.disabled')
      cy.getByData('login-button').click()
    })
  })
  context('Should render Home Page and Its Component', () => {
    it('should Render Homepage Status Card and check should be visible or not', () => {
      cy.getByData('active').should('exist').and('be.visible')
      cy.getByData('Inactive').should('exist').and('be.visible')
      cy.getByData('Published').should('exist').and('be.visible')
    })
    it('should Render Homepage Status Card and check should all element', () => {
      cy.getByData('Active').should('contain.text', 'Active')
      cy.getByData('Inactive').should('contain.text', 'Inactive')
      cy.getByData('Published').should('contain.text', 'Published')
    })
    it('should Render all tabs on Homepage', () => {
      cy.getByData(`tablist_name${'All'}`).eq(0).should('contain.text', 'All')
      cy.getByData(`tablist_name${'Active'}`).eq(0).should('contain.text', 'Active')
      cy.getByData(`tablist_name${'Inactive'}`).eq(0).should('contain.text', 'Inactive')
      cy.getByData(`tablist_name${'Published'}`).eq(0).should('contain.text', 'Published')
    })
    it('should Render all Table Heading on Homepage', () => {
      cy.getByData(testIds.data_table_title).should('be.visible', 'Title')
      cy.getByData(testIds.data_table_description).should('be.visible', 'Description')
      cy.getByData(testIds.data_table_status).should('be.visible', 'Status')
      cy.getByData(testIds.data_table_startDate).should('be.visible', 'Start Date')
      cy.getByData(testIds.data_table_endDate).should('be.visible', 'End Date')
    })

    it('should Render all Table Item on Homepage', () => {
      cy.getByData(testIds.table_item_name).should('be.visible')
      cy.getByData(testIds.table_item_description).should('be.visible')
      cy.getByData(testIds.status_data).should('be.visible', 'Status')
      cy.getByData(testIds.table_item_startDate).should('be.visible')
      cy.getByData(testIds.table_item_endDate).should('be.visible')
    })
    it('Should render By default All tab ', () => {
      cy.getByData(`tablist_name${'All'}`).eq(0).click()
      cy.getByData(testIds.status_data).should('be.visible')
    })
    it('Should render Active tab ', () => {
      cy.getByData(`tablist_name${'Active'}`).eq(0).click()
      cy.getByData(testIds.status_data).should('be.visible')
      cy.getByData(testIds.status_data).eq(0).should('contain.text', 'active')
    })
    it('Should render Inactive tab ', () => {
      cy.getByData(`tablist_name${'Inactive'}`).eq(0).click()
      cy.getByData(testIds.status_data).should('be.visible')
      cy.getByData(testIds.status_data).eq(0).should('contain.text', 'inactive')
    })
    it('Should render Published tab ', () => {
      cy.getByData(`tablist_name${'Published'}`).eq(0).click()
      cy.getByData(testIds.status_data).should('be.visible')
      cy.getByData(testIds.status_data).eq(0).should('contain.text', 'published')
    })
    it('should work pagination', () => {
      cy.getByData(`tablist_name${'All'}`).eq(0).click()
      cy.getByData(' pagination-number').should('be.visible')
      cy.getByData(' pagination-number').eq(0).click()
    })
    it('should Render CreateNewPolicy page when click on Create New Button', () => {
      cy.getByData(testIds.create_new_policy).click()
    })
  })
  context('Should render create Policy page and its component', () => {
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
  })
  //Information Category is "Privacy"
  // context('Should create Policy', () => {
  //   it('should allow user to fill the form and submit with select privacy', () => {
  //     cy.getByData(testIds.policy_title_input).type('Sample Policy Title one')
  //     cy.getByData(testIds.policy_info_category_dropdown).click()
  //     cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
  //     cy.getByData('menu-list').should('be.visible').contains('Privacy').click()
  //     cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
  //     cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
  //     cy.getByData(testIds.country_dropdown).click()
  //     cy.getByData('menu-list').should('be.visible')
  //     cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
  //     cy.wait(5000)
  //     cy.getByData(testIds.city_dropdown).click()
  //     cy.get('[data-test="menu-list"]').should('be.visible')
  //     cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
  //     cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
  //     cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
  //     cy.getByData(testIds.policy_source_input).clear().type('https://www.google.com/')
  //     cy.getByData(testIds.policy_applicable_to_select).click()
  //     cy.getByData('policy-applicable-list')
  //       .should('be.visible')
  //       .first()
  //       .within(() => {
  //         cy.contains('label', 'BAP').click()
  //       })
  //     cy.getByData(testIds.policy_rules_code).should('not.be.empty')
  //     cy.getByData(testIds.save_policy).click()
  //     cy.getByData(testIds.feedback).should('contain.text', 'Policy saved successfully!')

  //   })
  //   // it('should allow user to fill the form and submit with select alcohol', () => {
  //   //     cy.getByData(testIds.policy_title_input).type('Sample Policy Title')
  //   //     cy.getByData(testIds.policy_info_category_dropdown).click()
  //   //     cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
  //   //     cy.getByData('menu-list').should('be.visible').contains('Alcohol').click()
  //   //     cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
  //   //     cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
  //   //     cy.getByData(testIds.country_dropdown).click()
  //   //     cy.getByData('menu-list').should('be.visible')
  //   //     cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
  //   //     cy.wait(5000)
  //   //     cy.getByData(testIds.city_dropdown).click()
  //   //     cy.get('[data-test="menu-list"]').should('be.visible')
  //   //     cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
  //   //     cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
  //   //     cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
  //   //     cy.getByData(testIds.policy_source_input).clear().type('https://www.google.com/')
  //   //     cy.getByData(testIds.policy_applicable_to_select).click()
  //   //     cy.getByData(testIds.save_policy).click()
  //   //     cy.getByData(testIds.feedback).should('contain.text', 'Policy saved successfully!')
  //   // })
  // })
  //Information Category is "Alcohol"
  // context('Should create Policy', () => {
  //   it('should allow user to fill the form and submit with select alcohol', () => {
  //     cy.getByData(testIds.policy_title_input).type('Sample Policy Title')
  //     cy.getByData(testIds.policy_info_category_dropdown).click()
  //     cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
  //     cy.getByData('menu-list').should('be.visible').contains('Alcohol').click()
  //     cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
  //     cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
  //     cy.getByData(testIds.country_dropdown).click()
  //     cy.getByData('menu-list').should('be.visible')
  //     cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
  //     cy.wait(5000)
  //     cy.getByData(testIds.city_dropdown).click()
  //     cy.get('[data-test="menu-list"]').should('be.visible')
  //     cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
  //     cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
  //     cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
  //     cy.getByData(testIds.policy_source_input).clear().type('https://www.google.com/')
  //     cy.getByData(testIds.policy_applicable_to_select).click()
  //     cy.getByData('policy-applicable-list')
  //       .should('be.visible')
  //       .first()
  //       .within(() => {
  //         cy.contains('label', 'BAP').click()
  //       })
  //     cy.getByData(testIds.policy_rules_code).should('not.be.empty')
  //     cy.getByData(testIds.save_policy).click()
  //     cy.getByData(testIds.feedback).should('contain.text', 'Policy saved successfully!')
  //   })
  // })
  //Information Category is "Geofence"
  context('Should create Policy', () => {
    // it('should allow user to fill the form and submit with geofence', () => {
    //   cy.getByData(testIds.policy_title_input).type('Sample Policy Title')
    //   cy.getByData(testIds.policy_info_category_dropdown).click()
    //   cy.getByData(testIds.policy_info_category_dropdown).should('be.visible')
    //   cy.getByData('menu-list').should('be.visible').contains('Geofence').click()
    //   cy.getByData(testIds.info_source_owner_input).type('Policy Owner Name')
    //   cy.getByData(testIds.policy_description_textArea).type('This is a sample policy description.')
    //   cy.getByData(testIds.country_dropdown).click()
    //   cy.getByData('menu-list').should('be.visible')
    //   cy.get('[data-test="menu-list"][data-index="0"]').should('be.visible').eq(1).click()
    //   cy.wait(500)
    //   cy.getByData(testIds.city_dropdown).click()
    //   cy.get('[data-test="menu-list"]').should('be.visible')
    //   cy.getByData('menu-list').should('be.visible').contains('Bangalore').click()
    //   cy.getByData(testIds.date_pick_from).find('input').clear().type('12-12-2025')
    //   cy.getByData(testIds.date_pick_to).find('input').clear().type('31-12-2025')
    //   cy.getByData(testIds.policy_source_input).type('https://www.google.com/')
    //   cy.getByData(testIds.policy_applicable_to_select).click()
    //   cy.getByData('policy-applicable-list')
    //     .should('be.visible')
    //     .first()
    //     .within(() => {
    //       cy.contains('label', 'BAP').click()
    //     })
    //   cy.getByData(testIds.geofence).should('be.visible')
    //   cy.getByData(testIds.geofence_icon).should('be.visible')
    //   cy.getByData(testIds.geofence_text).should('be.visible')
    //   cy.getByData(testIds.create_geofence).click()
    //   cy.getByData(testIds.draw_geofence_text).should('be.visible')
    //   cy.getByData(testIds.clear_geofence_text).should('be.visible')
    //   // const polygonPoints = [
    //   //   { lat: 13.21900280058148, lng: 77.70856870822249 },
    //   //   { lat: 13.191761880316314, lng: 77.69191755465803 },
    //   //   { lat: 13.20195669095579, lng: 77.73569120578108 }
    //   // ]
    //   const polygonPoints = [
    //     { lat: 12.954423066538682, lng: 77.52976174501953 },
    //     { lat: 12.94739668785578, lng: 77.70794625429687 },
    //     { lat: 12.853692748106544, lng: 77.6052927508789 }
    //   ]
    //   cy.intercept(
    //     'POST',
    //     'https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetViewportInfo',
    //     {
    //       statusCode: 200,
    //       body: {
    //         viewport: {
    //           // Mock any relevant data your application uses
    //           northeast: {
    //             lat: 13.1,
    //             lng: 78.0
    //           },
    //           southwest: {
    //             lat: 12.8,
    //             lng: 77.0
    //           }
    //         }
    //       }
    //     }
    //   ).as('getViewportInfo')

    //   cy.wait(500)
    //   cy.get('.gm-style', { timeout: 10000 })
    //     .should('be.visible')
    //     .then(mapElement => {
    //       cy.window().then(win => {
    //         const htmlMapElement = mapElement[0] as HTMLElement
    //         // const map = new win.google.maps.Map(htmlMapElement, {
    //         //   center: { lat: 13.21900280058148, lng: 77.70856870822249 },
    //         //   zoom: 12
    //         // })
    //         const map = new win.google.maps.Map(htmlMapElement, {
    //           center: { lat: 12.954423066538682, lng: 77.52976174501953 },
    //           zoom: 12
    //         })
    //         // Create a polygon and add it to the map
    //         const geofencePolygon = new win.google.maps.Polygon({
    //           paths: polygonPoints,
    //           strokeColor: '#01326A',
    //           strokeOpacity: 0.8,
    //           strokeWeight: 2,
    //           fillColor: '#01326A',
    //           fillOpacity: 0.35
    //         })
    //         geofencePolygon.setMap(map)
    //       })
    //     })

    //   const coordinatesForForm: any = polygonPoints.map(point => `${point.lat}, ${point.lng}`)
    //   cy.wait(3000)
    //   cy.updatePolygon(coordinatesForForm)
    //   cy.getByData(testIds.cancel_geofence_btn).should('be.visible')
    //   cy.getByData(testIds.save_geofence_btn).should('be.visible')
    //   cy.wait(5000)
    //   cy.getByData(testIds.save_geofence_btn).click()
    //   cy.updatePolygon(coordinatesForForm)
    //   cy.getByData(testIds.policy_rules_code).should('not.be.empty')
    //   cy.wait(3000)
    //   cy.getByData(testIds.save_policy).click()
    // })
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
  // context('Should change status of Policy', () => {
  //   it('should allow user to fill the form and submit with geofence', () => {
  //     cy.visit(testIds.deployed_policy_url_base)
  //     cy.getByData(testIds.table_item_name).should('be.visible').eq(0).click()
  //   })
  // })
})
