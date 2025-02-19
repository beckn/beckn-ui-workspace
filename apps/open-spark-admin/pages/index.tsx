import { feedbackActions, formatDate, TopSheet, useGeolocation } from '@beckn-ui/common'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import NavIcon from '@public/images/nav_icon.svg'
import profileIcon from '@public/images/user_profile.svg'
import { useLanguage } from '@hooks/useLanguage'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@store/index'
import Cookies from 'js-cookie'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { setTradeExecutionProcessed, UserRootState } from '@store/user-slice'
import { testIds } from '@shared/dataTestIds'
import OpenIcon from '@public/images/open.svg'
import CloseIcon from '@public/images/close.svg'

interface PendingTrades {
  id: number
  name: string
  quantity: number
  createdAt: string
}

const LockDemand = () => {
  const apiKeyForGoogle = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken') || ''

  const [items, setItems] = useState<PendingTrades[]>([])
  // const [isLockDemandLoading, setIsLockDemandLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<string>('CLOSED')
  const [startTime, setStartTime] = useState<string>()
  const [currentTime, setCurrentTime] = useState(Date.now())

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { tradeExecutionProcessed } = useSelector((state: UserRootState) => state.user)

  const {
    currentAddress,
    error: currentLocationFetchError,
    loading: loadingForCurrentAddress
  } = useGeolocation(apiKeyForGoogle as string)

  const fetchPendingTrades = async () => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[ROLE.ADMIN]}/get-pending-trades`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      const trades = result.map((tr: any) => {
        const {
          id,
          quantity,
          createdAt,
          profile: { name }
        } = tr
        return { id, name, quantity, createdAt }
      })
      setItems(trades)
    } catch (error) {
      console.error('Error fetching pending trade data:', error)
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
    getmarketStatus()
    fetchPendingTrades()
  }, [])

  const handleOnLockDemand = () => {
    dispatch(setTradeExecutionProcessed(true))

    axios
      .post(
        `${strapiUrl}${ROUTE_TYPE[ROLE.ADMIN]}/start-trade`,
        {},
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`
          }
        }
      )
      .then(response => {
        console.log('Trade started successfully:', response.data)
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: t.success,
              display: true,
              type: 'success',
              description: response.data.message || t.lockDemandSuccess
            }
          })
        )
        fetchPendingTrades()
      })
      .catch(error => {
        console.error('Error while locking demand:', error)
      })
      .finally(() => {
        dispatch(setTradeExecutionProcessed(false))
      })
  }

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

  const handleUpdateMarketStatus = () => {
    const data = { status: status === 'OPEN' ? 'CLOSED' : 'OPEN' }

    axios
      .put(`${strapiUrl}/beckn-energy-admin/market-status`, data, {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      })
      .then(response => {
        console.log('Market status updated successfully:', response.data)
        getmarketStatus()
      })
      .catch(error => {
        console.error('Error while updating market status:', error)
      })
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
        <Flex gap="1rem">
          <BecknButton
            text="Open Market"
            disabled={status === 'OPEN'}
            handleClick={handleUpdateMarketStatus}
          />
          <BecknButton
            text="Close Market"
            disabled={status === 'CLOSED'}
            handleClick={handleUpdateMarketStatus}
          />
        </Flex>
        <Flex
          flexDirection={'row'}
          justifyContent={'space-around'}
          backgroundColor={'#4498E8'}
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
        <Flex
          flexDirection={'column'}
          justifyContent={'space-between'}
          height={'calc(100vh - 226px)'}
        >
          <Box>
            <Typography
              dataTest={testIds.total_aggregated_demand}
              text="Total Aggregated demand"
              fontWeight="600"
              fontSize="16px"
              color="#4A4A4A"
            />

            <Box
              maxH={'calc(100vh - 212px)'}
              overflowY="scroll"
              overflowX="scroll"
              className="hideScroll"
              marginTop={'1rem'}
            >
              <Table
                variant="simple"
                data-test={testIds.total_aggregated_table}
              >
                <Thead
                  data-test={testIds.total_aggregated_table_head}
                  position="sticky"
                  top={0}
                  bg="white"
                  zIndex={1}
                >
                  <Tr data-test={testIds.total_aggregated_table_row}>
                    <Th padding="0">
                      <Box
                        display="flex"
                        alignItems="center"
                        placeContent={'center'}
                        width={'64px'}
                        data-test={testIds.total_aggregated_table_unit}
                      >
                        Unit
                      </Box>
                    </Th>
                    <Th padding="0">
                      <Box
                        display="flex"
                        alignItems="center"
                        placeContent={'center'}
                        width={'130px'}
                        data-test={testIds.total_aggregated_table_consumer}
                      >
                        Consumer
                      </Box>
                    </Th>
                    <Th padding="0">
                      <Box
                        display="flex"
                        alignItems="center"
                        placeContent={'center'}
                        width={'70px'}
                        data-test={testIds.total_aggregated_table_date}
                      >
                        Date
                      </Box>
                    </Th>
                    <Th>
                      <Box
                        display="flex"
                        alignItems="center"
                        width={'5px'}
                      ></Box>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.length > 0 ? (
                    items.map((item, index) => (
                      <Tr
                        key={index}
                        cursor="pointer"
                        _hover={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                        onClick={() => {
                          router.push({ pathname: '/tradeDetails', query: { id: item.id, pagename: item.name } })
                        }}
                      >
                        <Td
                          borderBottom={'1px dotted #004e92!important'}
                          padding="0"
                        >
                          <Typography
                            dataTest={testIds.total_aggregated_item_quantity}
                            text={item.quantity}
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              width: '64px'
                            }}
                          />
                        </Td>
                        <Td
                          borderBottom={'1px dotted #004e92!important'}
                          padding="0"
                        >
                          <Typography
                            dataTest={testIds.total_aggregated_item_name}
                            text={item.name}
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '1',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              width: '130px'
                            }}
                          />
                        </Td>
                        <Td
                          borderBottom={'1px dotted #004e92!important'}
                          padding="0"
                        >
                          <Typography
                            dataTest={testIds.total_aggregated_item_date}
                            text={formatDate(item.createdAt, 'yyyy-MM-dd')}
                            style={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: '2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'normal',
                              textAlign: 'center',
                              width: '70px'
                            }}
                          />
                        </Td>
                        <Td borderBottom={'1px dotted #004e92!important'}>
                          <Image
                            data-test={testIds.total_aggregated_nav_img}
                            src={NavIcon}
                            alt="nav_icon"
                            width={'6px'}
                          />
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={5}>
                        <Typography
                          dataTest="noRows"
                          text="No rows"
                          fontWeight="600"
                          style={{ textAlign: 'center' }}
                        />
                      </Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </Box>
          </Box>
          <BecknButton
            dataTest={testIds.total_aggregated_lock_demand}
            children={'Lock Demand'}
            isLoading={tradeExecutionProcessed}
            handleClick={handleOnLockDemand}
            sx={{ margin: '1rem 0' }}
            disabled={items.length === 0}
          />
        </Flex>
      </Box>
    </>
  )
}

export default LockDemand
