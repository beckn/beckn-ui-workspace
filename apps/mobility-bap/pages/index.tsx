import React, { useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useDispatch, useSelector } from 'react-redux'
import {
  IGeoLocationSearchPageRootState,
  PickUpDropOffModel,
  setGeoAddressAndLatLong,
  useGeolocation
} from '@beckn-ui/common'
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
    destinationGeoLatLong,
    country: originCountry,
    destinationCountry
  } = useSelector((state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI)

  const dispatch = useDispatch()
  const router = useRouter()

  const { pickup, dropoff } = useSelector((state: UserGeoLocationRootState) => state.userInfo)

  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

  const { currentAddress, coordinates, country } = useGeolocation(apiKeyForGoogle as string)

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
        const url = decodeURIComponent(external_url)
        const { data } = await axios.get(url)
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
    dispatch(setPickUpLocation({ address: '', country: '', geoLocation: { latitude: 0, longitude: 0 } }))
    dispatch(setDropOffLocation({ address: '', country: '', geoLocation: { latitude: 0, longitude: 0 } }))
  }, [])

  const enableCurrentLocation = useCallback(async () => {
    const experienceTypeGeoLocation = await getExperienceTypeFlow()

    if (originGeoAddress && originGeoLatLong) {
      const latLong = originGeoLatLong.split(',')

      const locationDetails = {
        address: originGeoAddress,
        country: originCountry,
        geoLocation: { latitude: Number(latLong[0]), longitude: Number(latLong[1]) }
      }

      dispatch(setPickUpLocation(locationDetails))
      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: locationDetails.address,
          country: locationDetails.country,
          geoLatLong: `${locationDetails.geoLocation.latitude},${locationDetails.geoLocation.longitude}`
        })
      )
    } else if (
      experienceTypeGeoLocation?.address &&
      experienceTypeGeoLocation?.geoLocation.latitude &&
      experienceTypeGeoLocation?.geoLocation.longitude
    ) {
      dispatch(setPickUpLocation(experienceTypeGeoLocation))
      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: experienceTypeGeoLocation.address,
          country: experienceTypeGeoLocation.country,
          geoLatLong: `${experienceTypeGeoLocation.geoLocation.latitude},${experienceTypeGeoLocation.geoLocation.longitude}`
        })
      )
    } else if (currentAddress && coordinates?.latitude && coordinates?.longitude) {
      const locationDetails = {
        address: currentAddress,
        country,
        geoLocation: coordinates
      }

      dispatch(setPickUpLocation(locationDetails))
      dispatch(
        setGeoAddressAndLatLong({
          geoAddress: locationDetails.address,
          country: locationDetails.country,
          geoLatLong: `${locationDetails.geoLocation.latitude},${locationDetails.geoLocation.longitude}`
        })
      )
    }
  }, [currentAddress, coordinates, originGeoAddress, originGeoLatLong, originCountry, country])

  useEffect(() => {
    enableCurrentLocation()
  }, [currentAddress, coordinates, originGeoAddress, originGeoLatLong, originCountry, country])

  useEffect(() => {
    if (destinationGeoAddress && destinationGeoLatLong) {
      const latLong = destinationGeoLatLong.split(',')

      const locationDetails = {
        address: destinationGeoAddress,
        country: destinationCountry,
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
