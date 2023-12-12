import React from 'react'
import { Box } from '@chakra-ui/react'
import { FormField, Typography, Loader, Button } from '@beckn-ui/molecules'
import DetailsCard from './details-card'
import ItemDetails from './checkout-item-details'
import ShippingSection from './shipping-section'
import { CheckoutProps } from './checkout.types'
import PaymentDetails from './payment-details'

const Checkout: React.FC<CheckoutProps<FormField[]>> = ({
  schema: { items, loader, shipping, billing, payment, pageCTA },
  isLoading = false,
  hasInitResult = false
}) => {
  if (isLoading) return <Loader {...loader} />

  const { disabled, ...restButtonProps } = pageCTA

  return (
    <>
      <Box>
        <Box pb={'10px'}>
          <Typography
            variant="titleRegular"
            text={items.title}
          />
        </Box>

        <DetailsCard>
          {items.data.map(item => {
            return (
              <>
                <ItemDetails
                  title={item.title}
                  description={item.description}
                  quantity={item.quantity}
                  priceWithSymbol={item.priceWithSymbol}
                />
              </>
            )
          })}
        </DetailsCard>
        <ShippingSection {...shipping} />
        <ShippingSection {...billing} />

        {hasInitResult && (
          <>
            <Box pb={'10px'}>
              <Typography
                variant="titleRegular"
                text={payment.title}
              />
            </Box>
            <DetailsCard>
              <PaymentDetails {...payment.paymentDetails} />
            </DetailsCard>
          </>
        )}
        <Button
          {...restButtonProps}
          disabled={!hasInitResult}
        />
      </Box>
    </>
  )
}
export default Checkout
