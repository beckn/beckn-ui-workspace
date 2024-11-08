import Cookies from 'js-cookie'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Loader, Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { formatTimestamp } from '@beckn-ui/common/src/utils'
import { useRouter } from 'next/router'
import EmptyOrder from '@components/orderHistory/emptyOrder'
import { orderHistoryData } from '@beckn-ui/common/lib/types'
import { testIds } from '@shared/dataTestIds'

const floodDataList = [
  {
    title: 'High resolution probabilistic flood prediction data',
    provider: 'Provided by Sky Analytics',
    description: '2 year historical data set covering temporal, spatial, and metric coverage for floods Bhutan.',
    placedAt: 'Placed at 21st Jun 2021, 3.30 pm'
  },
  {
    title: 'Medium resolution integrated model flood prediction data',
    provider: 'Provided by Climatic',
    description:
      'Founded in 2019, Climatic is a climate disaster modelling company based out of Dhaka, offering high resolution services for flood modelling.',
    placedAt: 'Placed at 21st Jun 2021, 3.30 pm'
  }
]

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dispatch = useDispatch()
  const [error, setError] = useState('')

  const bearerToken = Cookies.get('authToken')
  const router = useRouter()
  console.log(bearerToken)
  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(`${strapiUrl}/orders?filters[category]=6`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log('resluttt', result)
        if (result.error) {
          return setError(result.error.message)
        }
        console.log(result.data.reverse())
        setOrderHistoryList(result.data.reverse())
        setIsLoading(false)
      })
      .catch(error => {
        setIsLoading(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader />
      </Box>
    )
  }

  if (error.length) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Text
          fontWeight={500}
          fontSize={'15px'}
          textAlign={'center'}
        >
          {error}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
    >
      {!orderHistoryList.length ? (
        <EmptyOrder />
      ) : (
        <Box
          mt={'23px'}
          cursor={'pointer'}
        >
          {floodDataList.map((order, idx) => {
            return (
              <DetailCard key={idx}>
                <Flex
                  data-test={testIds.order_history_main_container}
                  gap={'5px'}
                  flexDirection={'column'}
                >
                  <Text
                    as={Typography}
                    text={order.title}
                    fontWeight="600"
                    fontSize={'15px'}
                    dataTest={'order_history_title'}
                  />
                  <Text
                    as={Typography}
                    text={order.provider}
                    fontWeight="400"
                    fontSize={'12px'}
                    dataTest={'order_history_provider'}
                  />
                  <Text
                    as={Typography}
                    text={order.description}
                    fontWeight="400"
                    fontSize={'12px'}
                    dataTest={'order_history_description'}
                  />
                  <Text
                    as={Typography}
                    text={order.placedAt}
                    fontWeight="400"
                    fontSize={'12px'}
                    dataTest={testIds.orderHistory_createdAt}
                  />
                </Flex>
              </DetailCard>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default OrderHistory
