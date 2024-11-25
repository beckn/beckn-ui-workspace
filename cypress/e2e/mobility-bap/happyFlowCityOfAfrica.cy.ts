import { testIds } from '../../../shared/dataTestIds'

describe('Happy flow of City Of Africa app', () => {
  //Make sure to log in with the Driver app, and
  //set the location to Banjul,Serkekunda
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
    cy.getByData(testIds.mobility_pickup_address).type('Serekunda Market')
    cy.getByData(testIds.location_list_item).should('be.visible').eq(0).click()
  })
  it('should enter dropoff address', () => {
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).type('Banjul International Airport')
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
              //cy.getByData(testIds.mobility_provider_rating).should('contain.text', '4.3')
            })

          cy.getByData(testIds.mobility_provider_item).should('be.visible')
          cy.getByData(testIds.mobility_provider_item)
            .eq(0)
            .within(() => {
              cy.getByData(testIds.mobility_provider_item_name).should('be.visible')
              //cy.getByData(testIds.mobility_provider_item_fare).should('contain.text', 'D221.01')
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
    cy.getByData(testIds.mobility_pickup_address).should('contain.text', 'Serekunda Market, Serrekunda, The Gambia')
    cy.getByData(testIds.mobility_dropoff_label).should('contain.text', 'Dropoff')
    cy.getByData(testIds.mobility_dropoff_address).should(
      'contain.text',
      'Banjul International Airport, Yundum, The Gambia'
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
    cy.getByData(testIds.mobility_rider_name).type('kebba')
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

  //Open driver app and Accept the ride,Start ride,Reached Pick up location,End ride

  it('should render the Ride Stared Modal', () => {
    cy.wait(5000)
    cy.getByData(testIds.mobility_car_registrationNumber).should('be.visible')
    cy.getByData(testIds.mobility_car_details).should('be.visible')
    cy.getByData('driverImage').should('be.visible')
    cy.getByData('driverName').should('be.visible')
    cy.getByData('driverRating').should('be.visible')
    cy.getByData('drivercallIcon').should('be.visible')
    cy.getByData(testIds.mobility_totalFare).should('be.visible')
    cy.getByData(testIds.mobility_Payment_text).should('be.visible')
    cy.getByData(testIds.mobility_cashText).should('be.visible')
    cy.getByData(testIds.mobility_Payment_image).should('be.visible')
    cy.getByData(testIds.mobility_pickup_label).should('be.visible')
    cy.getByData(testIds.mobility_dropoff_label).should('be.visible')
    cy.getByData(testIds.mobility_cashText_Contact_Support).should('be.visible')
  })
  it('should render Cab Details', () => {
    cy.getByData('registrationNumber').should('be.visible')
    cy.getByData('carDetails').should('be.visible')
    cy.getByData('driverName').should('be.visible')
    cy.getByData('driverRating').should('be.visible')
  })
  it('Should Render Cab Payment Details ', () => {
    cy.getByData(testIds.mobility_totalFare).should('contain.text', 'Total Fare')
    cy.getByData(testIds.mobility_Payment_text).should('contain.text', 'Payment')
    cy.getByData(testIds.mobility_cashText).should('contain.text', 'Cash')
    cy.getByData(testIds.mobility_Payment_image).should('have.attr', 'src')
  })
  it('should Click On Contact Support Button and Navigate to Contact Support Handle Page and Show All Element', () => {
    cy.getByData(testIds.mobility_cashText_Contact_Support).click()
    cy.getByData('Contact_Support').should('be.visible')
    cy.getByData(testIds.loadingIndicator).should('be.visible')
    cy.getByData('contactSupprtText').should('be.visible')
    cy.getByData('call_us').should('be.visible')
    cy.getByData(' email_us').should('be.visible')
  })
  it('should Click On Skip For Now Button', () => {
    cy.getByData(testIds.feedback_skip_forNow).should('contain.text', 'Skip for Now')
    cy.getByData(testIds.feedback_skip_forNow).should('contain.text', 'Skip for Now').click()
  })
})
