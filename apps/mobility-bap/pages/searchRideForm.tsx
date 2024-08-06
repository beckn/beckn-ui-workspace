import SearchRideForm from '@components/searchRideForm/SearchRideForm'
import { getSelectPayload } from '@components/searchRideForm/SearchRideForm.utils'
import { DOMAIN } from '@lib/config'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DiscoveryRootState } from '@store/discovery-slice'
import { mockData, ParsedCabDataModel } from '@utils/cabDetails'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'

const MapWithNoSSR: any = dynamic(() => import('../components/Map'), {
  ssr: false
})

const searchRideForm = () => {
  const [fetchQuotes, { isLoading, data, isError }] = useSelectMutation()

  const { transactionId, selectedRide } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    const selectRideRes = fetchQuotes(getSelectPayload(selectedRide, transactionId, DOMAIN))
    console.log('selectRideRes--> ', selectRideRes)
  }, [])

  const {
    data: [
      {
        cabCategory: {
          mini: { cabDetails }
        },
        location,
        optionsList
      }
    ]
  } = mockData

  return (
    <div>
      <MapWithNoSSR
        source={selectedRide.pickup?.geoLatLong}
        destination={selectedRide.dropoff?.geoLatLong}
      />
      <SearchRideForm
        cabDetails={cabDetails}
        location={location}
        optionsList={optionsList}
      />
    </div>
  )
}

export default searchRideForm
