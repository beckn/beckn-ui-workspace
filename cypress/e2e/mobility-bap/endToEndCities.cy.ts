import { testIds } from '../../../shared/dataTestIds'

describe('Home Page Tests', () => {
  it('should open driver app', () => {
    cy.visit('https://driverapp-dev.becknprotocol.io/')
    //cy.go('back');
  })
  // Valid login scenarios
  it('should Login in into driver app', () => {
    cy.getByData(testIds.auth_inputEmail).clear().type('ramesh@xyzcab.com')
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
    cy.getByData(testIds.mobility_rider_name).type('Omkar')
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
    cy.visit('https://driverapp-dev.becknprotocol.io/')
  })
  it('should set driver location', () => {
    cy.getByData(testIds.location).should('be.visible')
    cy.getByData(testIds.downArrow).click()
    cy.wait(1000)
    cy.get('body').type(' conrad hotel, bengaluru')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })
  //New Ride Request
  it('sends a POST request to /confirm endpoint', () => {
    cy.request({
      method: 'POST',
      url: 'https://bap-gcl-dev.becknprotocol.io/confirm',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        Referer: 'https://mobility-dev.becknprotocol.io/',
        'content-type': 'application/json',
        Origin: 'https://mobility-dev.becknprotocol.io',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'no-cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=0',
        TE: 'trailers',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache'
      },
      body: {
        data: [
          {
            context: {
              domain: 'mobility:1.1.0',
              action: 'confirm',
              version: '1.1.0',
              bpp_id: 'bpp-ps-network-strapi-dev.becknprotocol.io',
              bpp_uri: 'http://bpp-ps-network-strapi-dev.becknprotocol.io',
              country: 'IND',
              city: 'std:080',
              location: {
                country: { name: 'India', code: 'IND' },
                city: { name: 'Bangalore', code: 'std:080' }
              },
              bap_id: 'bap-ps-network-dev.becknprotocol.io',
              bap_uri: 'https://bap-ps-network-dev.becknprotocol.io',
              transaction_id: '78aa6a3a-5732-4521-8eba-981111c76738',
              message_id: '29ead644-2aec-4220-aa0b-077102daa97f',
              ttl: 'PT10M',
              timestamp: '2024-11-05T10:45:26.818Z'
            },
            message: {
              orders: [
                {
                  items: [
                    {
                      id: '86',
                      name: 'XYZ Mini',
                      short_desc:
                        'XYZ Mini Cab Service: Your pocket-sized ride to convenience, reliability, and comfort.',
                      long_desc:
                        'Experience the essence of urban travel with XYZ Mini Cab Service, featuring a fleet of reliable Indian-made mini cars perfect for city commutes. From the nimble Maruti Suzuki Alto to the fuel-efficient Tata Tiago, our lineup includes the practical Mahindra KUV100 and the stylish Hyundai Santro. Enjoy hassle-free rides, prompt pickups, and comfortable journeys tailored to your convenience, ensuring every trip is a smooth and delightful experience.',
                      price: { value: '14' },
                      rating: 'null',
                      rateable: true,
                      quantity: {
                        available: { measure: { value: '0', unit: 'kWh' } }
                      },
                      fulfillments: [
                        { id: '18', type: 'Mini On-Location Cab Pickup', rating: '4.0' },
                        { id: '19', type: 'Mini On-Location Cab Pickup', rating: '4.5' },
                        { id: '18', type: 'Mini On-Location Cab Pickup', rating: '4.0' },
                        { id: '19', type: 'Mini On-Location Cab Pickup', rating: '4.5' }
                      ]
                    }
                  ],
                  provider: { id: '629' },
                  fulfillments: [
                    {
                      type: 'start',
                      stops: [
                        { type: 'start', location: { gps: '12.9752736, 77.6205002' } },
                        { type: 'end', location: { gps: '13.198909, 77.7068926' } }
                      ]
                    },
                    {
                      id: '18',
                      type: 'Mini On-Location Cab Pickup',
                      rating: '4.0',
                      rateable: true,
                      agent: {
                        person: { id: '3', name: 'Ramesh Kumar' },
                        contact: { phone: '+911231231230' }
                      },
                      vehicle: {
                        make: 'Maruti Suzuki',
                        model: 'Swift Dzire',
                        registration: 'KA 05 CD 5678'
                      }
                    },
                    {
                      id: '19',
                      type: 'Mini On-Location Cab Pickup',
                      rating: '4.5',
                      agent: {
                        person: { id: '4', name: 'Suresh Kumar' },
                        contact: { phone: '+911231231231' }
                      },
                      vehicle: {
                        make: 'Maruti Suzuki',
                        model: 'WagonR',
                        registration: 'KA 05 CD 5777'
                      }
                    }
                  ],
                  customer: {
                    person: { name: 'omkar' },
                    contact: { name: 'omkar', phone: '4567899997', email: 'omkar@example.com' }
                  },
                  billing: {
                    name: 'omkar',
                    phone: '4567899997',
                    email: 'omkar@example.com'
                  }
                }
              ]
            }
          }
        ]
      }
    }).then(response => {
      expect(response.status).to.eq(200) // Expecting a 200 status, modify as needed
      // Additional assertions can be added here based on response structure
    })
  })
  it('should check "New Ride Request" popup component', () => {
    cy.wait(6000)
    cy.getByData(testIds.taxi_BPP_pickup_location_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_drop_location_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_km_away_text).should('be.visible')
    cy.getByData(testIds.taxi_BPP_km_distance_text).should('be.visible')
  })
  it('should accept the ride', () => {
    cy.getByData(testIds.taxi_BPP_accept_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_decline_button).should('be.visible')
    cy.getByData(testIds.taxi_BPP_accept_button).click()
    cy.getByData(testIds.taxi_BPP_Reached_Pick_up_Location_button).click()
    cy.getByData(testIds.taxi_BPP_Start_ride_button).click()
  })
  it('should display the top header with end ride details visible', () => {
    cy.getByData('ride-summary-header-img').should('exist').and('be.visible')
    cy.getByData('START_RIDE').should('exist').and('be.visible')
    cy.getByData('header-sub-title').should('exist').and('be.visible')
    cy.getByData('driver-img').should('exist').and('be.visible')
    cy.getByData('driver-call-img').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_km_away_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_km_distance_text).should('exist').and('be.visible')
    cy.getByData(testIds.driver_navigate).should('exist').and('be.visible')
    cy.getByData(testIds.navigate_img).should('exist').and('be.visible')
    cy.getByData('source-icon').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_pickup_location_text).should('exist').and('be.visible')
    cy.getByData('destination-icon').should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_drop_location_text).should('exist').and('be.visible')
    cy.getByData(testIds.taxi_BPP_end_ride_button).should('exist').and('be.visible')
  })
  it('Driver end call button should be clickable', () => {
    cy.getByData('driver-call-click').should('be.visible')
  })
  it('Navigate button should be clickable', () => {
    cy.getByData('driver-call-click').should('be.visible')
  })
  it('Start ride button should be clickable', () => {
    cy.getByData(testIds.taxi_BPP_end_ride_button).click()
  })
  it('Start ride button should be clickable', () => {
    cy.get('[data-test="taxi-BPP-Look-for-New-Ride-Request-button"]').click()
  })
  it('Should Display My Rides Details ', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.taxi_BPP_rideHistory).click()
    cy.url().should('include', '/myRides')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_All"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_carImage).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_riderName).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_date).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_time).should('be.visible')
    cy.getByData(testIds.taxi_BPP_myRides_status).should('be.visible')
  })
  it('Should Display by default All Tabs', () => {
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_All"]').should('be.visible')
  })
  it('Should Display Ongoing tabs when click on Ongoing tabs', () => {
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_On-going"]').click()
  })
  it('Should Display Completed tabs when click on Completed tabs', () => {
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').should('be.visible')
    cy.get('[data-test="testIds.taxi_BPP_my_rides_tablist_name_Completed"]').click()
  })
  it('Should Logout from app ', () => {
    cy.getByData(testIds.threeDots).click()
    cy.getByData(testIds.Logout_text).click()
  })
})
