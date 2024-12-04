'use client'

import React, { useState } from 'react'
import { TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import _ from 'lodash'
import { AuthRootState } from '@store/auth-slice'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex, HStack, Tag, TagLabel, TagCloseButton, Divider } from '@chakra-ui/react'
import CustomeDateInput from '@components/dateRangePicker/CustomeDateInput'
import SelectDate from '@components/dateRangePicker/SelectDate'
import TotalEnergyUnits from '@components/totalEnerguUnit/TotalEnergyUnits'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { LiaPenSolid } from 'react-icons/lia'
import EmptyCurrentTrade from '@components/currentTrade/EmptyCurrentTrade'
import CurrentTrade from '@components/currentTrade/CurrentTrade'
import { DetailCard, OrderStatusProgress } from '@beckn-ui/becknified-components'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { format } from 'date-fns'
import { RootState } from '@store/index'
import { useDispatch, useSelector } from 'react-redux'

const totalEnergyMockData = [
  { label: 'Previous Month', value: '10 (KWh)' },
  { label: 'Current Month', value: '250 (KWh)' },
  { label: 'Average (per day)', value: '08 (KWh)' }
]
const currentTradeMockData = [
  { label: 'Energy to Buy', value: '210 (KWh)' },
  { label: 'Price Fixed', value: '08 ₹/units' }
]
const currentStatusmockData = [
  {
    label: 'Requirement Received',
    statusTime: '12:11 pm',
    noLine: false,
    lastElement: false,
    statusDescription: 'For more details go to My Trades'
  },
  {
    label: 'For more details go to My Trades',
    statusTime: '12:11 pm',
    noLine: false,
    lastElement: false,
    statusDescription: 'For more details go to My Trades'
  }
]

const Homepage = () => {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const router = useRouter()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const today = format(new Date(), 'dd/MM/yy')
  const { role } = useSelector((state: RootState) => state.auth)
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)
  const [emptyState, setEmptyState] = useState(false)

  const [preferencesTags, setPreferencesTags] = useState(['Solar', 'Biomass', 'Wind Power'])
  const totalEnergyText = role === 'PRODUCER' ? 'Produced' : 'Consumption'

  const handleRemoveTag = (tagToRemove: string) => {
    setPreferencesTags(prevTags => prevTags.filter(tag => tag !== tagToRemove))
  }

  const handleModalOpen = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    handleModalClose()
  }

  return (
    <>
      <TopSheet
        currentLocationFetchError={currentLocationFetchError}
        loadingForCurrentAddress={loadingForCurrentAddress}
        currentAddress={currentAddress}
        t={key => t[key]}
        profileSection={{
          src: profileIcon,
          handleClick: () => router.push('/profile')
        }}
      />
      <Box
        maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
        margin="calc(0rem + 90px)  auto"
        backgroundColor="white"
      >
        <Typography
          text={`Total Energy ${totalEnergyText}`}
          fontSize="15px"
          fontWeight="600"
          sx={{
            marginBottom: '10px'
          }}
        />
        <Flex columnGap={'20px'}>
          <Input
            value={'250 (KWh)'}
            type={'text'}
            handleChange={() => {
              console.log('Energy units changed')
            }}
            label={'Energy Units'}
          />
          <CustomeDateInput
            startDate={startDate}
            endDate={endDate}
            onCalendarClick={handleModalOpen}
          />
        </Flex>
        <Box>
          <TotalEnergyUnits mockData={totalEnergyMockData} />
        </Box>
        <Box mb={'15px'}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={'10px'}
          >
            <HStack>
              <Typography
                text="Current Trade"
                fontSize="15"
                fontWeight="600"
              />
              <QuestionOutlineIcon />
            </HStack>
            {emptyState ? <></> : <LiaPenSolid onClick={() => router.push('/buyingPrefference')} />}
          </Flex>
          {emptyState ? <EmptyCurrentTrade /> : <CurrentTrade mockData={currentTradeMockData} />}
        </Box>
        <Box>
          <Typography
            text="Preferences"
            fontSize="15"
            fontWeight="600"
            sx={{ marginBottom: '10px' }}
          />
          <Flex
            gap={'10px'}
            flexWrap={'wrap'}
          >
            {preferencesTags.map((tag, index) => (
              <Tag
                key={index}
                borderRadius="md"
                variant="outline"
                colorScheme="gray"
                padding={'8px'}
              >
                <TagLabel>{tag}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveTag(tag)} />
              </Tag>
            ))}
          </Flex>
        </Box>
        <Box mt={'10px'}>
          <DetailCard>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              mb={'20px'}
            >
              <Typography
                text="Current Status"
                fontSize="15px"
                fontWeight="600"
              />
              <Typography
                text="Pending"
                fontSize="12px"
                fontWeight="600"
                color="#BD942B" // '#5EC401' will change as per status
              />
            </Flex>
            <Divider />
            <Box mt={'10px'}>
              {currentStatusmockData.map((data, index) => (
                <OrderStatusProgress
                  key={index}
                  label={data.label}
                  statusTime={data.statusTime}
                  noLine={data.noLine}
                  lastElement={data.lastElement}
                  statusDescription={data.statusDescription}
                />
              ))}
            </Box>
          </DetailCard>
        </Box>
        <BecknButton children="Buy" />
      </Box>
      <SelectDate
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onDateSelect={handleDateChange}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />
    </>
  )
}

export default Homepage
