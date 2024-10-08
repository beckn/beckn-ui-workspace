import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import BottomDrawer from '@components/bottomDrawer/BottomDrawer'
import CancelRide from '@components/cancel-ride/cancelRidePage'
import ContactSupport from '@components/contact-support/contactSupport'
import PickUpDropOffContainer from '@components/pickUpDropOff/pickUpDropOffContainer'
import RideDetailsCardContainer from '@components/ride-details/rideDetailsCardContainer'
import RideDetailsContainer from '@components/ride-details/rideDetailsContainer'
import SearchRideFormContainer from '@components/searchRideForm/searchRideFormContainer'
import { CabServiceDetailsRootState } from '@lib/types/cabService'
import { testIds } from '@shared/dataTestIds'
import { clearCancelTokenSource, setCabResultFound } from '@store/cabService-slice'
import { SelectRideRootState } from '@store/selectRide-slice'
import { RIDE_STATUS_CODE } from '@utils/general'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

interface BottomModalRendererProps {
  startNavigation: () => void
  showMyLocationIcon: (show: boolean) => void
}

type PageOrModalType =
  | ''
  | 'PICK_UP_DROP_OFF'
  | 'SEARCH_IN_PROGRESS'
  | 'SEARCH_RIDE'
  | 'RIDE_FORM'
  | 'PAYMENT'
  | 'DRIVER_DETAILS'
  | 'TRAFFIC_ALERT_MODAL'

const BottomModalRenderer = (props: BottomModalRendererProps) => {
  const { startNavigation, showMyLocationIcon } = props
  const router = useRouter()
  const [drawerState, setDrawerState] = useState<PageOrModalType>('PICK_UP_DROP_OFF')

  const dispatch = useDispatch()
  const { cancelTokenSource } = useSelector((state: CabServiceDetailsRootState) => state.cabService)
  const confirmResponse = useSelector((state: SelectRideRootState) => state.selectRide?.confirmResponse)

  useEffect(() => {
    if (drawerState === 'PICK_UP_DROP_OFF') {
      showMyLocationIcon(true)
    } else {
      showMyLocationIcon(false)
    }
  }, [drawerState])

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
            handleOnSearch={() => setDrawerState('SEARCH_IN_PROGRESS')}
          />
        )
      case 'SEARCH_IN_PROGRESS':
        return (
          <BecknButton
            text="Cancel Search"
            dataTest={testIds.mobility_cancel_search}
            variant="outline"
            handleClick={handleClickOnCancelSearch}
          />
        )
      case 'SEARCH_RIDE':
        handleSearchRide()
        return null
      case 'RIDE_FORM':
        return <SearchRideFormContainer handleOnClick={() => setDrawerState('PAYMENT')} />
      case 'PAYMENT':
        handlePayment()
        return null
      case 'DRIVER_DETAILS':
        return (
          <RideDetailsCardContainer
            handleStatusOperation={status => {
              if (status === RIDE_STATUS_CODE.RIDE_DECLINED) {
                setDrawerState('PICK_UP_DROP_OFF')
              } else if (status === RIDE_STATUS_CODE.RIDE_COMPLETED) {
                setDrawerState('')
              } else if (status === RIDE_STATUS_CODE.RIDE_STARTED) {
                startNavigation()
              }
            }}
          />
        )
      default:
        return <></>
    }
  }

  return <BottomDrawer data-test={testIds.mobility_info_content_container}>{renderDrawerContent()}</BottomDrawer>
}

export default BottomModalRenderer
