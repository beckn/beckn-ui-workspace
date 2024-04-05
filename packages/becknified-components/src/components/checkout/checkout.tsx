import React, { useState } from 'react'
import { Box, useBreakpoint } from '@chakra-ui/react'
import { FormField, Typography, Loader, Button, LoaderWithMessage } from '@beckn-ui/molecules'
import DetailsCard from './details-card'
import ItemDetails from './checkout-item-details'
import ShippingSection from './shipping-section'
import { CheckoutProps, ShippingFormInitialValuesType } from './checkout.types'
import PaymentDetails from './payment-details'

const Checkout: React.FC<CheckoutProps<FormField[]>> = ({
  schema: { items, loader, shipping, billing, payment, pageCTA },
  isLoading = false,
  hasInitResult = false
}) => {
  if (isLoading)
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        transform="translateY(-20%)"
      >
        <Loader {...loader} />
      </Box>
    )

  const { disabled, ...restButtonProps } = pageCTA

  const [shippingData, setShippingData] = useState<ShippingFormInitialValuesType>(
    shipping.shippingForm.values || ({} as ShippingFormInitialValuesType)
  )

  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md']
  const isLargeScreen = !mobileBreakpoints.includes(breakpoint)

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
                  image={item.image}
                />
              </>
            )
          })}
        </DetailsCard>

        {/* Shipping section */}
        <ShippingSection {...shipping} />

        {/* Billing Section */}
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
        <Box
          width={isLargeScreen ? '40%' : '100%'}
          margin="auto"
        >
          <Button
            {...restButtonProps}
            disabled={!hasInitResult || !billing.isChecked}
          />
        </Box>
      </Box>
    </>
  )
}
export default Checkout
