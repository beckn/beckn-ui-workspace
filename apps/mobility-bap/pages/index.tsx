import React, { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState, PickUpDropOffModel, useGeolocation } from '@beckn-ui/common'
import { setPickUpLocation, setDropOffLocation } from '@store/user-slice'
import { UserGeoLocationRootState } from '@lib/types/user'
import BottomModalRenderer from '@components/bottomModalRenderer/bottomModalRenderer'
import { useRouter } from 'next/router'
import { getExperienceTypeGelocation } from '@utils/general'
import axios from '@services/axios'

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

  const getExperienceTypeFlow = async (): Promise<PickUpDropOffModel | null> => {
    const { experienceType: queryExperienceType, external_url: queryExternalUrl } = router.query

    if (!queryExperienceType && !queryExternalUrl) {
      localStorage.removeItem('experienceType')
      localStorage.removeItem('importedOrderObject')
      return null
    }

    if (queryExternalUrl) {
      localStorage.setItem('importedOrderObject', JSON.stringify(queryExternalUrl))
      localStorage.removeItem('experienceType')
    } else if (queryExperienceType) {
      localStorage.setItem('experienceType', JSON.stringify(queryExperienceType))
      localStorage.removeItem('importedOrderObject')
    }

    const storedExperienceType = JSON.parse(localStorage.getItem('experienceType') || 'null')
    const storedExternalUrl = JSON.parse(localStorage.getItem('importedOrderObject') || 'null')

    const experienceType = queryExperienceType || storedExperienceType
    const external_url = queryExternalUrl || storedExternalUrl

    if (!experienceType && !external_url) {
      return null
    }

    if (experienceType) {
      return getExperienceTypeGelocation(experienceType.toString())
    }

    if (external_url) {
      try {
        const { data } = await axios.get(external_url)
        const parisTag = data?.items?.[0]?.tags?.[0]?.list.find(
          (ele: any) => ele?.descriptor?.code === 'paris' && ele?.value === 'Y'
        )
        if (parisTag) {
          localStorage.setItem('experienceType', JSON.stringify('paris'))
          return getExperienceTypeGelocation('paris')
        }
      } catch (error) {
        console.error('Error fetching external URL data:', error)
      }
    }

    return null
  }

  useEffect(() => {
    // clear dropoff info initially
    dispatch(setDropOffLocation({ address: '', geoLocation: { latitude: 0, longitude: 0 } }))
  }, [])

  const enableCurrentLocation = useCallback(async () => {
    const experienceTypeGeoLocation = await getExperienceTypeFlow()

    if (originGeoAddress && originGeoLatLong) {
      const latLong = originGeoLatLong.split(',')

      const locationDetails = {
        address: originGeoAddress,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }

      dispatch(setPickUpLocation(locationDetails))
    } else if (
      experienceTypeGeoLocation?.address &&
      experienceTypeGeoLocation?.geoLocation.latitude &&
      experienceTypeGeoLocation?.geoLocation.longitude
    ) {
      dispatch(setPickUpLocation(experienceTypeGeoLocation))
    } else if (currentAddress && coordinates?.latitude && coordinates?.longitude) {
      const locationDetails = {
        address: currentAddress,
        geoLocation: coordinates
      }

      dispatch(setPickUpLocation(locationDetails))
    }
  }, [router.query, currentAddress, coordinates, originGeoAddress, originGeoLatLong])

  useEffect(() => {
    enableCurrentLocation()
  }, [router.query, currentAddress, coordinates, originGeoAddress, originGeoLatLong])

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
