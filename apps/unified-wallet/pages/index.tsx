'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { formatDate, TopSheet, useGeolocation } from '@beckn-ui/common'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import profileIcon from '@public/images/user_profile.svg'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import { format } from 'date-fns'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { useTradeDashboardMutation } from '@services/DashboardService'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { DashboardData, StatusItem, TradeData } from '@lib/types/dashboard'
import { parseAndFormatDate } from '@utils/parsedFormatDate-utils'
import IdentityIcon from '@public/images/identity.svg'
import AssetsIcon from '@public/images/assets.svg'
import TransactionsIcon from '@public/images/transactions.svg'
import { useDispatch } from 'react-redux'
import beckenFooter from '@public/images/footer.svg'
import PoweredBy from '@beckn-ui/common/src/components/poweredBy'
import NavigationItem from '@components/navigationItem'

const Dashboard = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
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
  const bearerToken = Cookies.get('authToken') || ''
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

  const totalEnergyText = role === ROLE.SELL ? 'Produced' : 'Consumption'
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const dispatch = useDispatch()
  const theme = useTheme()
  const primaryColor = theme.colors.primary['100']

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

      const mappedTrade: TradeData = {
        id: lastTrade.id,
        quantity: lastTrade.quantity,
        price: lastTrade.price || 0
      }

      setCurrentTradeData([mappedTrade])
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
      // const tags = [result.trusted_source && 'Trusted Source', result.cred_required && 'Solar Energy'].filter(Boolean)
      // setPreferencesTags(tags)
    } catch (error) {
      console.error('Error fetching preference data:', error)
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
  }

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const startPolling = () => {
      intervalRef.current = setInterval(() => {
        getmarketStatus()
      }, 5000)
    }
    startPolling()
    // if (role === ROLE.BUY) {
    //   fetchLastTradeData()
    // } else if (role === ROLE.SELL) {
    //   fetchMyPreference()
    // }
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
        margin="calc(0rem + 130px) auto"
        backgroundColor="white"
      >
        <Typography
          style={{ marginTop: '-15px', marginBottom: '15px' }}
          fontSize="27px"
          fontWeight="800"
          color={primaryColor}
          text={'Hi, Welcome!'}
        />
        <Flex
          marginTop={'1rem'}
          gap="1.5rem"
          flexDirection="column"
          justifyContent="space-between"
        >
          <NavigationItem
            icon={IdentityIcon}
            label={'My Identities'}
            handleClick={() => router.push('/myIdentities')}
            dataTest={'identity'}
            renderType="card"
          />
          <NavigationItem
            icon={AssetsIcon}
            label={'My Assets'}
            handleClick={() => router.push('/myAssets')}
            dataTest={'assets'}
            renderType="card"
          />
          <NavigationItem
            icon={TransactionsIcon}
            label={'My Transactions'}
            handleClick={() => router.push('/myTransactions')}
            dataTest={'transactions'}
            renderType="card"
          />
        </Flex>
        <PoweredBy
          logoSrc={beckenFooter}
          poweredByText={t.footerText}
        />
      </Box>
    </>
  )
}

export default Dashboard
