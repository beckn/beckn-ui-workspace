import BottomDrawer from '@components/bottomDrawer/BottomDrawer'
import CancelRide from '@components/cancel-ride/cancelRidePage'
import ContactSupport from '@components/contact-support/contactSupport'
import RideDetailsCardContainer from '@components/ride-details/rideDetailsCardContainer'
import RideDetailsContainer from '@components/ride-details/rideDetailsContainer'
import SearchRideFormContainer from '@components/searchRideForm/searchRideFormContainer'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

const ModalContent = () => {
  const router = useRouter()
  const [drawerState, setDrawerState] = useState('RIDE_FORM')

  useEffect(() => {
    // Check if coming back from payment page
    if (router.query.fromPayment) {
      setDrawerState('DRIVER_DETAILS')
    }
  }, [router.query])

  const handlePayment = () => {
    router.push({
      pathname: '/paymentMode',
      query: { from: 'RiderModal' }
    })
  }

  const renderDrawerContent = () => {
    switch (drawerState) {
      case 'RIDE_FORM':
        return <SearchRideFormContainer handleOnClick={() => setDrawerState('PAYMENT')} />
      case 'PAYMENT':
        handlePayment()
        return null
      case 'DRIVER_DETAILS':
        return <RideDetailsCardContainer handleOnClick={() => setDrawerState('RIDER_DETAILS')} />
      case 'RIDER_DETAILS':
        return (
          <RideDetailsContainer
            handleCancelRide={() => setDrawerState('CANCEL_RIDE')}
            handleContactSupport={() => setDrawerState('CONTACT_SOPPORT')}
          />
        )
      case 'CONTACT_SOPPORT':
        return <ContactSupport />
      case 'CANCEL_RIDE':
        return <CancelRide />
      default:
        return null
    }
  }

  return <BottomDrawer>{renderDrawerContent()}</BottomDrawer>
}

export default ModalContent
