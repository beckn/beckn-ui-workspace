import Cookies from 'js-cookie'
import { Accordion, Loader, Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Divider, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { formatTimestamp } from '@beckn-ui/common/src/utils'
import { useRouter } from 'next/router'
import EmptyOrder from '@components/orderHistory/emptyOrder'
import { orderHistoryData } from '@beckn-ui/common/lib/types'
import { testIds } from '@shared/dataTestIds'
import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import { ORDER_CATEGORY_ID } from '@lib/config'

const mockData = [
  {
    label: 'Data Requested',
    statusTime: '21st Jun 2021, 12:11pm',
    noLine: false,
    lastElement: false
  },
  {
    label: 'Request Status',
    statusTime: '21st Jun 2021, 12:11pm',
    noLine: true,
    lastElement: true
  }
]

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [error, setError] = useState('')
  const [completed, setCompleted] = useState(true)

  const bearerToken = Cookies.get('authToken')
  const router = useRouter()
  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(`${strapiUrl}/orders?filters[category]=${ORDER_CATEGORY_ID}`, requestOptions)
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

  const accordionHeader = (order: any) => {
    return (
      <>
        <Flex
          justifyContent={'space-between'}
          p={'10px 10px'}
        >
          <Typography
            text={order.attributes.items[0].name}
            fontWeight="600"
            fontSize={'15px'}
            dataTest="order_history_item_name"
          />
          <Text
            as={Typography}
            text={completed ? 'Completed' : 'Pending'} // will correct this as per status
            fontWeight="600"
            fontSize={'15px'}
            padding={'0px 10px'}
            textAlign={'end'}
            color={completed ? '#5EC401' : '#BD942B'} // will correct this as per status
            dataTest={'order_history_Status'}
          />
        </Flex>
        <Flex
          data-test={testIds.order_history_main_container}
          flexDirection={'column'}
          padding={'0px 10px'}
        >
          <Text
            as={Typography}
            text={`Provide by ${order.attributes.descriptor.name}`}
            fontWeight="400"
            fontSize={'12px'}
            dataTest={'order_history_provider'}
          />
          <Text
            as={Typography}
            text={order.attributes.descriptor.short_desc}
            fontWeight="400"
            fontSize={'12px'}
            dataTest={'order_history_description'}
          />
          <Text
            as={Typography}
            text={`Placed at ${formatTimestamp(order.attributes.createdAt)}`}
            fontWeight="400"
            fontSize={'12px'}
            dataTest={testIds.orderHistory_createdAt}
          />
        </Flex>
      </>
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
          {orderHistoryList.map((order, idx) => {
            return (
              <Accordion
                accordionHeader={accordionHeader(order)}
                key={idx}
              >
                <Flex
                  data-test={testIds.order_history_main_container}
                  gap={'5px'}
                  flexDirection={'column'}
                  padding={'10px 20px'}
                >
                  <Divider />
                  <Stack p={'10px 0px'}>
                    {mockData.map((data, index) => (
                      <OrderStatusProgress // as per status call
                        key={index}
                        label={data.label}
                        statusTime={data.statusTime}
                        noLine={data.noLine}
                        lastElement={data.lastElement}
                      />
                    ))}
                  </Stack>
                </Flex>
              </Accordion>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default OrderHistory
