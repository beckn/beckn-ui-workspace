import { Box, Flex, Image, Text } from '@chakra-ui/react'
import Styles from './GeoLocationInput.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch } from 'react-redux'
import React, { useState } from 'react'
import { toggleLocationSearchPageVisibility, setGeoAddressAndLatLong } from '../../store/geoMapLocationSearch-slice'
import backArrow from '/public/images/Back.svg'
import locationMarker from '../../public/images/SearchLocationMarker.svg'
import closeIcon from '../../public/images/category-icon/Frame.svg'
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'

const GeoLocationInputList: React.FC = () => {
  const dispatch = useDispatch()
  const [address, setAddress] = useState<string>('')
  const handleSelect = async (data: string) => {
    const addressData = await geocodeByAddress(data)
    const latLong = await getLatLng(addressData[0])

    dispatch(
      setGeoAddressAndLatLong({
        geoAddress: data,
        geoLatLong: `${latLong.lat},${latLong.lng}`
      })
    )
    closeGeoLocationSearchPage()
  }
  const closeGeoLocationSearchPage = () => {
    dispatch(toggleLocationSearchPageVisibility(false))
  }
  const { t } = useLanguage()

  return (
    <Box className={Styles.main_container2}>
      <PlacesAutocomplete
        value={address}
        onChange={event => {
          return setAddress(event)
        }}
        onSelect={data => handleSelect(data)}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <Flex flexDirection={'column'}>
            <Flex
              flexDirection={'row'}
              marginTop="20px"
            >
              <Box
                p={3}
                width="10"
                style={{ border: '0px solid black' }}
              >
                <Image
                  marginLeft={2}
                  src={backArrow}
                  onClick={() => {
                    closeGeoLocationSearchPage()
                  }}
                />
              </Box>
              <Box
                p={2}
                width="-moz-max-content"
                className={Styles.search_box_container}
              >
                <Flex flexDirection={'row'}>
                  <input
                    {...getInputProps()}
                    type={'text'}
                    autoFocus
                    name="search_input"
                    placeholder={t.searchForTravelLocation}
                    className={`${Styles.search_box_input}`}
                  />
                  <Image
                    src={closeIcon}
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
                          <Image src={locationMarker} />
                        </Box>
                        <Box className={Styles.location_listitem_content}>
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
        )}
      </PlacesAutocomplete>
    </Box>
  )
}

export default GeoLocationInputList
