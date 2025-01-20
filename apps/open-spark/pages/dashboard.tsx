'use client'

import React, { useEffect, useState } from 'react'
import { formatDate, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Input, LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { Box, Flex, HStack, Tag, TagLabel, Divider, Text } from '@chakra-ui/react'
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
import { useSelector } from 'react-redux'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { useBapTradeDashboardQuery, useBppTradeDashboardQuery } from '@services/DashboardService'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { DashboardData, StatusItem, TradeData } from '@lib/types/dashboard'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'
import PendingIcon from '@public/images/pending.svg'
import { testIds } from '@shared/dataTestIds'

const Dashboard = () => {
  const { t } = useLanguage()
  const router = useRouter()
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
  const [totalEnergyUnits, setTotalEnergyUnits] = useState<number>(0)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''
  const [isTradeLodaing, setIsTradeLoading] = useState(true)
  const [isPreffrenceLodaing, setIsPreffrenceLoading] = useState(true)
  const [currentTradeData, setCurrentTradeData] = useState<TradeData[]>([])
  const [currentStatusData, setCurrentStatusData] = useState<StatusItem[]>([])
  const [dashboardTotalEnergyUnitsData, setDashboardTotalEnergyUnitsData] = useState<DashboardData>({
    previous_month: 0,
    current_month: 0,
    average: 0
  })
  const [preferencesTags, setPreferencesTags] = useState<string[]>([])
  const totalEnergyText = role === ROLE.PRODUCER ? 'Produced' : 'Consumption'

  const payloadStartDate = parseAndFormatDate(startDate)
  const payloadEndDate = parseAndFormatDate(endDate)

  const { data: bapDashboardData } = useBapTradeDashboardQuery(
    {
      startDate: payloadStartDate,
      endDate: payloadEndDate,
      credentials: bearerToken
    },
    {
      skip: role !== ROLE.CONSUMER
    }
  )

  const { data: bppDashboardData } = useBppTradeDashboardQuery(
    {
      startDate: payloadStartDate,
      endDate: payloadEndDate,
      credentials: bearerToken
    },
    {
      skip: role !== ROLE.PRODUCER
    }
  )

  // const handleRemoveTag = (tagToRemove: string) => {
  //   setPreferencesTags(prevTags => prevTags.filter(tag => tag !== tagToRemove))
  // }

  const handleModalOpen = () => setIsModalOpen(true)
  const handleModalClose = () => setIsModalOpen(false)

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    handleModalClose()
  }
  useEffect(() => {
    if (role === ROLE.CONSUMER && bapDashboardData?.data?.consumption) {
      const { previous_month, current_month, average, totalInRange } = bapDashboardData.data.consumption
      setDashboardTotalEnergyUnitsData({ previous_month, current_month, average })
      setTotalEnergyUnits(totalInRange)
    } else if (role === ROLE.PRODUCER && bppDashboardData?.data?.production) {
      const { previous_month, current_month, average, totalInRange } = bppDashboardData.data.production
      setDashboardTotalEnergyUnitsData({ previous_month, current_month, average })
      setTotalEnergyUnits(totalInRange)
    }
  }, [role, bapDashboardData, bppDashboardData, startDate, endDate])

  const fetchLastTradeData = async () => {
    try {
      setIsTradeLoading(true)
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[role!]}/trade`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      const lastTrade = result[0]

      const mappedTrade: TradeData = {
        id: lastTrade.id,
        quantity: lastTrade.quantity,
        price: lastTrade.price || 0
      }

      setCurrentTradeData([mappedTrade])
      const statusData = createStatusData(lastTrade)
      setCurrentStatusData(statusData)

      const tags = [lastTrade.trusted_source && 'Trusted Source', lastTrade.cred_required && 'Solar Energy'].filter(
        Boolean
      )
      setPreferencesTags(tags)
    } catch (error) {
      console.error('Error fetching last trade data:', error)
    } finally {
      setIsTradeLoading(false)
    }
  }

  const fetchMyPreference = async () => {
    try {
      setIsPreffrenceLoading(true)
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[role!]}/trade-pref`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      setCurrentTradeData([
        {
          id: result.prefId,
          quantity: result.quantity,
          price: result.price
        }
      ])

      const tags = [result.trusted_source && 'Trusted Source', result.cred_required && 'Solar Energy'].filter(Boolean)
      setPreferencesTags(tags)
    } catch (error) {
      console.error('Error fetching preference data:', error)
    } finally {
      setIsPreffrenceLoading(false)
    }
  }

  useEffect(() => {
    if (role === ROLE.CONSUMER) {
      fetchLastTradeData()
    } else if (role === ROLE.PRODUCER) {
      fetchMyPreference()
    }
  }, [])

  const StatusLabel = () => {
    return (
      <Text
        fontSize={'12px'}
        fontWeight={500}
      >
        For more details go to{' '}
        <span
          style={{ color: '#4498E8', textDecoration: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}
          onClick={() => router.push('/myTrades')}
        >
          My Trades
        </span>
      </Text>
    )
  }

  const createStatusData = (tradeData: { status: string; createdAt: string }) => {
    const { status, createdAt } = tradeData
    const statusTime = formatDate(createdAt, 'hh:mm a')
    const isPending = status === 'RECEIVED'

    return [
      {
        label: isPending ? 'Requirement Received' : 'Requirement Completed',
        status,
        statusTime,
        noLine: false,
        isPending,
        lastElement: false
      },
      {
        label: <StatusLabel />,
        statusTime: '',
        isPending,
        noLine: true,
        lastElement: true
      }
    ]
  }

  const latestStatus = currentStatusData.find(item => typeof item.status === 'string' && item.status !== '')

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
        className="hideScroll"
        maxH={'calc(100vh - 100px)'}
        overflowY="scroll"
      >
        <Flex
          flexDirection={'column'}
          justifyContent={'space-between'}
          height={'calc(100vh - 100px)'}
        >
          <Box>
            <Typography
              text={`Total Energy ${totalEnergyText}`}
              fontSize="15px"
              fontWeight="600"
              sx={{
                marginBottom: '10px',
                paddingTop: '30px'
              }}
              dataTest={testIds.total_energy_text}
            />
            <Flex
              columnGap={'20px'}
              justifyContent="space-between"
              alignItems="center"
            >
              <Input
                dataTest={testIds.total_energy_input}
                name="energy"
                value={String(+totalEnergyUnits.toFixed(2))}
                type={'text'}
                handleChange={() => {
                  console.log('Energy units changed')
                }}
                label={'Energy Units'}
                disabled={true}
                rightElement={() => {
                  return (
                    <Box
                      cursor="pointer"
                      height="36px"
                      mt={'8px'}
                      opacity="0.4"
                    >
                      <Typography
                        text={'(KWh)'}
                        fontSize="15px"
                        fontWeight="400"
                        dataTest={testIds.total_energy_unit}
                      />
                    </Box>
                  )
                }}
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
                    text={role === ROLE.PRODUCER ? 'My Preferences' : 'Current Trade'}
                    fontSize="15"
                    fontWeight="600"
                    dataTest={testIds.current_trade}
                  />
                  <QuestionOutlineIcon />
                </HStack>
                {role === ROLE.PRODUCER && currentTradeData.length !== 0 && (
                  <LiaPenSolid
                    data-test={testIds.current_trade_edit_btn}
                    cursor={'pointer'}
                    onClick={() =>
                      router.push({
                        pathname: '/sellingPreference',
                        query: {
                          tradeId: currentTradeData[0]?.id,
                          quantity: currentTradeData[0].quantity,
                          price: currentTradeData[0].price,
                          preferencesTags: JSON.stringify({
                            solar: preferencesTags.includes('Solar Energy'),
                            trustedSource: preferencesTags.includes('Trusted Source')
                          })
                        }
                      })
                    }
                  />
                )}
                {role === ROLE.CONSUMER && currentTradeData.length !== 0 && latestStatus?.status !== 'SUCCESS' && (
                  <LiaPenSolid
                    data-test={testIds.current_trade_edit_btn}
                    cursor={'pointer'}
                    onClick={() =>
                      router.push({
                        pathname: '/buyingPreference',
                        query: {
                          tradeId: currentTradeData[0]?.id,
                          quantity: currentTradeData[0].quantity,
                          price: currentTradeData[0].price,
                          preferencesTags: JSON.stringify({
                            solar: preferencesTags.includes('Solar Energy'),
                            trustedSource: preferencesTags.includes('Trusted Source')
                          })
                        }
                      })
                    }
                  />
                )}
              </Flex>
            </Box>
            {isTradeLodaing && isPreffrenceLodaing ? (
              <Box m={'40px'}>
                <LoaderWithMessage
                  dataTest={testIds.loader_with_mssg}
                  loadingText={''}
                  loadingSubText={''}
                />
              </Box>
            ) : (
              <>
                {currentTradeData.length === 0 ? (
                  role === ROLE.CONSUMER ? (
                    <EmptyCurrentTrade />
                  ) : (
                    <></>
                  )
                ) : (
                  <>
                    <CurrentTrade
                      data={[
                        {
                          name: 'energyToBuy',
                          label: `Energy to ${role === ROLE.CONSUMER ? 'Buy' : 'Sell'}`,
                          value: (currentTradeData[0]?.quantity ?? 0).toString(),
                          symbol: '(KWh)',
                          disabled: true
                        },
                        ...(role !== ROLE.CONSUMER
                          ? [
                              {
                                name: 'priceFixed',
                                label: 'Price Fixed',
                                value: (currentTradeData[0]?.price ?? 0).toString(),
                                symbol: '₹/units',
                                disabled: true
                              }
                            ]
                          : [])
                      ]}
                    />

                    {preferencesTags.length > 0 && (
                      <Box>
                        <Typography
                          dataTest={testIds.preferencesTags_text}
                          text="Preferences"
                          fontSize="14px"
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
                              padding={'4px 8px'}
                            >
                              <TagLabel data-test={testIds.preferencesTags_tags_label}>{tag}</TagLabel>
                              {/* <TagCloseButton onClick={() => handleRemoveTag(tag)} /> */}
                            </Tag>
                          ))}
                        </Flex>
                      </Box>
                    )}
                    {role !== ROLE.PRODUCER && (
                      <Box mt={'10px'}>
                        <DetailCard>
                          <Flex
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            mb={'20px'}
                          >
                            <Typography
                              dataTest={testIds.current_status}
                              text="Current Status"
                              fontSize="14px"
                              fontWeight="600"
                            />
                            {latestStatus?.status && (
                              <Typography
                                dataTest={testIds.current_status_trade}
                                text={latestStatus?.status === 'RECEIVED' ? 'Pending' : 'Completed'}
                                fontSize="12px"
                                fontWeight="600"
                                color={latestStatus?.status === 'RECEIVED' ? '#BD942B' : '#5EC401'}
                              />
                            )}
                          </Flex>
                          <Divider />
                          <Box mt={'10px'}>
                            {currentStatusData.length > 0 ? (
                              currentStatusData.map((data, index) => (
                                <OrderStatusProgress
                                  dataTestStateName={testIds.current_trade_order_status_name}
                                  dataTestStateDescription={testIds.current_trade_order_status_discription}
                                  dataTestStateTime={testIds.current_trade_order_status_time}
                                  key={index}
                                  label={data.label}
                                  statusTime={data.statusTime!}
                                  noLine={data.noLine}
                                  lastElement={data.lastElement}
                                  statusIcon={data.isPending ? PendingIcon : null}
                                />
                              ))
                            ) : (
                              <Text>No status updates available</Text>
                            )}
                          </Box>
                        </DetailCard>
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
          <BecknButton
            children={role === ROLE.CONSUMER ? 'Buy' : 'Sell'}
            handleClick={() => router.push(role === ROLE.PRODUCER ? '/sellingPreference' : '/buyingPreference')}
            sx={{ marginTop: '60px' }}
            dataTest="buy-preference"
          />
        </Flex>
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

export default Dashboard
