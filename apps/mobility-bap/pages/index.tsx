import React, { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState, PickUpDropOffModel, useGeolocation } from '@beckn-ui/common'
import { setPickUpLocation, setDropOffLocation } from '@store/user-slice'
import { UserGeoLocationRootState } from '@lib/types/user'
import BottomModalRenderer from '@components/bottomModalRenderer/bottomModalRenderer'
import { useRouter } from 'next/router'
import { getExperienceTypeGelocation } from '@utils/general'

const Homepage = () => {
  const MapWithNoSSR: any = dynamic(() => import('../components/Map'), { ssr: false })

  const {
    geoAddress: originGeoAddress,
    geoLatLong: originGeoLatLong,
    destinationGeoAddress,
    destinationGeoLatLong
  } = useSelector((state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI)

  const dispatch = useDispatch()
  const router = useRouter()

  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const { currentAddress, coordinates } = useGeolocation(apiKeyForGoogle as string)

  const getExperienceTypeFlow = () => {
    const queryParam = JSON.parse(localStorage.getItem('experienceType')!)
    const experienceType = router.query?.experienceType || queryParam
    const external_url = router.query?.external_url || queryParam
    console.log('experienceType--> ', experienceType)
    console.log('external_url--> ', external_url)
    let flowType: PickUpDropOffModel | null = null
    if (experienceType) {
      localStorage.setItem('experienceType', JSON.stringify(experienceType))
      flowType = getExperienceTypeGelocation(experienceType.toString())
    } else if (external_url) {
      localStorage.setItem('experienceType', JSON.stringify(external_url))
      flowType = getExperienceTypeGelocation(external_url.toString())
    }
    return flowType
  }

  useEffect(() => {
    // clear dropoff info initially
    dispatch(setDropOffLocation({ address: '', geoLocation: { latitude: 0, longitude: 0 } }))
  }, [])

  useEffect(() => {
    if (originGeoAddress && originGeoLatLong) {
      const latLong = originGeoLatLong.split(',')

      const locationDetails = {
        address: originGeoAddress,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }

      dispatch(setPickUpLocation(locationDetails))
    } else if (currentAddress && coordinates?.latitude && coordinates?.longitude) {
      const experienceType = getExperienceTypeFlow()
      if (experienceType) {
        dispatch(setPickUpLocation(experienceType))
      } else {
        const locationDetails = {
          address: currentAddress,
          geoLocation: coordinates
        }

        dispatch(setPickUpLocation(locationDetails))
      }
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
    <div className="overflow-hidden max-h-[90vh]">
      {renderMap()}

      <BottomModalRenderer />
    </div>
  )
}

export default Homepage
