import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomDrawer from '@components/bottomDrawer/BottomDrawer'
import CancelRide from '@components/cancel-ride/cancelRidePage'
import ContactSupport from '@components/contact-support/contactSupport'
import PickUpDropOffContainer from '@components/pickUpDropOff/pickUpDropOffContainer'
import RideDetailsCardContainer from '@components/ride-details/rideDetailsCardContainer'
import RideDetailsContainer from '@components/ride-details/rideDetailsContainer'
import SearchRideFormContainer from '@components/searchRideForm/searchRideFormContainer'
import { CabServiceDetailsRootState } from '@lib/types/cabService'
import { clearCancelTokenSource, setCabResultFound } from '@store/cabService-slice'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

type PageOrModalType =
  | 'PICK_UP_DROP_OFF'
  | 'SEARCH_IN_PROGRESS'
  | 'SEARCH_RIDE'
  | 'RIDE_FORM'
  | 'PAYMENT'
  | 'DRIVER_DETAILS'
  | 'RIDER_DETAILS'
  | 'CONTACT_SOPPORT'
  | 'CANCEL_RIDE'

const BottomModalRendered = () => {
  const [drawerState, setDrawerState] = useState<PageOrModalType>('PICK_UP_DROP_OFF')

  const router = useRouter()
  const dispatch = useDispatch()
  const { cancelTokenSource } = useSelector((state: CabServiceDetailsRootState) => state.cabService)

  useEffect(() => {
    if (router.query.reset) {
      setDrawerState('PICK_UP_DROP_OFF')
    } else if (router.query.fromSearchRide) {
      setDrawerState('RIDE_FORM')
    } else if (router.query.fromPayment) {
      setDrawerState('DRIVER_DETAILS')
    }
  }, [router.query])

  const handleSearchRide = () => {
    router.push({
      pathname: '/searchRide',
      query: { from: 'pickUpDropOffModal' }
    })
  }

  const handlePayment = () => {
    router.push({
      pathname: '/paymentMode',
      query: { from: 'RiderModal' }
    })
  }

  const handleClickOnCancelSearch = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Cab search request canceled.')
      dispatch(clearCancelTokenSource())
      setDrawerState('PICK_UP_DROP_OFF')
      dispatch(setCabResultFound(false))
    }
  }

  const renderDrawerContent = () => {
    switch (drawerState) {
      case 'PICK_UP_DROP_OFF':
        return (
          <PickUpDropOffContainer
            handleOnClick={fallback => {
              if (fallback) {
                setDrawerState('PICK_UP_DROP_OFF')
              } else {
                setDrawerState('SEARCH_RIDE')
              }
            }}
            handleSearchInProgress={() => setDrawerState('SEARCH_IN_PROGRESS')}
          />
        )
      case 'SEARCH_IN_PROGRESS':
        return (
          <BecknButton
            text="Cancel Search"
            variant="outline"
            handleClick={handleClickOnCancelSearch}
          />
        )
      case 'SEARCH_RIDE':
        handleSearchRide()
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
        return <></>
    }
  }

  return <BottomDrawer>{renderDrawerContent()}</BottomDrawer>
}

export default BottomModalRendered
