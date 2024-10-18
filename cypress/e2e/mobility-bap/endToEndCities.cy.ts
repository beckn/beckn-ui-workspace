import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  before(() => {})
  it('should open driver app', () => {
    cy.visit('https://driverapp-dev.becknprotocol.io/')
    //cy.go('back');
  })
  // Valid login scenarios
  it('should Login in into driver app', () => {
    cy.getByData(testIds.auth_inputEmail).clear().type('suresh@xyzcab.com')
    cy.getByData(testIds.auth_inputPassword).clear().type('Abcd@1234')
    cy.getByData(testIds.auth_loginButton).should('not.be.disabled').click()
    cy.wait(100)
  })
  it('should check and validate toggle', () => {
    cy.getByData(testIds.taxi_BPP_offlineMode_image).should('be.visible')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_offlineMode_offlineTitle).should('be.visible')
    cy.getByData(testIds.taxi_BPP_offlineMode_offlineDescription).should('be.visible')
    cy.getByData(testIds.taxi_BPP_switch_toggle_button).click()
  })
  //make sure browser set location is on
  it('should set driver location', () => {
    cy.getByData(testIds.location).should('be.visible')
    cy.getByData(testIds.downArrow).click()
    cy.wait(1000)
    cy.get('body').type(' conrad hotel, bengaluru')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })
  //-------------------------------
  it('should visit to BAP', () => {
    cy.visit(testIds.deployed_mob_url_base)
  })
  it('should render homepage with google map', () => {
    cy.getByData(testIds.mobility_map_container).should('be.visible')
    cy.getByData(testIds.mobility_map).should('be.visible')
  })
  it('should render the pickup-dropoff modal', () => {
    cy.getByData(testIds.mobility_pickup_dropoff).should('be.visible')
    cy.getByData(testIds.mobility_pickup_dropoff).should('contain.text', 'Where Would You Like To Go?')
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
  })
  it('should contain empty pickup and dropoff address on load', () => {
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_pickup_address).should('contain.text', '')
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).should('contain.text', '')
  })
  it('The search button should render as disabled on initial load', () => {
    cy.getByData(testIds.mobility_search_btn).should('be.disabled')
  })
  it('should enter pickup address', () => {
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_pickup_address).type('conrad hotel, bengaluru')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })

  it('should enter dropoff address', () => {
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).type('kempegowda international airport, karnataka')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })
  it('search button should be enabled when both drop-off and pickup addresses are set', () => {
    cy.getByData(testIds.mobility_search_btn).should('not.be.disabled')
  })
  it('should search for ride when both drop-off and pickup location are filled', () => {
    cy.getByData(testIds.mobility_search_btn).click()
    cy.getByData(testIds.mobility_cancel_search).should('be.visible')
    cy.getByData(testIds.mobility_cancel_search).should('contain.text', 'Cancel Search')
    cy.wait(17000)
  })
  // For empty results
  // it('should re-render the pickup-dropoff page', () => {
  //     cy.getByData(testIds.mobility_pickup_dropoff).should('be.visible')
  // })
  // it('should render the toast when no result found', () => {
  //     cy.getByData(testIds.feedback).should('contain.text', 'No ride available, please try again!')
  // })
  // it('should render the available provider rides category page', () => {
  //     cy.getByData(testIds.mobility_searchpage_container).should('be.visible')
  // })

  // it('should render the count of result found', () => {
  //     cy.getByData(testIds.mobility_total_cabs).should('contain.text', 'results found')
  // })
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
              cy.getByData(testIds.mobility_provider_name).should('be.visible')
              cy.getByData(testIds.mobility_provider_rating).should('contain.text', '4.3')
            })

          cy.getByData(testIds.mobility_provider_item).should('be.visible')
          cy.getByData(testIds.mobility_provider_item)
            .eq(0)
            .within(() => {
              cy.getByData(testIds.mobility_provider_item_name).should('be.visible')
              cy.getByData(testIds.mobility_provider_item_fare).should('contain.text', '₹371.97')
            })
        })
    })
  })
  it('should render the search ride form page', () => {
    cy.getByData(testIds.mobility_provider_item_select_button).first().click()
    cy.getByData(testIds.mobility_search_ride_details_form).should('be.visible')
  })

  it('should render the cab details like name and fare', () => {
    cy.getByData(testIds.mobility_ride_name).should('be.visible')
    cy.getByData(testIds.mobility_ride_fare).should('be.visible')
  })

  it('should render the ride details like pickup dropoff address', () => {
    cy.getByData(testIds.mobility_pickup_label).should('contain.text', 'Pickup')
    cy.getByData(testIds.mobility_pickup_address).should(
      'contain.text',
      'Conrad Bengaluru, Kensington Road, Halasuru, Someshwarpura, Bengaluru, Karnataka, India'
    )
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).should(
      'contain.text',
      'Kempegowda International Airport (BLR), Karnataka, India'
    )
  })
  it('should render the rider details like name and phone number', () => {
    cy.getByData(testIds.mobility_rider_name).should('be.empty', '')
    cy.getByData(testIds.mobility_rider_mobileNo).should('be.empty', '')
  })

  it('confirm button text shoudl be `Confirm & Proceed`', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).should('have.text', 'Confirm & Proceed')
  })

  it('Confirm & proceed button should be disbaled if name and phone number is empty', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).should('be.disabled')
  })

  it('should able to type name value', () => {
    cy.getByData(testIds.mobility_rider_name).type('name of user')
  })

  it('should able to type mobile number value', () => {
    cy.getByData(testIds.mobility_rider_mobileNo).type('9090878888')
  })

  it('Confirm & proceed button should be not be disbaled if name and phone number is not empty', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).should('not.be.disabled')
  })

  it('when click on Confirm & proceed button should navigate to payment page', () => {
    cy.getByData(testIds.mobility_rider_confirm_button).click()
    cy.getByData(testIds.pageName).should('have.text', 'Select Payment Method')
  })
  it('should render the Payment page', () => {
    cy.url().should('include', '/paymentMode')
    cy.getByData(testIds.paymentpage_visa).should('be.visible')
    cy.getByData(testIds.paymentpage_masterCard).should('be.visible')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('be.visible')
  })
  it('should render the Payment page and Check all element should be contain text', () => {
    cy.url().should('include', '/paymentMode')
    cy.getByData(testIds.paymentpage_visa).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_masterCard).should('contain.text', '**** **** **** 1234')
    cy.getByData(testIds.paymentpage_CashOnDelivery).should('contain.text', 'Cash')
  })
  it('should disable the confirm button when no radio button is selected', () => {
    cy.getByData(testIds.paymentpage_radioButton).should('not.be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).contains('Continue').should('be.disabled')
  })
  it('should Click on Confirm Button', () => {
    cy.getByData(testIds.paymentpage_radioButton).eq(2).check().should('be.checked')
    cy.getByData(testIds.paymentpage_confirmButton).click()
    cy.wait(3000)
  })
  //Again login to Driver app and accept the ride
  it('should open driver app', () => {
    cy.visit('https://driverapp-staging.becknprotocol.io/')
  })
  // //New Ride Request
  // it('should check "New Ride Request" popup component', () => {
  //   cy.getByData(testIds.taxi_BPP_pickup_location_text).should('be.visible')
  //   cy.getByData(testIds.taxi_BPP_drop_location_text).should('be.visible')
  //   cy.getByData(testIds.taxi_BPP_km_away_text).should('be.visible')
  //   cy.getByData(testIds.taxi_BPP_km_distance_text).should('be.visible')
  // })
  // it('should accept the ride', () => {
  //   cy.getByData(testIds.taxi_BPP_accept_button).should('be.visible')
  //   cy.getByData(testIds.taxi_BPP_decline_button).should('be.visible')
  //   cy.getByData(testIds.taxi_BPP_accept_button).click()
  // })
})
