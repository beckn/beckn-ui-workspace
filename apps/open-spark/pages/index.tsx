'use client'

import React, { useEffect, useState } from 'react'
import { TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { AuthRootState } from '@store/auth-slice'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Input, Typography } from '@beckn-ui/molecules'
import { Box, Flex, HStack, Tag, TagLabel, TagCloseButton, Divider } from '@chakra-ui/react'
import CustomeDateInput from '@components/dateRangePicker/CustomeDateInput'
import SelectDate from '@components/dateRangePicker/SelectDate'
import TotalEnergyUnits, { DashboardData } from '@components/totalEnerguUnit/TotalEnergyUnits'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { LiaPenSolid } from 'react-icons/lia'
import EmptyCurrentTrade from '@components/currentTrade/EmptyCurrentTrade'
import CurrentTrade from '@components/currentTrade/CurrentTrade'
import { DetailCard, OrderStatusProgress } from '@beckn-ui/becknified-components'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { format } from 'date-fns'
import { RootState } from '@store/index'
import { useDispatch, useSelector } from 'react-redux'
import { ROLE } from '@lib/config'
import { useBapTradeDashboardQuery, useBppTradeDashboardQuery } from '@services/DashboardService'
const currentTradeMockData = [
  { name: 'energyToBuy', label: 'Energy to Buy', value: '210', disabled: true, symbol: '(KWh)' },
  { name: 'priceFixed', label: 'Price Fixed', value: '08', disabled: true, symbol: '₹/units' }
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
  const [dashboardTotalEnergyUnitsData, setDashboardTotalEnergyUnitsData] = useState<DashboardData>({
    previous_month: 0,
    current_month: 0,
    average: 0
  })
  const { data: bapDashboardData } = useBapTradeDashboardQuery(undefined, {
    skip: role !== ROLE.CONSUMER
  })
  const { data: bppDashboardData } = useBppTradeDashboardQuery(undefined, {
    skip: role !== ROLE.PRODUCER
  })
  const [preferencesTags, setPreferencesTags] = useState(['Solar', 'Biomass', 'Wind Power'])
  const totalEnergyText = role === ROLE.PRODUCER ? 'Produced' : 'Consumption'

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

  useEffect(() => {
    if (role === ROLE.CONSUMER && bapDashboardData?.data?.consumption) {
      setDashboardTotalEnergyUnitsData(bapDashboardData.data.consumption)
    } else if (role === ROLE.PRODUCER && bppDashboardData?.data?.production) {
      setDashboardTotalEnergyUnitsData(bppDashboardData.data.production)
    }
  }, [role, bapDashboardData, bppDashboardData])

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
        margin="calc(0rem + 68px) auto auto auto"
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
        <Flex
          columnGap={'20px'}
          justifyContent="space-between"
          alignItems="center"
        >
          <Input
            name="energy"
            value={'250 (KWh)'}
            type={'text'}
            handleChange={() => {
              console.log('Energy units changed')
            }}
            label={'Energy Units'}
            disabled={true}
          />
          <CustomeDateInput
            startDate={startDate}
            endDate={endDate}
            onCalendarClick={handleModalOpen}
          />
        </Flex>
        <Box>
          <TotalEnergyUnits dashboardTotalEnergyUnitsData={dashboardTotalEnergyUnitsData} />
        </Box>
        <Box>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={'15px'}
          >
            <HStack>
              <Typography
                text="Current Trade"
                fontSize="15"
                fontWeight="600"
              />
              <QuestionOutlineIcon />
            </HStack>
            {emptyState ? <></> : <LiaPenSolid />}
          </Flex>
          {emptyState ? <EmptyCurrentTrade /> : <CurrentTrade data={currentTradeMockData} />}
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
        <BecknButton
          children={role === ROLE.CONSUMER ? 'Buy' : 'Sell'}
          handleClick={() => router.push(role === ROLE.PRODUCER ? '/sellingPreference' : '/buyingPreference')}
        />
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
