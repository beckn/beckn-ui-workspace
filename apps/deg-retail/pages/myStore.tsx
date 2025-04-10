import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { cartActions, checkoutActions, HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import { Box, Flex } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { buttonStyles } from '@components/constant'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'

const MyStore = () => {
  const router = useRouter()
  const type = useSelector((state: RootState) => state.navigation.type)
  console.log('dank', type)
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
      dispatch(cartActions.clearCart())
      dispatch(checkoutActions.clearState())
    }
  }, [])

  const navigateToSearchResults = () => {
    if (searchTerm) {
      localStorage.setItem('optionTags', JSON.stringify({ name: searchTerm }))
      router.push(`/search?searchTerm=${searchTerm}`)
    }
  }

  const searchIconClickHandler = (e: React.MouseEvent) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }
  const homeButtonName = type === 'RENT_AND_HIRE' ? 'Go Back' : 'Go Back Home'
  return (
    <Box
      className="myStore-homepage"
      mt="-60px"
    >
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
      />
      <HomePageContent
        blockOrder={['header', 'description', 'searchInput']}
        headerProps={{
          name: type === 'RENT_AND_HIRE' ? t.rentAndHireHeading : t.myStoreHeading,
          description: type === 'RENT_AND_HIRE' ? t.subTextForRenT : t.subText
        }}
        searchProps={{
          searchPlaceholder:
            type === 'RENT_AND_HIRE'
              ? 'Search for Batteries, Capacity, Availability'
              : 'Search for Batteries, Solar panels...',
          setSearchTerm: setSearchTerm,
          onSearchIconClick: searchIconClickHandler,
          onSearchInputEnterPress: navigateToSearchResults
        }}
        showFooter={false}
        footerProps={{
          poweredByLogoSrc: '',
          poweredByText: ''
        }}
      />
      {type === 'MY_STORE' && (
        <Flex
          mt={'-80px'}
          ml={'-10px'}
          mr={'-10px'}
        >
          <ShadowCardButton
            prefixIcon={
              <img
                src={'/images/pentagon.svg'}
                alt={'orderHistory'}
              />
            }
            text={'My Orders'}
            textStyle="start"
            postIcon={<MdOutlineKeyboardArrowRight />}
            handleClick={() => router.push(`/orderHistory`)}
            sx={buttonStyles}
          />
        </Flex>
      )}
      {type === 'RENT_AND_HIRE' && (
        <Flex
          mt={'-80px'}
          ml={'-10px'}
          mr={'-10px'}
        >
          <ShadowCardButton
            prefixIcon={
              <img
                src={'/images/pentagon.svg'}
                alt={'orderHistory'}
              />
            }
            text={'My Rentals'}
            textStyle="start"
            postIcon={<MdOutlineKeyboardArrowRight />}
            handleClick={() => router.push(`/myRental`)}
            sx={buttonStyles}
          />
        </Flex>
      )}
      <Box
        position={'absolute'}
        bottom="calc(0px + 10px)"
        w={'calc(100% - 40px)'}
        maxW="40rem"
      >
        <BecknButton
          text={homeButtonName}
          handleClick={() => {
            // if (type === 'RENT_AND_HIRE') {
            //   router.push('/rentAndHire')
            // } else {
            //   Router.push('/')
            // }
            router.push('/')
          }}
        />
      </Box>
    </Box>
  )
}

export default MyStore
