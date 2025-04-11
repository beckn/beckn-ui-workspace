import React, { useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import { cartActions, checkoutActions, HomePageContent, TopSheet, useGeolocation } from '@beckn-ui/common'
import { Box, Flex, Image } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { buttonStyles } from '@components/constant'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Router, useRouter } from 'next/router'
import { BottomModal, Loader, Typography } from '@beckn-ui/molecules'
import RentalServiceModal from '../components/RentalServiceModal/RentalServiceModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'

const RentAndHire = () => {
  const type = useSelector((state: RootState) => state.navigation.type)
  const router = useRouter()
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpenModal = () => setIsModalOpen(true)
  const handleCloseModal = () => setIsModalOpen(false)

  const rentalOptions = [
    {
      image: '/images/pentagon.svg',
      text: 'Search Rental Services',
      handleClick: () => {
        if (type === 'RENT_AND_HIRE') router.push('/myStore')
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
        router.push('/orderServices')
      }
    },
    {
      image: '/images/Order_history.svg',
      text: 'My Rentals',
      handleClick: () => {
        router.push('/myRental')
      }
    }
  ]

  useEffect(() => {
    if (localStorage) {
      localStorage.clear()
      dispatch(cartActions.clearCart())
      dispatch(checkoutActions.clearState())
    }
  }, [])

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
        handleOnSubmit={({ success, startLoading }: { success: boolean; startLoading: boolean }) => {
          setShowSuccess(success)
          setIsLoading(startLoading)
        }}
      />
      <BottomModal
        onClose={() => {}}
        isOpen={showSuccess}
      >
        <Box
          display={'grid'}
          alignContent={'center'}
          margin={`${!isLoading ? '0 0' : '4rem 0'}`}
          gap="1rem"
        >
          {!isLoading ? (
            <Flex
              justifyContent={'center'}
              alignItems="center"
              flexDirection={'column'}
            >
              <Image
                src="./images/orderConfirmmark.svg"
                alt="confirmation img"
                mt="20px"
              />

              <Typography
                style={{ textAlign: 'center' }}
                fontWeight="500"
                fontSize="17px"
                text={'Congratulations!'}
              />
              <Typography
                style={{ textAlign: 'center', paddingTop: '10px' }}
                fontSize="15px"
                text={'Your service has been successfully published'}
              />
              <BecknButton
                text="Go to My Services"
                sx={{ marginTop: '1rem' }}
                handleClick={() => router.push('/orderServices')}
              />
            </Flex>
          ) : (
            <Loader>
              <Typography
                fontWeight="500"
                fontSize="17px"
                text={'Please wait!'}
              />
              <Typography
                fontSize="15px"
                text={'While we process your request'}
              />
            </Loader>
          )}
        </Box>
      </BottomModal>
    </Box>
  )
}

export default RentAndHire
