import Cookies from 'js-cookie'
import { DetailCard } from '@beckn-ui/becknified-components'
import { LoaderWithMessage, Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import pendingIcon from '../public/images/pendingStatus.svg'
import completedIcon from '../public/images/TrackIcon.svg'
import { useDispatch } from 'react-redux'
import { formatTimestamp } from '@beckn-ui/common/src/utils'
import { useRouter } from 'next/router'
import EmptyOrder from '@components/orderHistory/emptyOrder'
import { orderHistoryData } from '@beckn-ui/common/lib/types'
import { orderActions } from '@beckn-ui/common/src/store/order-slice'
import { testIds } from '@shared/dataTestIds'
import { useLanguage } from '@hooks/useLanguage'
import { formatCurrency } from '@beckn-ui/becknified-components/src/components/product-price/product-price'

const orderStatusMap: Record<string, string> = {
  'In Review': 'Pending',
  ORDER_DELIVERED: 'Completed',
  ORDER_CANCELLED: 'Cancelled'
}

const orderStatusIconMap: Record<string, string> = {
  'ORDER COMPLETED': completedIcon,
  'ORDER RECEIVED': pendingIcon
}

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const [error, setError] = useState('')

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
    fetch(`${strapiUrl}/orders?filters[category]=6&sort[0]=updatedAt:desc`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.error) {
          return setError(result.error.message)
        }
        setOrderHistoryList(result.data)
        setIsLoading(false)
      })
      .catch(() => {
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
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={''}
        />
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
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
      marginBottom={'14rem'}
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
              <DetailCard key={idx}>
                <Flex
                  data-test={testIds.order_history_main_container}
                  onClick={() => {
                    const orderObjectForStatusCall = {
                      bppId: order.attributes.bpp_id,
                      bppUri: order.attributes.bpp_uri,
                      orderId: order.attributes.order_id
                    }
                    localStorage.setItem('selectedOrder', JSON.stringify(orderObjectForStatusCall))
                    dispatch(orderActions.addSelectedOrder({ orderDetails: orderObjectForStatusCall }))
                    router.push('/orderDetails')
                  }}
                  gap={'5px'}
                  flexDirection={'column'}
                >
                  <Text
                    as={Typography}
                    text={`Placed at ${formatTimestamp(order.attributes.createdAt)}`}
                    fontWeight="400"
                    fontSize={'12px'}
                    dataTest={testIds.orderHistory_createdAt}
                  />

                  <Text
                    as={Typography}
                    text={`Order ID: ${order.attributes.order_id}`}
                    fontWeight="400"
                    fontSize={'12px'}
                    dataTest={testIds.orderHistory_order_id}
                    maxWidth={{ base: '180px', md: 'none' }}
                    overflow={{ base: 'hidden', md: 'visible' }}
                    textOverflow={{ base: 'ellipsis', md: 'clip' }}
                    whiteSpace={{ base: 'nowrap', md: 'normal' }}
                  />

                  <Text
                    as={Typography}
                    text={`${formatCurrency(Number(order.attributes.quote.price.value), order.attributes.quote.price.currency || 'INR')}`}
                    fontWeight="600"
                    fontSize={'12px'}
                    dataTest={testIds.orderHistory_Price}
                  />

                  <Flex
                    fontSize={'10px'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                  >
                    <Text
                      as={Typography}
                      text={`${order?.attributes?.items?.length || 0} Items`}
                      fontWeight="400"
                      fontSize={'12px'}
                    />

                    <Flex>
                      <Image
                        src={orderStatusIconMap[order.attributes.delivery_status] || pendingIcon}
                        paddingRight={'6px'}
                        data-test={testIds.orderHistory_pendingIcon}
                      />
                      <Text>{orderStatusMap[order?.attributes?.delivery_status] || 'Pending'}</Text>
                    </Flex>
                  </Flex>
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
