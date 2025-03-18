'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { formatDate, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { Box, Flex, HStack, Tag, TagLabel, Image, Grid, Skeleton, SkeletonText, useTheme } from '@chakra-ui/react'
import CustomeDateInput from '@components/dateRangePicker/CustomeDateInput'
import SelectDate from '@components/dateRangePicker/SelectDate'
import { QuestionOutlineIcon } from '@chakra-ui/icons'
import { LiaPenSolid } from 'react-icons/lia'
import EmptyCurrentTrade from '@components/currentTrade/EmptyCurrentTrade'
import CurrentTrade from '@components/currentTrade/CurrentTrade'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { format } from 'date-fns'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { useTradeDashboardMutation } from '@services/DashboardService'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { DashboardData, StatusItem, TradeData } from '@lib/types/dashboard'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'
import { testIds } from '@shared/dataTestIds'
import TabView from '@components/tab/tab'
import Card from '@components/card/Card'
import OpenIcon from '@public/images/open.svg'
import CloseIcon from '@public/images/close.svg'
import { useDispatch } from 'react-redux'

const Dashboard = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const theme = useTheme()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const primaryColor = theme.colors.primary['100']
  const today = format(new Date(), 'dd/MM/yy')
  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const [role, setRole] = useState<ROLE>(ROLE.BUY)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<string>(today)
  const [endDate, setEndDate] = useState<string>(today)
  const [totalEnergyUnits, setTotalEnergyUnits] = useState<number>(0)
  const [status, setStatus] = useState<string>('CLOSED')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('p2pAuthToken') || ''
  const [isTradeLodaing, setIsTradeLoading] = useState(false)
  const [isPreffrenceLodaing, setIsPreffrenceLoading] = useState(false)
  const [currentTradeData, setCurrentTradeData] = useState<TradeData[]>([])
  const [currentStatusData, setCurrentStatusData] = useState<StatusItem[]>([])
  const [dashboardTotalEnergyUnitsData, setDashboardTotalEnergyUnitsData] = useState<DashboardData>({
    previous_month: 0,
    current_month: 0,
    average: 0
  })
  const [preferencesTags, setPreferencesTags] = useState<string[]>([])
  const [startTime, setStartTime] = useState<string>()
  const [currentTime, setCurrentTime] = useState(Date.now())

  const totalEnergyText = role === ROLE.SELL ? 'Production' : 'Consumption'
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const dispatch = useDispatch()

  const payloadStartDate = parseAndFormatDate(startDate)
  const payloadEndDate = parseAndFormatDate(endDate)

  const [tradeDashboard, { isLoading }] = useTradeDashboardMutation()

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

  const getDashboardDetails = useCallback(async () => {
    const response: any = await tradeDashboard({
      startDate: payloadStartDate,
      endDate: payloadEndDate,
      credentials: bearerToken
    })
    const dashboardData = response.data
    if (role === ROLE.BUY && dashboardData?.data?.consumption) {
      const { previous_month, current_month, average, totalInRange } = dashboardData.data.consumption
      setDashboardTotalEnergyUnitsData({ previous_month, current_month, average })
      setTotalEnergyUnits(totalInRange)
    } else if (role === ROLE.SELL && dashboardData?.data?.production) {
      const { previous_month, current_month, average, totalInRange } = dashboardData.data.production
      setDashboardTotalEnergyUnitsData({ previous_month, current_month, average })
      setTotalEnergyUnits(totalInRange)
    }
  }, [role, startDate, endDate])

  useEffect(() => {
    getDashboardDetails()
  }, [role, startDate, endDate])

  const fetchLastTradeData = async () => {
    try {
      setIsTradeLoading(true)
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[role!]}/trade`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      const lastTrade = result[0]
      if (lastTrade.status === 'SUCCESS') {
        setCurrentTradeData([])
      } else {
        const mappedTrade: TradeData = {
          id: lastTrade.id,
          quantity: lastTrade.quantity || 0,
          price: lastTrade.price || 0
        }

        setCurrentTradeData([mappedTrade])
      }
    } catch (error) {
      console.error('Error fetching last trade data:', error)
      setCurrentTradeData([])
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
          quantity: result.quantity || 0,
          price: result.price || 0
        }
      ])
      // const tags = [result.trusted_source && 'Trusted Source', result.cred_required && 'Solar Energy'].filter(Boolean)
      // setPreferencesTags(tags)
    } catch (error) {
      console.error('Error fetching preference data:', error)
      setCurrentTradeData([])
    } finally {
      setIsPreffrenceLoading(false)
    }
  }

  const getmarketStatus = async () => {
    const response = await axios.get(`${strapiUrl}/api/market-status`, {
      withCredentials: true
    })

    const result = response.data.data.attributes
    setStatus(result.status)
    setStartTime(result.updatedAt)
    localStorage.setItem('market-status', JSON.stringify({ status: result.status, startTime: result.updatedAt }))
  }

  useEffect(() => {
    const prevMarketStatus = JSON.parse(localStorage.getItem('market-status')!)
    if (prevMarketStatus) {
      setStatus(prevMarketStatus.status)
      setStartTime(prevMarketStatus.startTime)
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const startPolling = () => {
      intervalRef.current = setInterval(() => {
        getmarketStatus()
      }, 5000)
    }
    startPolling()
    if (role === ROLE.BUY) {
      fetchLastTradeData()
    } else if (role === ROLE.SELL) {
      fetchMyPreference()
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [role])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (status === 'OPEN') {
      interval = setInterval(() => {
        setCurrentTime(Date.now())
      }, 1000)
    }
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [status])

  const getFormattedElapsedTime = (initialTime: string): string => {
    if (status === 'CLOSED' || !initialTime) return '00h : 00m : 00s'
    const startTime = new Date(initialTime).getTime()
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000)

    const hrs = Math.floor(elapsedTime / 3600)
    const mins = Math.floor((elapsedTime % 3600) / 60)
    const secs = elapsedTime % 60

    const formattedHrs = formatDate(new Date(0, 0, 0, hrs), 'HH')
    const formattedMins = formatDate(new Date(0, 0, 0, 0, mins), 'mm')
    const formattedSecs = formatDate(new Date(0, 0, 0, 0, 0, secs), 'ss')

    return `${formattedHrs}h : ${formattedMins}m : ${formattedSecs}s`
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
        margin="calc(0rem + 90px) auto auto auto"
        backgroundColor="white"
        height={'calc(100vh - 120px)'}
      >
        <Flex
          flexDirection={'row'}
          justifyContent={'space-around'}
          backgroundColor={primaryColor}
          borderRadius="4px"
          margin={'14px 0'}
        >
          <Typography
            text={'Market Time'}
            color={'#ffffff'}
          />
          <Typography
            text={getFormattedElapsedTime(startTime!)}
            color={'#ffffff'}
          />
          <Flex gap={'4px'}>
            <Image src={status == 'OPEN' ? OpenIcon : CloseIcon} />
            <Typography
              text={status}
              color={'#ffffff'}
            />
          </Flex>
        </Flex>
        <TabView
          list={['Buy', 'Sell']}
          setCurrentTab={value => setRole(value === 'Buy' ? ROLE.BUY : ROLE.SELL)}
          currentTab={role === ROLE.BUY ? 'Buy' : 'Sell'}
          TabContent={
            <Flex
              flexDirection={'column'}
              justifyContent={'space-between'}
              height={'calc(100vh - 190px)'}
            >
              <Box>
                <Flex
                  flexDir={'row'}
                  justifyContent={'space-between'}
                  height={'4rem'}
                >
                  <Typography
                    text={`Energy ${totalEnergyText}`}
                    fontSize="15px"
                    fontWeight="600"
                    sx={{
                      marginBottom: '10px',
                      paddingTop: '30px'
                    }}
                    dataTest={testIds.total_energy_text}
                  />
                  <CustomeDateInput
                    startDate={startDate}
                    endDate={endDate}
                    label=""
                    onCalendarClick={handleModalOpen}
                  />
                </Flex>
                <Grid
                  templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' }}
                  width={{ base: '100%', md: '80%', lg: '100%' }}
                  marginBottom={'1rem'}
                >
                  {[
                    {
                      label: role === ROLE.BUY ? 'Total Energy Consumed' : 'Total Energy Produced',
                      description: `${+totalEnergyUnits.toFixed(2)} (KWh)`
                    },
                    {
                      label: role === ROLE.BUY ? 'Energy Consumption last month' : 'Energy Produced last month',
                      description: `${+dashboardTotalEnergyUnitsData.previous_month.toFixed(2)} (KWh)`
                    },
                    {
                      label: role === ROLE.BUY ? 'Energy Consumed this month' : 'Energy Produced this month',
                      description: `${+dashboardTotalEnergyUnitsData.current_month.toFixed(2)} (KWh)`
                    },
                    {
                      label: role === ROLE.BUY ? 'Average Energy Consumption' : 'Average Energy Produced',
                      description: `${+dashboardTotalEnergyUnitsData.average.toFixed(2)} (KWh)`
                    }
                  ].map(data => (
                    <Card
                      handleOnclick={() => {}}
                      childComponent={() => (
                        <Box padding="0 10px">
                          <SkeletonText
                            isLoaded={!isLoading}
                            noOfLines={2}
                            spacing={12}
                            skeletonHeight="4"
                          >
                            <Typography
                              text={data.label}
                              fontSize={'12px'}
                              style={{
                                height: '60px',
                                lineHeight: '15px',
                                textWrap: 'wrap'
                              }}
                            />

                            <Typography
                              text={data.description}
                              fontSize={'16px'}
                              fontWeight={'600'}
                            />
                          </SkeletonText>
                        </Box>
                      )}
                    />
                  ))}
                </Grid>
                <Box>
                  <Flex
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    mb={'15px'}
                  >
                    <HStack>
                      <Typography
                        text={role === ROLE.SELL ? 'My Preferences' : 'Current Trade'}
                        fontSize="15"
                        fontWeight="600"
                        dataTest={testIds.current_trade}
                      />
                      <QuestionOutlineIcon />
                    </HStack>
                    {role === ROLE.SELL && currentTradeData.length !== 0 && status !== 'CLOSED' && (
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
                    {role === ROLE.BUY && currentTradeData.length !== 0 && status !== 'CLOSED' && (
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
                      <EmptyCurrentTrade
                        text={
                          role === ROLE.BUY
                            ? 'your data will appear here once you start buying energy'
                            : 'your data will appear here once you start selling energy'
                        }
                        src={'/images/empty_trade.svg'}
                      />
                    ) : (
                      <>
                        <CurrentTrade
                          data={[
                            {
                              name: 'energyToBuy',
                              label: `Energy to ${role === ROLE.BUY ? 'Buy' : 'Sell'}`,
                              value: (currentTradeData[0]?.quantity ?? 0).toString(),
                              symbol: '(KWh)',
                              disabled: true
                            },
                            ...(role !== ROLE.BUY
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
                      </>
                    )}
                  </>
                )}
              </Box>
              <BecknButton
                disabled={status === 'CLOSED'}
                children={role === ROLE.BUY ? 'Buy' : 'Sell'}
                handleClick={() => router.push(role === ROLE.SELL ? '/sellingPreference' : '/buyingPreference')}
                sx={{
                  marginTop: '1rem'
                }}
                dataTest="buy-preference"
              />
            </Flex>
          }
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

export default Dashboard
