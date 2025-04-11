import React, { useState } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import Styles from './GeoLocationInput.module.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  toggleLocationSearchPageVisibility,
  setPickupAddress,
  setDropoffAddress,
  setGeoLatLong
} from '../../store/geoMapLocationSearch-slice'
import backArrow from '/public/images/Back.svg'
import locationMarker from '../../public/images/SearchLocationMarker.svg'
import closeIcon from '../../public/images/Frame.svg'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { GeoLocationAddresModel } from 'lib/types/geoLocationSearchPage'

const GeoLocationInputList: React.FC = () => {
  const dispatch = useDispatch()
  const [address, setAddress] = useState<string>('')
  const pickup = useSelector((state: any) => state.geoLocationSearchPageUI.pickup)
  const dropoff = useSelector((state: any) => state.geoLocationSearchPageUI.dropoff)

  const handleSelect = async (data: string) => {
    const addressData = await geocodeByAddress(data)
    const latLong = await getLatLng(addressData[0])

    const locationDetails = {
      address: data,
      geoLatLong: { lat: latLong.lat, long: latLong.lng }
    }

    if (pickup.address === '') {
      dispatch(setPickupAddress(locationDetails))
      // dispatch(setGeoLatLong({ lat: latLong.lat, long: latLong.lng }))
    } else if (dropoff.address === '') {
      dispatch(setDropoffAddress(locationDetails))
      //   dispatch(setGeoLatLong({ lat: latLong.lat, long: latLong.lng }))
    }

    closeGeoLocationSearchPage()
  }

  const closeGeoLocationSearchPage = () => {
    dispatch(toggleLocationSearchPageVisibility({ visible: false, addressType: '' }))
  }

  return (
    <Box className={Styles.main_container2}>
      <PlacesAutocomplete
        value={address}
        onChange={event => setAddress(event)}
        onSelect={data => handleSelect(data)}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }): any => (
          <Flex flexDirection="column">
            <Flex
              flexDirection="row"
              marginTop="60px"
            >
              <Box
                p={3}
                width="10"
                style={{ border: '0px solid black' }}
              >
                <Image
                  marginLeft={2}
                  src={backArrow}
                  onClick={() => closeGeoLocationSearchPage()}
                />
              </Box>
              <Box
                p={2}
                width="-moz-max-content"
                className={Styles.search_box_container}
              >
                <Flex flexDirection="row">
                  <input
                    {...getInputProps()}
                    type="text"
                    autoFocus
                    name="search_input"
                    placeholder="Search for Cab location"
                    className={`${Styles.search_box_input}`}
                  />
                  <Image
                    src={closeIcon}
                    onClick={() => setAddress('')}
                  />
                </Flex>
              </Box>
            </Flex>
            <Box className={Styles.location_listitem_container}>
              {suggestions.length > 0 &&
                suggestions.map(suggestion => (
                  <Flex
                    {...getSuggestionItemProps(suggestion)}
                    flexDirection="row"
                    className={Styles.location_list_item}
                    key={suggestion.placeId}
                  >
                    <Box className={Styles.location_pointer_wrapper}>
                      <Image src={locationMarker} />
                    </Box>
                    <Box className={Styles.location_listitem_content}>
                      <Text className={Styles.location_listitem_content_main_text}>{suggestion.description}</Text>
                    </Box>
                  </Flex>
                ))}
            </Box>
          </Flex>
        )}
      </PlacesAutocomplete>
    </Box>
  )
}

export default GeoLocationInputList
