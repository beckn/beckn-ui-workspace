import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { GrLocation } from 'react-icons/gr'
import Styles from './GeoLocationInput.module.css'
import { Flex } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'

import { IGeoLocationSearchPageRootState } from '../../lib/types/geoLocationSearchPage'
import { useLanguage } from '../../hooks/useLanguage'
import Router from 'next/router'
import { toggleLocationSearchPageVisibility } from '@beckn-ui/common'

export const GeoLocationInput = () => {
  const dispatch = useDispatch()

  const geoLocationSearchPageSelectedAddress = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoAddress
  })
  const navigateToSearchResult = () => {
    const loc = geoLocationSearchPageSelectedAddress.split(',')[0]
    Router.push(`/search?searchTerm=${loc}`)
  }

  const someFunc = () => {
    dispatch(toggleLocationSearchPageVisibility({ visible: true, addressType: '' }))
  }
  const { t } = useLanguage()
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
            placeholder={t.searchForTravelLocation}
            type="text"
            value={geoLocationSearchPageSelectedAddress}
            onFocus={() => {
              someFunc()
            }}
            readOnly
          />
          <button
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
