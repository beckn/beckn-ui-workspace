import React, { useEffect, useState } from 'react'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import { DetailCard } from '@beckn-ui/becknified-components'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { Box, Flex } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { formatTimestamp, getPaymentBreakDown, StatusResponseModel } from '@beckn-ui/common'

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

  const { created_at } = statusData[0].message.order

  const filteredOrder = statusData.filter(res => {
    const { state } = res.message.order.fulfillments[0]
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
            text={formatTimestamp(created_at)}
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
    </Box>
  )
}

export default invoiceDetails
