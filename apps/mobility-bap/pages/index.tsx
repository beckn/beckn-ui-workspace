import React, { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { IGeoLocationSearchPageRootState, PickUpDropOffModel, useGeolocation } from '@beckn-ui/common'
import PickUpDropOffModal from '@components/BottomModal'
import { setPickUpLocation, setDropOffLocation } from '@store/user-slice'
import { UserGeoLocationRootState } from '@lib/types/user'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), { ssr: false })

  // const [currentLocation, setCurrentLocation] = useState<PickUpDropOffModel>()
  // const [destinationLocation, setDestinationLocation] = useState<PickUpDropOffModel>()
  const {
    geoAddress: originGeoAddress,
    geoLatLong: originGeoLatLong,
    destinationGeoAddress,
    destinationGeoLatLong
  } = useSelector((state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI)
  const router = useRouter()
  const dispatch = useDispatch()

  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const { currentAddress, coordinates } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    if (originGeoAddress && originGeoLatLong) {
      const latLong = originGeoLatLong.split(',')

      const locationDetails = {
        address: originGeoAddress,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }

      dispatch(setPickUpLocation(locationDetails))
    } else if (currentAddress && coordinates?.latitude && coordinates?.longitude) {
      const locationDetails = {
        address: currentAddress,
        geoLocation: coordinates
      }

      dispatch(setPickUpLocation(locationDetails))
    }
  }, [currentAddress, coordinates, originGeoAddress, originGeoLatLong])

  useEffect(() => {
    if (destinationGeoAddress && destinationGeoLatLong) {
      const latLong = destinationGeoLatLong.split(',')

      const locationDetails = {
        address: destinationGeoAddress,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }

      dispatch(setDropOffLocation(locationDetails))
    }
  }, [destinationGeoAddress, destinationGeoLatLong])

  const renderMap = useCallback(() => {
    return (
      <MapWithNoSSR
        origin={pickup?.geoLocation!}
        destination={dropoff?.geoLocation!}
      />
    )
  }, [pickup, dropoff])

  return (
    <div className="overflow-hidden max-h-[85vh]">
      {renderMap()}

      <PickUpDropOffModal
        isOpen={true}
        onClose={() => {}}
        pickup={pickup!}
        dropoff={dropoff!}
        handleClickOnSearchRides={() => {
          router.push('/searchRide')
        }}
      />
    </div>
  )
}

export default Homepage
