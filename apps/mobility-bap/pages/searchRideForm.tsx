import SearchRideForm from '@components/searchRideForm/SearchRideForm'
import { DOMAIN } from '@lib/config'
import dynamic from 'next/dynamic'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DiscoveryRootState } from '@store/discovery-slice'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { getSelectPayload } from '@utils/payload'

const MapWithNoSSR: any = dynamic(() => import('../components/Map'), {
  ssr: false
})

const searchRideForm = () => {
  const [fetchQuotes] = useSelectMutation()

  const { transactionId, selectedRide } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    fetchQuotes(getSelectPayload(selectedRide, transactionId, DOMAIN))
  }, [])

  console.log(selectedRide)

  return (
    <div>
      <MapWithNoSSR
        origin={selectedRide.pickup.geoLocation}
        destination={selectedRide.dropoff.geoLocation}
      />
      <SearchRideForm />
    </div>
  )
}

export default searchRideForm
