import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'

import { formatDate } from '@beckn-ui/common'
import { Box, Divider, Flex, Stack } from '@chakra-ui/react'
import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import PendingIcon from '@public/images/pending.svg'
import { testIds } from '@shared/dataTestIds'
import OrderSummary from '@components/tradeDetails/OrderSummary'
import UserDetails from '@components/tradeDetails/UserDetails'
import nameIcon from '../public/images/name.svg'
import CallphoneIcon from '../public/images/Call.svg'
import emailIcon from '../public/images/mail.svg'
import UserCredentials from '@components/tradeDetails/UserCredential'
import { Accordion, Loader } from '@beckn-ui/molecules/src/components'

interface TradeMetaData {
  orderId: string
  name: string
  price: number
  quantity: string
  date: string
  status: string
  tradeId: string
  tradeEvents: any[]
  preferencesTags: string[]
}

const TRADDE_EVE_NUM = Object.freeze({
  BUY_REQUEST: 'buy_request',
  BECKN_SEARCH: 'beckn_search',
  BECKN_ON_SEARCH: 'beckn_on_search',
  BECKN_INIT: 'beckn_init',
  BECKN_ON_INIT: 'beckn_on_init',
  BECKN_CONFIRM: 'beckn_confirm',
  BECKN_ON_CONFIRM: 'beckn_on_confirm',
  PENDING: 'pending'
})

const mockOrderData = {
  date: '10/1/2025',
  orderId: '103',
  tradeId: '1104',
  energyBought: '10 kwh',
  rate: '7 ₹/units',
  preferences: ['Solar Power', 'Trusted Source']
}

const detailRows = [
  { label: 'Date', value: mockOrderData.date },
  { label: 'Order ID', value: mockOrderData.orderId },
  { label: 'Trade ID', value: mockOrderData.tradeId },
  { label: 'Energy Bought', value: mockOrderData.energyBought },
  { label: 'Rate', value: mockOrderData.rate }
]
const userCredentials = [
  {
    name: 'ID Proof',
    type: 'PDF',
    verifiedAt: '20 Oct 2024 at 11:30 am',
    isVerified: true
  },
  {
    name: 'Address Proof',
    type: 'PDF',
    verifiedAt: '20 Oct 2024 at 11:30 am',
    isVerified: true
  }
]

const mockTradeDetails = {
  orderId: '103',
  name: 'Solar Energy',
  price: 70,
  quantity: '10 kwh',
  date: '2021-06-21T12:11:00Z',
  status: 'pending',
  tradeId: '1104',
  preferencesTags: ['Solar Power', 'Trusted Source'],
  tradeEvents: [
    {
      id: 1,
      event_name: 'beckn_search',
      description: 'Search',
      createdAt: '2021-06-21T12:11:00Z'
    },
    {
      id: 2,
      event_name: 'beckn_on_search',
      description: 'Select',
      createdAt: '2021-06-21T12:21:00Z'
    },
    {
      id: 3,
      event_name: 'beckn_init',
      description: 'Received Cred for Verification',
      createdAt: '2021-06-21T12:31:00Z'
    },
    {
      id: 4,
      event_name: 'beckn_on_init',
      description: 'Cred Verified',
      createdAt: '2021-06-21T12:31:00Z'
    },
    {
      id: 5,
      event_name: 'beckn_confirm',
      description: 'init',
      createdAt: '2021-06-21T12:31:00Z'
    },
    {
      id: 6,
      event_name: 'pending',
      description: 'Pending',
      createdAt: '2021-06-21T12:31:00Z'
    }
  ]
}

const TradeDetails = () => {
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [isLoading, setIsLoading] = useState(false)
  const [tradeDetails, setTradeDetails] = useState<TradeMetaData>()

  const [role, setRole] = useState<ROLE>(ROLE.BUY)

  const getTradeDetailsById = async (id: string) => {
    const requestOptions = {
      method: 'GET',
      headers: { Authorization: `Bearer ${bearerToken}` },
      withCredentials: true
    }

    setIsLoading(true)

    await axios
      .get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/trade?id=${id}`, requestOptions)
      .then(response => {
        const result = response.data
        const tags: string[] = []
        if (result.trusted_source) {
          tags.push('Trusted Source')
        }
        if (result.cred_required) {
          tags.push('Solar Energy')
        }
        const tradeEvents = result.trade_events || []
        const lastEvent = tradeEvents[tradeEvents.length - 1]

        if (!lastEvent || lastEvent.event_name !== TRADDE_EVE_NUM.BECKN_ON_CONFIRM) {
          tradeEvents.push({
            id: tradeEvents.length + 1,
            event_name: TRADDE_EVE_NUM.PENDING,
            description: 'Pending',
            createdAt: new Date().toISOString()
          })
        }

        setTradeDetails({
          orderId: result.order?.id || null,
          name: result.item_name,
          price: result.price || 0,
          quantity: result.quantity,
          date: result.createdAt,
          status: result.status,
          tradeId: result.id,
          tradeEvents: result.trade_events,
          preferencesTags: tags
        })
      })
      .catch(error => {
        setIsLoading(false)
        console.error('Error fetching trade details by id:', error)
      })
  }

  useEffect(() => {
    const { id } = Router.query
    getTradeDetailsById(id as string)
  }, [])
  useEffect(() => {
    setTradeDetails(mockTradeDetails)
  }, [])
  const roleName = role === ROLE.BUY ? 'Producer' : 'Consumer'

  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
      pb={'20px'}
    >
      <OrderSummary
        detailRows={detailRows}
        preferences={mockOrderData.preferences}
      />
      <Box padding={'1rem 0.5rem'}>
        <Accordion
          accordionHeader={'History'}
          isDisabled={true}
          defaultIndex={0}
          className="trade-status"
        >
          <Divider />
          <Flex
            gap={'5px'}
            flexDirection={'column'}
            padding={'10px 20px'}
          >
            {false ? (
              <Box
                display={'grid'}
                alignContent={'center'}
              >
                <Loader size="md" />
              </Box>
            ) : (
              <Stack p={'10px 0px'}>
                {tradeDetails?.tradeEvents &&
                  tradeDetails?.tradeEvents?.map((data: any, index: number) => (
                    <OrderStatusProgress
                      key={index}
                      label={data.description}
                      statusTime={formatDate(data.createdAt, "do MMM yyyy',' hh:mm a")}
                      noLine={true}
                      lastElement={index === tradeDetails.tradeEvents.length - 1}
                      statusIcon={data.event_name === TRADDE_EVE_NUM.PENDING ? PendingIcon : null}
                    />
                  ))}
              </Stack>
            )}
          </Flex>
        </Accordion>
      </Box>
      <Stack>
        <UserDetails
          title={`${roleName} Details`} //based on Role (Consumer Credentials)
          name={{ text: 'Leela', icon: nameIcon }}
          mail={{ text: 'xxxxa.work@gmail.com', icon: emailIcon }}
          mobile={{ text: '+91 79XXXX6980', icon: CallphoneIcon }}
          dataTest={testIds.trade_details_UserDetail}
        />
      </Stack>
      <Stack>
        <UserCredentials userCredentials={userCredentials} />
      </Stack>
    </Box>
  )
}

export default TradeDetails
