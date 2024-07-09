import React from 'react'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Accordion, Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import { formatTimestamp, getPaymentBreakDown } from '../../../utils'
import { OrderSummaryProps } from '../orderDetails.types'
import useResponsive from '@beckn-ui/becknified-components/src/hooks/useResponsive'
import DetailsPanel from './DetailsPanel'
import CallphoneIcon from '../../../../public/images/CallphoneIcon.svg'
import locationIcon from '../../../../public/images/locationIcon.svg'
import nameIcon from '../../../../public/images/nameIcon.svg'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'

const OrderSummary = (props: OrderSummaryProps) => {
  const {
    t,
    orderDetails: { shipping, billing, statusData }
  } = props

  const { isDesktop } = useResponsive()

  return (
    <>
      {/* shipping details */}
      <DetailsPanel
        title={t('shipping')}
        name={{ text: shipping.name, icon: nameIcon }}
        address={{ text: shipping.address, icon: locationIcon }}
        mobile={{ text: shipping.phone, icon: CallphoneIcon }}
      />

      {/* billing details */}
      <DetailsPanel
        title={t('billing')}
        name={{ text: billing.name, icon: nameIcon }}
        address={{ text: billing.address, icon: locationIcon }}
        mobile={{ text: billing.phone, icon: CallphoneIcon }}
      />

      {/* payment details */}
      {isDesktop && (
        <Box>
          <PaymentDetails
            title="Payment"
            hasBoxShadow={true}
            paymentBreakDown={getPaymentBreakDown(statusData).breakUpMap}
            totalText="Total"
            totalValueWithCurrency={getPaymentBreakDown(statusData).totalPricewithCurrent}
          />
        </Box>
      )}
      {!isDesktop && (
        <Accordion accordionHeader={t('payment')}>
          <Box
            pl={'14px'}
            pr={'11px'}
            pb={'11px'}
            pt={'6px'}
          >
            <PaymentDetails
              paymentBreakDown={getPaymentBreakDown(statusData).breakUpMap}
              totalText="Total"
              totalValueWithCurrency={getPaymentBreakDown(statusData).totalPricewithCurrent}
            />
          </Box>
        </Accordion>
      )}
    </>
  )
}

export default OrderSummary
