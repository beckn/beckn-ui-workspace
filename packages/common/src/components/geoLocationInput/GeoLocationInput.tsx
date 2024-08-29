import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import Styles from './GeoLocationInput.module.css'
import { Flex, useTheme } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState, toggleLocationSearchPageVisibility } from '@beckn-ui/common'

export interface GeoLocationInputProps {
  placeholder: string
  geoLocationSearchPageSelectedAddress: string
  navigateToSearchResult: () => void
}

export const GeoLocationInput: React.FC<GeoLocationInputProps> = ({
  placeholder,
  geoLocationSearchPageSelectedAddress,
  navigateToSearchResult
}) => {
  const dispatch = useDispatch()
  const theme = useTheme()

  const closeGeoLocationSearchPage = () => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType: '' }))
  }
  const primaryColor = theme.colors.primary['100']

  return (
    <>
      <Flex className={Styles.flex_container}>
        <Flex className={Styles.flex_input_group}>
          <GrLocation
            style={{
              position: 'absolute',
              left: '45px',
              marginTop: '23px',
              color: '#000'
            }}
          />

          <input
            className={Styles.input_box}
            name="search_input"
            placeholder={placeholder}
            type="text"
            value={geoLocationSearchPageSelectedAddress}
            onFocus={() => {
              closeGeoLocationSearchPage()
            }}
            readOnly
          />
          <button
            style={{ backgroundColor: `${primaryColor}` }}
            className={Styles.search_button}
            onClick={() => {
              navigateToSearchResult()
            }}
          >
            <FaSearch />
          </button>
        </Flex>
      </Flex>
    </>
  )
}
