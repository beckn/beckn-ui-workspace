import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import { Box, Flex, Button } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { buttonStyles } from '@components/constant'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Router, useRouter } from 'next/router'
import { Typography } from '@beckn-ui/molecules'
import { EXPLORE_PATH } from '@lib/config'
import RentalServiceModal from '../components/RentalServiceModal/RentalServiceModal'

const RentAndHire = () => {
  const router = useRouter()
  const { t } = useLanguage()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
    }
  }, [])

  const rentalOptions = [
    {
      image: '/images/pentagon.svg',
      text: 'Search Rental Services',
      handleClick: () => {
        router.push(`/myStore?type=${EXPLORE_PATH.RENT_AND_HIRE}`)
      }
    },
    {
      image: '/images/pentagon.svg',
      text: 'Provide Rental Services',
      handleClick: () => {
        handleOpenModal()
      }
    },
    {
      image: '/images/Order_history.svg',
      text: 'My services',
      handleClick: () => {
        console.log('Navigating to provide rental services...')
      }
    },
    {
      image: '/images/Order_history.svg',
      text: 'My Rentals',
      handleClick: () => {
        console.log('Navigating to provide rental services...')
      }
    }
  ]

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
      <Flex
        mt={'100px'}
        flexDir={'column'}
        alignItems="start"
        rowGap={'20px'}
        mb={'20px'}
      >
        <Typography
          text={t.rentAndHireHeading}
          fontSize="20px"
          fontWeight="600"
          color="#4398E8"
        />
        <Typography
          text={t.subTextForRenT}
          fontSize="12px"
          fontWeight="400"
          color="#7C7C7C"
        />
      </Flex>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="space-between"
        ml={'-10px'}
        mr={'-10px'}
      >
        {rentalOptions.map((option, index) => (
          <ShadowCardButton
            key={index}
            prefixIcon={
              <img
                src={option.image}
                alt={option.text}
              />
            }
            text={option.text}
            textStyle="start"
            postIcon={<MdOutlineKeyboardArrowRight />}
            handleClick={option.handleClick}
            dataTest={`hire_button_${index}`}
            sx={buttonStyles}
          />
        ))}
      </Box>
      <Box
        position={'absolute'}
        bottom="calc(0px + 10px)"
        w={'calc(100% - 40px)'}
      >
        <BecknButton
          text="Go Back Home"
          handleClick={() => {
            router.push('/')
          }}
        />
      </Box>

      <RentalServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  )
}

export default RentAndHire
