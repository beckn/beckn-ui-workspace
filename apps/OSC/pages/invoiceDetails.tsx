import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import React, { useEffect, useState } from 'react'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import {DetailCard} from '@beckn-ui/becknified-components'
import Accordion from '@beckn-ui/molecules/src/components/accordion/Accordion'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { Box, Flex, HStack, Stack } from '@chakra-ui/react'
import Qrcode from '@components/qrCode/Qrcode'
import { useLanguage } from '@hooks/useLanguage'
import { getPaymentBreakDown } from '@utils/checkout-utils'
import { StatusResponseModel } from '../types/status.types'
import { formatTimestamp } from '@utils/confirm-utils'

const invoiceDetails = () => {
  const [statusData, setStatusData] = useState<StatusResponseModel[]>([])

  useEffect(() => {
    if (localStorage && localStorage.getItem('statusResponse')) {
      const parsedStatusResponse = JSON.parse(localStorage.getItem('statusResponse') as string)
      setStatusData(parsedStatusResponse)
    }
  }, [])

  if (!statusData.length) {
    return <></>
  }

  const {
    message: {
      order: {
        quote: {
          price: { currency, value }
        },
        items
      }
    },
    context:{timestamp}
  } = statusData[0]

  const { name } = items

  const filteredOrder = statusData.filter(res => {
    const {state} = res.message.order.fulfillments[0]
    state && res.message.order.fulfillments[0].state.descriptor.short_desc === 'Delivered'
  })

  const { t } = useLanguage()
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <DetailCard>
        <Flex
          pt={'unset'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            variant="subTitleRegular"
            text={t.placedAt}
          />
          <Typography
            variant="subTitleRegular"
            text={formatTimestamp(timestamp)}
          />
        </Flex>
        <Box pt={4}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              variant="subTitleRegular"
              text={t.ordersFulfilled}
            />
            <Typography
              variant="subTitleRegular"
              text={`${filteredOrder.length} of ${statusData.length}`}
            />
          </Flex>
        </Box>
      </DetailCard>
      <DetailCard>
        <Box pb={'15px'}>
          <Typography
            variant="titleSemibold"
            text={t.payment}
          />
        </Box>
        <PaymentDetails
          paymentBreakDown={getPaymentBreakDown(statusData).breakUpMap}
          totalText="Total"
          totalValueWithCurrency={getPaymentBreakDown(statusData).totalPricewithCurrent}
        />
      </DetailCard>

      <Accordion accordionHeader={t.openInWallet}>
        <HStack
          justifyContent={'center'}
          alignItems={'center'}
          pb={'20px'}
        >
          <Qrcode value={'https://odr-dev.becknprotocol.io/'} />
        </HStack>
      </Accordion>

      <Accordion accordionHeader={t.viewJSON}>
        <HStack
          justifyContent={'center'}
          alignItems={'center'}
          pb={'20px'}
        >
          <Qrcode value={'https://odr-dev.becknprotocol.io/'} />
        </HStack>
      </Accordion>
    </Box>
  )
}

export default invoiceDetails
