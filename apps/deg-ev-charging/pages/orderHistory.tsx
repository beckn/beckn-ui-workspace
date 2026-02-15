import React, { useEffect, useState } from 'react'
import { Box, Text } from '@chakra-ui/react'
import ChargingSessionCard from '../components/card/ChargingSessionCard'
import { ChargingHistoryResponse } from '@lib/types/orderHistory'
import { Loader } from '@beckn-ui/molecules'
import Cookies from 'js-cookie'
import { ORDER_CATEGORY_ID } from '@lib/config'
import { formatDate } from '@beckn-ui/common'
import EmptyScreenTemplate from '@components/EmptyTemplates/EmptyScreenTemplate'
import EmptyIcon from '@public/images/empty_cred.svg'

const OrderHistory = () => {
  const [data, setData] = useState<ChargingHistoryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    localStorage.setItem('selectedRoute', '/orderHistory')
    const myHeaders = new Headers()
    myHeaders.append('Authorization', `Bearer ${bearerToken}`)
    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }
    fetch(`${strapiUrl}/unified-beckn-energy/order-history/get?filters[category]=${ORDER_CATEGORY_ID}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        const parsedData: ChargingHistoryResponse = { activeSession: [], history: [] }
        result.forEach(
          (
            item: Record<string, unknown> & {
              items: Array<Record<string, unknown>>
              delivery_status?: string
              bpp_id?: string
              bpp_uri?: string
              order_id?: string
            }
          ) => {
            if (item.items.length > 0) {
              const details = item.items[0]
              if (item.delivery_status === '100') {
                parsedData.history.push({
                  bppId: item.bpp_id,
                  bppUri: item.bpp_uri,
                  id: item.order_id,
                  name: details.name,
                  type: details.type || '',
                  duration: `${details.duration ? details.duration + ' min' : ''}`,
                  cost: Number(details.price.value) * Number(details?.quantity?.selected?.measure?.value || 0),
                  date: formatDate(item.publishedAt, 'dd/MM/yyyy; hh:mm a'),
                  status: 'Completed'
                })
              } else {
                parsedData.activeSession.push({
                  bppId: item.bpp_id,
                  bppUri: item.bpp_uri,
                  id: item.order_id,
                  name: details.name,
                  type: details.type || '',
                  duration: `${details.duration ? details.duration + ' min' : ''}`,
                  cost: Number(details.price.value || 0) * Number(details?.quantity?.selected?.measure?.value || 0),
                  date: formatDate(item.publishedAt, 'dd/MM/yyyy; hh:mm a'),
                  status: 'In Progress'
                })
              }
            }
          }
        )
        console.log('parsedData', parsedData)
        setData(parsedData)

        setIsLoading(false)
        if (result.error) {
          return setError(result.error.message)
        }
      })
      .catch(error => {
        console.log('error', error)
        setIsLoading(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 340px)'}
        alignContent={'center'}
      >
        <Loader />
      </Box>
    )
  }

  if (error || (data?.activeSession.length === 0 && data?.history.length === 0)) {
    return (
      <EmptyScreenTemplate
        text={'No Chargers to show'}
        description="No chargers are shown in your history. Book one to see it here!"
        src={EmptyIcon}
      />
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
      w={['100%', '100%', '70%', '62%']}
      margin="0 auto"
      p={'10px 10px'}
      height={'calc(100vh - 12rem)'}
    >
      {data?.activeSession && data?.activeSession.length > 0 && (
        <>
          <Text
            fontSize="16px"
            fontWeight="600"
            mb={4}
          >
            Active Session
          </Text>
          {data.activeSession.map(session => (
            <ChargingSessionCard
              key={session.id}
              session={session}
            />
          ))}
        </>
      )}

      {data?.history && data.history.length > 0 && (
        <>
          <Text
            fontSize="16px"
            fontWeight="600"
            mt={8}
            mb={4}
          >
            History
          </Text>
          {data.history.map(session => (
            <ChargingSessionCard
              key={session.id}
              session={session}
            />
          ))}
        </>
      )}

      {/* {(!data?.activeSession || data?.activeSession.length === 0) && (!data?.history || data.history.length === 0) && (
        <Center h="calc(100vh - 200px)">
          <Text color="gray.500">No charging sessions found</Text>
        </Center>
      )} */}
    </Box>
  )
}

export default OrderHistory
