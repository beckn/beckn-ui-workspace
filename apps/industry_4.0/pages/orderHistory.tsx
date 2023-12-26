import Cookies from 'js-cookie'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Text, Flex, Image } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'
import pendingIcon from '../public/images/pendingStatus.svg'
import { orderHistoryData } from '../types/order-history.types'

// const orderStatusMap = {
//   INITIATED: 'pending',
//   ACKNOWLEDGED: 'Confirmed',
//   PACKED: 'Packed',
//   SHIPPED: 'outForDelivery',
//   DELIVERED: 'completed'
// }

const OrderHistory = () => {
  const [orderHistoryList, setOrderHistoryList] = useState<orderHistoryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { t } = useLanguage()
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const bearerToken = Cookies.get('authToken')

  useEffect(() => {
    let myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)

    let requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch('https://strapi-bap.becknprotocol.io/api/orders?filters[category]=5', requestOptions)
      .then(response => response.json())
      .then(result => {
        setOrderHistoryList(result.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.log('error', error)
        setIsLoading(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  console.log('orderHistoryList', orderHistoryList)

  return (
    <Box mt={'23px'}>
      <DetailCard>
        <Flex
          gap={'5px'}
          flexDirection={'column'}
        >
          <Text
            as={Typography}
            text={'Placed at 21st Jun 2021, 3.30pm'}
            fontWeight="400"
            //   pb={'5px'}
            fontSize={'12px'}
          />

          <Text
            as={Typography}
            text={'Order ID: 789171'}
            fontWeight="400"
            //   pb={'5px'}
            fontSize={'12px'}
          />

          <Text
            as={Typography}
            text={'€ 1,60,000'}
            fontWeight="600"
            //   pb={'5px'}
            fontSize={'12px'}
          />

          <Flex
            fontSize={'10px'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Text>mock quantity items</Text>
            <Flex>
              <Image
                src={pendingIcon}
                paddingRight={'6px'}
              />
              <Text>Purchased</Text>
            </Flex>
          </Flex>
        </Flex>
      </DetailCard>
    </Box>
  )
}

export default OrderHistory
