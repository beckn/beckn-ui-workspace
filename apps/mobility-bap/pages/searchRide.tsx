import { IGeoLocationSearchPageRootState } from 'lib/types/geoLocationSearchPage'
import React from 'react'
import { useSelector } from 'react-redux'

const SearchRide = () => {
  const pickupAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.pickupAddress
  )
  const dropoffAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.dropoffAddress
  )
  console.log(pickupAddress, dropoffAddress)
  return <div></div>
}

export default SearchRide
