import React, { useEffect, useState } from 'react'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import { DetailCard } from '@beckn-ui/becknified-components'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { Box, Flex } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { formatTimestamp, getPaymentBreakDown } from '@beckn-ui/common/src/utils'
import { StatusResponseModel } from '@beckn-ui/common/lib/types'
import { testIds } from '@shared/dataTestIds'

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
            dataTest={testIds.orderDetailspage_productPlacedAt}
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
              dataTest={testIds.orderDetailspage_invoice_orderFullfilled}
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
          dataTest={testIds.orderDetailspage_paymentDetails}
          totalValueWithCurrency={getPaymentBreakDown(statusData).totalPricewithCurrent}
        />
      </DetailCard>

      {/* <Accordion accordionHeader={t.openInWallet}>
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
      </Accordion> */}
    </Box>
  )
}

export default invoiceDetails
