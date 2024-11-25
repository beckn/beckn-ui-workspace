import Cookies from 'js-cookie'
import { Accordion, Loader, Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Divider, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { formatTimestamp } from '@beckn-ui/common/src/utils'
import EmptyOrder from '@components/orderHistory/emptyOrder'
import { orderHistoryData, StatusResponseModel, UIState } from '@beckn-ui/common/lib/types'
import { testIds } from '@shared/dataTestIds'
import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import axios from '@services/axios'
import { v4 as uuidv4 } from 'uuid'
import { DOMAIN, ORDER_CATEGORY_ID } from '@lib/config'
import { StatusKey, statusMap } from '@lib/types/order'
import { useLanguage } from '@hooks/useLanguage'

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const [error, setError] = useState('')
  const [orderStatusMap, setOrderStatusMap] = useState<Record<any, any>[]>()

  const bearerToken = Cookies.get('authToken')
  const { t } = useLanguage()

  useEffect(() => {
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(`${strapiUrl}/orders?filters[category][id][$eq]=${ORDER_CATEGORY_ID}&sort=updatedAt:desc`, requestOptions)
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

  const getOrderStatus = (order: orderHistoryData) => {
    if (order) {
      const bppId = order.attributes.bpp_id
      const bppUri = order.attributes.bpp_uri

      const statusPayload = {
        data: [
          {
            context: {
              transaction_id: uuidv4(),
              bpp_id: bppId,
              bpp_uri: bppUri,
              domain: DOMAIN
            },
            message: {
              order_id: order.attributes.order_id.toString(),
              orderId: order.attributes.order_id.toString()
            }
          }
        ]
      }

      axios
        .post(`${apiUrl}/status`, statusPayload)
        .then(res => {
          const resData: StatusResponseModel[] = res.data.data

          if (resData.length > 0) {
            const newData: any[] = []

            resData.forEach((status: StatusResponseModel) => {
              const statusKey = status?.message?.order?.fulfillments[0]?.state?.descriptor.code! as StatusKey

              if (resData.length === 1 && statusKey === 'REQUEST_SHARED') {
                newData.push({
                  label: statusMap['DATA_REQUESTED'],
                  statusTime: status?.context?.timestamp
                })
              }

              newData.push({
                label: statusMap[statusKey as StatusKey],
                statusTime: status?.message?.order?.fulfillments[0]?.state?.updated_at || status?.context?.timestamp,
                statusDescription: statusKey === 'REQUEST_SHARED' ? t.sharedViaChosenMode : '',
                noLine: statusKey === 'REQUEST_SHARED',
                lastElement: statusKey === 'REQUEST_SHARED'
              })
            })

            setOrderStatusMap((prevState: any) => {
              const updatedMap = { ...prevState }
              newData.forEach(statusData => {
                if (!updatedMap[order.attributes.order_id]) {
                  updatedMap[order.attributes.order_id] = { fulfillments: [] }
                }
                const labelSet = new Set(updatedMap[order.attributes.order_id].fulfillments.map((s: any) => s.label))

                if (!labelSet.has(statusData.label)) {
                  updatedMap[order.attributes.order_id].fulfillments.push(statusData)
                }
                updatedMap[order.attributes.order_id].status =
                  resData?.[0]?.message?.order?.fulfillments[0]?.state?.descriptor.code! === 'REQUEST_SHARED'
                    ? 'Completed'
                    : 'Pending'
              })

              return updatedMap
            })
          }
        })
        .catch(err => {
          console.error('Error fetching order status:', err)
        })
    }
  }

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
          />
          <Text
            as={Typography}
            text={orderStatusMap?.[order.attributes.order_id]?.status} // will correct this as per status
            fontWeight="600"
            fontSize={'15px'}
            padding={'0px 10px'}
            textAlign={'end'}
            color={orderStatusMap?.[order.attributes.order_id]?.status === 'Pending' ? '#BD942B' : '#5EC401'} // will correct this as per status
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
                onToggle={item => {
                  if (Array.isArray(item) && item.length) {
                    getOrderStatus(order)
                  }
                }}
              >
                <Flex
                  data-test={testIds.order_history_main_container}
                  gap={'5px'}
                  flexDirection={'column'}
                  padding={'10px 20px'}
                >
                  <Divider />
                  {!orderStatusMap?.[(order.attributes as any).order_id] ? (
                    <Box
                      display={'grid'}
                      alignContent={'center'}
                    >
                      <Loader size="md" />
                    </Box>
                  ) : (
                    <Stack p={'10px 0px'}>
                      {orderStatusMap &&
                        orderStatusMap?.[(order.attributes as any).order_id]?.fulfillments?.map(
                          (data: any, index: number) => (
                            <OrderStatusProgress // as per status call
                              key={index}
                              label={data.label}
                              statusTime={formatTimestamp(data.statusTime)}
                              noLine={data.noLine}
                              lastElement={data.lastElement}
                              statusDescription={data.statusDescription}
                            />
                          )
                        )}
                    </Stack>
                  )}
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
