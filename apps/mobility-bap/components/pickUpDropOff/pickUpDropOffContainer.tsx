import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PickUpDropOff from './pickUpDropOff'
import { UserGeoLocationRootState } from '@lib/types/user'
import { getSearchRidePayload, parsedSearchDetails } from '@utils/cabDetails'
import axios from '@services/axios'
import { setCabResultFound, setCabServiceProviders, setCancelTokenSource, setTotalCabs } from '@store/cabService-slice'
import { feedbackActions } from '@beckn-ui/common'
import { useRouter } from 'next/router'
import { CabServiceDetailsRootState } from '@lib/types/cabService'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

interface PickUpDropOffContainerProps {
  handleOnClick: (fallback?: boolean) => void
  handleSearchInProgress: () => void
}

const PickUpDropOffContainer = (props: PickUpDropOffContainerProps) => {
  const { handleOnClick, handleSearchInProgress } = props

  const dispatch = useDispatch()
  const router = useRouter()
  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)
  const { rideSearchInProgress } = useSelector((state: CabServiceDetailsRootState) => state.cabService)

  const handleSearchRide = useCallback(() => {
    console.log(pickup, dropoff)
    const cancelTokenSource = axios.createCancelToken()
    dispatch(setCancelTokenSource(cancelTokenSource))

    const payload = getSearchRidePayload(pickup, dropoff)

    dispatch(setCabResultFound(true))
    handleSearchInProgress()

    axios
      .post(`${apiUrl}/search`, payload, { cancelToken: cancelTokenSource.token })
      .then(async res => {
        const { providerDetails, totalCabs } = await parsedSearchDetails(res.data.data)
        dispatch(setCabServiceProviders(providerDetails))
        dispatch(setTotalCabs(totalCabs))
        dispatch(setCabResultFound(false))
        handleOnClick()
      })
      .catch(e => {
        if (axios.isCancel(e)) {
          console.log('Request canceled:', e.message)
        } else {
          dispatch(
            feedbackActions.setToastData({
              toastData: {
                message: 'Error',
                display: true,
                type: 'error',
                description: 'Something went wrong, please try again'
              }
            })
          )
          router.push('/')
          handleOnClick(true)
        }
      })
      .finally(() => {
        dispatch(setCabResultFound(false))
      })
  }, [])

  return (
    <PickUpDropOff
      pickup={pickup!}
      dropoff={dropoff!}
      handleClickOnSearchRides={handleSearchRide}
    />
  )
}

export default PickUpDropOffContainer
