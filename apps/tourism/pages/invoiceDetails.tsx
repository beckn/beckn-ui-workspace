import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import React, { useEffect, useState } from 'react'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import Accordion from '@beckn-ui/molecules/src/components/accordion/Accordion'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { Box, Flex, HStack, Stack } from '@chakra-ui/react'
import Qrcode from '@components/qrCode/Qrcode'
import { useLanguage } from '@hooks/useLanguage'
import { getPaymentBreakDown } from '@utils/checkout-utils'
import { StatusResponseModel } from '../types/status.types'

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
    }
  } = statusData[0]

  const { name } = items

  const { t } = useLanguage()
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <DetailsCard>
        <Box pb={'15px'}>
          <Typography
            variant="titleSemibold"
            text={t.orderOverview}
          />
        </Box>
        <Flex
          pb={'4px'}
          justifyContent={'space-between'}
          alignItems="center"
        >
          <Typography
            variant="subTitleSemibold"
            text={t.assembly}
          />
          <Typography
            variant="subTitleRegular"
            text={`${currency} ${value}`}
          />
        </Flex>
        <Box pb={'4px'}>
          <Typography
            variant="subTitleRegular"
            text={name}
          />
        </Box>
      </DetailsCard>
      <DetailsCard>
        <Box pb={'15px'}>
          <Typography
            variant="titleSemibold"
            text={t.payment}
          />
        </Box>
        <PaymentDetails
          paymentBreakDown={getPaymentBreakDown(statusData).breakUpMap}
          totalText="Total"
          totalValueWithSymbol={getPaymentBreakDown(statusData).totalPricewithCurrent}
        />
      </DetailsCard>

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
