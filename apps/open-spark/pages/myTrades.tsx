import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, HStack, Image } from '@chakra-ui/react'
import Card from '@components/card/Card'
import React, { useEffect, useState } from 'react'
import successIcon from '@public/images/green_tick_icon.svg'
import inProgressIcon from '@public/images/in_progress_icon.svg'
import failedIcon from '@public/images/failed_icon.svg'
import { currencyMap, ROUTE_TYPE } from '@lib/config'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { useDispatch, useSelector } from 'react-redux'
import { AuthRootState } from '@store/auth-slice'
import { feedbackActions, formatDate } from '@beckn-ui/common'
import { useRouter } from 'next/router'

type TradeStatus = 'SUCCESS' | 'RECEIVED' | 'FAILED'

interface TradeMetaData {
  quantity: string
  price: number
  orderId: string
  time: string
  status: TradeStatus
}

const statusMap = {
  SUCCESS: { icon: successIcon, color: '#5EC401', label: 'Success' },
  RECEIVED: { icon: inProgressIcon, color: '#BD942B', label: 'In progress' },
  FAILED: { icon: failedIcon, color: '#E93324', label: 'Failed' }
}

const MyTrades = () => {
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [checked, setChecked] = useState<boolean>(false)
  const [tradeList, setTradeList] = useState<TradeMetaData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const router = useRouter()
  const { role } = useSelector((state: AuthRootState) => state.auth)

  const getAllTradeList = async () => {
    const requestOptions = {
      method: 'GET',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    setIsLoading(true)

    await axios
      .get(`${strapiUrl}${ROUTE_TYPE[role!]}/trade`, requestOptions)
      .then(response => {
        const result = response.data
        if (result.length === 0) {
          return setTradeList([])
        }
        const list = result.map((data: any) => {
          return {
            orderId: data.id,
            price: data.price || 0,
            quantity: data.quantity,
            time: data.createdAt,
            status: data.status
          }
        })

        setTradeList(list)
      })
      .catch(error => {
        setIsLoading(false)
        console.error('Error fetching trade data:', error)
      })
  }

  useEffect(() => {
    getAllTradeList()
  }, [])

  const handleOnCardClick = (data: TradeMetaData) => {
    router.push({ pathname: '/tradeDetails', query: { id: data.orderId } })
  }

  if (tradeList.length === 0) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Typography
          text="No trade history found."
          fontWeight="400"
          fontSize="15px"
          style={{ placeSelf: 'center' }}
        />
      </Box>
    )
  }

  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
      pb={'20px'}
    >
      <Flex flexDirection={'column'}>
        {tradeList.map((trade, index) => {
          return (
            <Card
              key={index}
              handleOnclick={() => handleOnCardClick(trade)}
              childComponent={() => {
                return (
                  <Flex
                    flexDirection={'column'}
                    gap="4px"
                  >
                    <Typography
                      text={`${trade.quantity} Units`}
                      fontWeight="600"
                    />
                    <Typography text={`${currencyMap.INR}${trade.price}`} />
                    <Flex justifyContent={'space-between'}>
                      <Flex flexDir={'row'}>
                        <Typography text={`Order ID: ${trade.orderId}`} />
                        <Typography text={`, ${formatDate(trade.time, 'hh:mm a')}`} />
                      </Flex>
                      <Flex gap="4px">
                        <Image
                          src={`${statusMap[trade.status].icon}`}
                          alt="status_icon"
                        />
                        <Typography
                          color={statusMap[trade.status].color}
                          text={`${statusMap[trade.status].label}`}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                )
              }}
            />
          )
        })}
      </Flex>
    </Box>
  )
}

export default MyTrades
