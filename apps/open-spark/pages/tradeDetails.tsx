import React, { useEffect, useRef, useState } from 'react'
import Router from 'next/router'
import Cookies from 'js-cookie'
import axios from '@services/axios'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { AuthRootState } from '@store/auth-slice'
import { useSelector } from 'react-redux'
import { Accordion, Loader, Typography } from '@beckn-ui/molecules'
import { formatDate } from '@beckn-ui/common'
import CurrentTrade from '@components/currentTrade/CurrentTrade'
import { Box, Divider, Flex, Stack, Tag, TagLabel } from '@chakra-ui/react'
import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import PendingIcon from '@public/images/pending.svg'
import { testIds } from '@shared/dataTestIds'

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

  return (
    <Box
      margin={'0 auto'}
      maxW={['100%', '100%', '40rem', '40rem']}
      className="hideScroll"
      maxH={'calc(100vh - 80px)'}
      overflowY="scroll"
    >
      <Flex
        gap="1rem"
        flexDirection={'column'}
      >
        <Typography
          text={`Date: ${tradeDetails?.date ? formatDate(tradeDetails?.date!, 'dd/MM/yyyy') : ''}`}
          fontSize="16px"
          fontWeight="500"
          dataTest={testIds.trade_details_date}
        />
        <CurrentTrade
          data={[
            {
              name: tradeDetails?.name!,
              label: role === ROLE.BUY ? 'Energy Bought' : 'Energy Sold',
              value: tradeDetails?.quantity! || '0',
              disabled: true,
              symbol: '(KWh)'
            },
            ...(role !== ROLE.BUY
              ? [
                  {
                    name: tradeDetails?.name!,
                    label: 'Price',
                    value: tradeDetails?.price.toString()!,
                    disabled: true,
                    symbol: '₹/units'
                  }
                ]
              : [])
          ]}
        />

        {tradeDetails?.preferencesTags && tradeDetails?.preferencesTags?.length > 0 && (
          <Box mt={'-2rem'}>
            <Typography
              text="Preferences"
              fontSize="15"
              fontWeight="600"
              sx={{ marginBottom: '10px' }}
            />
            <Flex
              gap={'10px'}
              flexWrap={'wrap'}
            >
              {tradeDetails?.preferencesTags?.map((tag, index) => (
                <Tag
                  key={index}
                  borderRadius="md"
                  variant="outline"
                  colorScheme="gray"
                  padding={'8px'}
                >
                  <TagLabel>{tag}</TagLabel>
                </Tag>
              ))}
            </Flex>
          </Box>
        )}
        <Flex
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          {tradeDetails?.orderId && (
            <Flex gap="5px">
              <Typography
                text={`Order ID:`}
                fontSize="15"
                fontWeight="600"
              />
              <Typography
                text={`${tradeDetails?.orderId}`}
                fontSize="15"
              />
            </Flex>
          )}
          {tradeDetails?.tradeId && (
            <Flex gap="5px">
              <Typography
                text={`Trade ID:`}
                fontSize="15"
                fontWeight="600"
                dataTest={testIds.trade_details_Id}
              />
              <Typography
                text={`${tradeDetails?.tradeId}`}
                fontSize="15"
              />
            </Flex>
          )}
        </Flex>
      </Flex>
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
    </Box>
  )
}

export default TradeDetails
