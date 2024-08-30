import { Box, Flex, Image, Input, Text } from '@chakra-ui/react'
import React from 'react'
import Styles from './GeoLocationInput.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import backArrow from '@public/images/Back.svg'
import locationMarker from '../../../public/images/SearchLocationMarker.svg'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import { IoClose } from 'react-icons/io5'
import {
  setGeoAddressAndLatLong,
  toggleLocationSearchPageVisibility
} from '@beckn-ui/common/src/store/geoMapLocationSearch-slice'

const GeoLocationInputList: React.FC = () => {
  const dispatch = useDispatch()
  const [address, setAddress] = useState<string>('')
  const handleSelect = async (data: string) => {
    const addressData = await geocodeByAddress(data)
    const addressComponents = addressData[0].address_components

    // Find the country from the address components
    const countryComponent = addressComponents.find(component => component.types.includes('country'))
    const country = countryComponent?.long_name || ''

    const latLong = await getLatLng(addressData[0])
    dispatch(
      setGeoAddressAndLatLong({
        geoAddress: data,
        country: country,
        geoLatLong: `${latLong.lat},${latLong.lng}`
      })
    )
    closeGeoLocationSearchPage()
  }
  const closeGeoLocationSearchPage = () => {
    dispatch(toggleLocationSearchPageVisibility({ visible: false, addressType: '' }))
  }

  return (
    <Box className={Styles.main_container2}>
      <PlacesAutocomplete
        value={address}
        onChange={event => {
          return setAddress(event)
        }}
        onSelect={data => {
          handleSelect(data)
        }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) =>
          (
            <Flex flexDirection={'column'}>
              <Flex
                flexDirection={'row'}
                marginTop="20px"
                justifyContent={'center'}
                alignItems={'center'}
              >
                <Box
                  p={3}
                  width="10"
                  style={{
                    border: '0px solid black'
                  }}
                >
                  <Image
                    src={backArrow}
                    onClick={() => {
                      closeGeoLocationSearchPage()
                    }}
                    alt="backArrow"
                  />
                </Box>
                <Box
                  p={2}
                  width="-moz-max-content"
                  className={Styles.search_box_container}
                >
                  <Flex
                    flexDirection={'row'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Input
                      {...getInputProps()}
                      type={'text'}
                      _focus={{ outline: 'none' }}
                      _focusVisible={{ boxShadow: 'none' }}
                      autoFocus={true}
                      borderRadius={'12px'}
                      name="search_input"
                      placeholder="Search for Location"
                      className={`${Styles.search_box_input}`}
                    />
                    <IoClose
                      className={Styles.close_icon}
                      onClick={() => {
                        setAddress('')
                      }}
                    />
                  </Flex>
                </Box>
              </Flex>
              <Box className={Styles.location_listitem_container}>
                {suggestions.length
                  ? suggestions.map(suggestion => {
                      return (
                        <Flex
                          {...getSuggestionItemProps(suggestion)}
                          flexDirection={'row'}
                          className={Styles.location_list_item}
                          key={suggestion.placeId}
                        >
                          <Box className={Styles.location_pointer_wrapper}>
                            <Image
                              src={locationMarker}
                              alt="locationMarker"
                            />
                          </Box>
                          <Box
                            className={Styles.location_listitem_content}
                            cursor="pointer"
                          >
                            <Text className={Styles.location_listitem_content_main_text}>
                              {suggestion.formattedSuggestion.mainText}
                            </Text>
                            <Text className={Styles.location_listitem_content_secondary_text}>
                              {suggestion.formattedSuggestion.secondaryText}
                            </Text>
                          </Box>
                        </Flex>
                      )
                    })
                  : null}
              </Box>
            </Flex>
          ) as any
        }
      </PlacesAutocomplete>
    </Box>
  )
}

export default GeoLocationInputList
