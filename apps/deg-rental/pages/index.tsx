import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { useLanguage } from '@hooks/useLanguage'
import profileIcon from '@public/images/user_profile.svg'
import {
  cartActions,
  checkoutActions,
  DegWalletDetails,
  HomePageContent,
  TopSheet,
  useGeolocation
} from '@beckn-ui/common'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { buttonStyles } from '@components/constant'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import CustomDatePicker from '@components/dateTimePicker/customDatePicker'
import { roundToNextHour } from '@utils/general'
import { Input, Typography } from '@beckn-ui/molecules'
import { setNavigationType } from '@store/navigation-slice'
import { AuthRootState } from '@store/auth-slice'
import { UserRootState } from '@store/user-slice'
import OpenWalletBottomModal from '@components/modal/OpenWalletBottomModal'
import { clearCache } from '@utils/indexedDB'

const MyStore = () => {
  const [startDate, setStartDate] = useState<string>(roundToNextHour(new Date()).toISOString())
  const [endDate, setEndDate] = useState<string>(
    roundToNextHour(new Date(new Date(startDate).setHours(new Date(startDate).getHours() + 1))).toISOString()
  )
  const [rentingCapacity, setRentingCapacity] = useState<string>('')
  const [walletDetails, setWalletDetails] = useState<DegWalletDetails>()
  const [modalType, setModalType] = useState<'wallet' | 'link' | 'otp' | 'alert' | null>(null)

  const router = useRouter()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { shouldShowInitialAlert } = useSelector((state: UserRootState) => state.user)

  const type = useSelector((state: RootState) => state.navigation.type)
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const [searchTerm, setSearchTerm] = useState<string>('')

  const handleModalOpen = (type: 'wallet' | 'link' | 'otp' | 'alert') => setModalType(type)
  const handleModalClose = () => setModalType(null)

  useEffect(() => {
    dispatch(setNavigationType('RENT_AND_HIRE'))
    if (localStorage) {
      localStorage.clear()
      dispatch(cartActions.clearCart())
      dispatch(checkoutActions.clearState())
    }
  }, [])

  useEffect(() => {
    if (user && user?.deg_wallet) {
      setWalletDetails(user.deg_wallet)
    }
    console.log(shouldShowInitialAlert)
    if (
      shouldShowInitialAlert &&
      user?.deg_wallet &&
      (!user?.deg_wallet.energy_assets_consent ||
        !user?.deg_wallet.energy_identities_consent ||
        !user?.deg_wallet.energy_transactions_consent)
    ) {
      setModalType('alert')
    }
  }, [user, shouldShowInitialAlert])

  useEffect(() => {
    clearCache().catch(console.error)
  }, [])

  const navigateToSearchResults = useCallback(
    (searchByRentingCapacity: boolean = false) => {
      if (searchByRentingCapacity || searchTerm) {
        const obj = { name: searchTerm, renting: {} }
        if (searchByRentingCapacity) {
          obj.renting = {
            startTime: `${new Date(startDate).getTime() / 1000}`,
            endTime: `${new Date(endDate).getTime() / 1000}`,
            rentingCapacity: rentingCapacity
          }
        }
        localStorage.setItem('optionTags', JSON.stringify(obj))
        router.push(`/search?searchTerm=${searchTerm}`)
      }
    },
    [searchTerm, startDate, endDate, rentingCapacity]
  )

  const searchIconClickHandler = (e: React.MouseEvent) => {
    if (searchTerm) {
      navigateToSearchResults()
    }
    e.preventDefault()
  }

  const getMinTimeForStartDate = () => {
    const now = new Date()
    const selectedDate = new Date(startDate)
    const isToday = now.toDateString() === selectedDate.toDateString()

    return isToday ? now : new Date(selectedDate.setHours(0, 0, 0, 0))
  }

  const getMinDateForEndDate = () => {
    const selectedDate = new Date(startDate)
    if (selectedDate.getHours() === 23) {
      selectedDate.setDate(selectedDate.getDate() + 1)
      selectedDate.setHours(0, 0, 0, 0)
    }
    return selectedDate
  }

  const getMinTimeForEndDate = () => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const isSameDay = start.toDateString() === end.toDateString()

    if (isSameDay) {
      let hours = start.getHours() + 1
      if (hours >= 24) {
        start.setDate(start.getDate() + 1)
        hours = 0
      }
      start.setHours(hours, 0, 0, 0)
      return start
    }
    end.setHours(0, 0, 0, 0)
    return end
  }

  const handleStartDateChange = (date: Date | null) => {
    if (!date) return
    const selectedDate = new Date(date)

    const newEndDate = new Date(selectedDate)
    const selectedHours = selectedDate.getHours()
    if (selectedHours === 23) {
      newEndDate.setDate(newEndDate.getDate() + 1)
      newEndDate.setHours(0, 0, 0, 0)
    } else {
      newEndDate.setHours(selectedHours + 1, 0, 0, 0)
    }

    setStartDate(roundToNextHour(selectedDate).toISOString())
    setEndDate(roundToNextHour(newEndDate).toISOString())
  }

  const handleEndDateChange = (date: Date | null) => {
    if (!date) return
    setEndDate(roundToNextHour(new Date(date)).toISOString())
  }

  const homeButtonName = type === 'RENT_AND_HIRE' ? 'Go Back' : 'Go Back Home'
  return (
    <Box
      className="myStore-homepage hideScroll"
      backgroundColor="white"
      maxH={'calc(100vh - 10px)'}
      overflowY="scroll"
      ml={'-20px'}
      mr={'-20px'}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        mt={'20px'}
        mb={'15px'}
        pl={'20px'}
        pr={'20px'}
      >
        <Flex
          gap={'10px'}
          justify={'center'}
          alignItems={'center'}
        >
          <Image
            src={profileIcon}
            alt="profileIcon"
            onClick={() => router.push('/profile')}
          />

          {user?.agent && (
            <Typography
              fontSize="14px"
              color={'#3A3A3A'}
              text={user?.agent?.first_name + ' ' + (user?.agent?.last_name ?? '')}
              sx={{
                maxWidth: '180px',
                noOfLines: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            />
          )}
        </Flex>
        <Box>
          {user?.deg_wallet ? (
            <></>
          ) : (
            // <Select
            //   variant="unstyled"
            //   placeholder={`/subj****${user?.deg_wallet.deg_wallet_id.slice(-4)}`}
            //   value=""
            //   style={{
            //     pointerEvents: 'none'
            //   }}
            // />
            <BecknButton
              text="Connect Wallet"
              handleClick={() => handleModalOpen('wallet')}
              sx={{
                width: '93px',
                height: '30px',
                fontSize: '10px',
                fontWeight: '400',
                padding: '10px',
                borderRadius: '6px',
                mb: 'unset'
              }}
            />
          )}
        </Box>
      </Flex>
      <HomePageContent
        blockOrder={['header', 'description', 'customComponent']}
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
        customComponent={
          <>
            <Box
              p={'10px'}
              bg="#D1F2D1"
              borderRadius="6px"
            >
              <Box mb={6}>
                <Text
                  mb={3}
                  mt={3}
                  fontSize="15px"
                >
                  Rental Start Date
                </Text>
                <Flex align="center">
                  <CustomDatePicker
                    selected={new Date(startDate)}
                    placeholderText="Select Date & Time"
                    showTimeSelect
                    minDate={new Date()}
                    minTime={getMinTimeForStartDate()}
                    maxTime={new Date(new Date().setHours(23, 0, 0, 0))}
                    timeIntervals={60}
                    onChange={handleStartDateChange}
                    dateFormat="dd-MM-yyyy hh:mm a"
                    isInvalid={false}
                  />
                </Flex>
                <Text
                  mb={3}
                  mt={3}
                  fontSize="15px"
                >
                  Rental End Date
                </Text>
                <Flex align="center">
                  <CustomDatePicker
                    selected={new Date(endDate)}
                    placeholderText="Select Date & Time"
                    showTimeSelect
                    minDate={getMinDateForEndDate()}
                    minTime={getMinTimeForEndDate()}
                    maxTime={
                      new Date(new Date(startDate).setHours(new Date(startDate).getHours() === 23 ? 47 : 23, 0, 0, 0))
                    }
                    timeIntervals={60}
                    onChange={handleEndDateChange}
                    dateFormat="dd-MM-yyyy hh:mm a"
                    isInvalid={false}
                  />
                </Flex>
                <Text
                  mb={3}
                  mt={3}
                  fontSize="15px"
                >
                  Battery Capacity
                </Text>
                <Box
                  position="relative"
                  mb={4}
                  className="renting-capacity-input"
                >
                  <Input
                    type="number"
                    name="rentingCapacity"
                    variant="rounded"
                    value={rentingCapacity}
                    handleChange={e => {
                      const value = parseInt(e.target.value) || 0
                      if (!isNaN(value) && value >= 0) {
                        setRentingCapacity(value.toString())
                      }
                    }}
                    sx={{
                      backgroundColor: '#fff',
                      '&:focus': {
                        backgroundColor: '#fff'
                      }
                    }}
                    rightElement={() => (
                      <Typography
                        text="Kwh"
                        fontSize="16px"
                      />
                    )}
                  />
                </Box>
              </Box>

              <BecknButton
                text="Search"
                disabled={rentingCapacity === '' || rentingCapacity === '0'}
                handleClick={() => navigateToSearchResults(true)}
              />
            </Box>
          </>
        }
      />
      {type === 'RENT_AND_HIRE' && (
        <Flex
          bg="#e4ffe4"
          padding={'0 10px'}
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
      {/* <Box
        position={'absolute'}
        bottom="calc(0px + 10px)"
        w={'calc(100% - 40px)'}
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
      </Box> */}
      <OpenWalletBottomModal
        modalType={modalType}
        setModalType={setModalType}
        onClose={handleModalClose}
      />
    </Box>
  )
}

export default MyStore
