import React, { useState } from 'react'
import { Box, useBreakpoint } from '@chakra-ui/react'
import { FormField, Typography, Loader, Button, LoaderWithMessage } from '@beckn-ui/molecules'
import DetailsCard from './details-card'
import ItemDetails from './checkout-item-details'
import ShippingSection from './shipping-section'
import { CheckoutProps, ShippingFormInitialValuesType } from './checkout.types'
import PaymentDetails from './payment-details'
import { testIds } from '@shared/dataTestIds'

const Checkout: React.FC<CheckoutProps<FormField[]>> = ({
  schema: { items, loader, shipping, billing, payment, pageCTA },
  isLoading = false,
  hasInitResult = false
}) => {
  if (isLoading)
    return (
      <Box
        display="flex"
        height="calc(100vh - 160px)"
        justifyContent="center"
        alignItems={'center'}
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
            text={items?.title!}
          />
        </Box>

        <DetailsCard>
          {items?.data.map((item, i) => {
            return (
              <div
                key={i}
                data-test={testIds.item_details}
              >
                <ItemDetails
                  title={item.title}
                  description={item.description}
                  quantity={item.quantity}
                  price={item.price}
                  currency={item.currency}
                  image={item.image}
                />
              </div>
            )
          })}
        </DetailsCard>

        {/* Shipping section */}
        <ShippingSection
          {...shipping}
          dataTest={testIds.checkoutpage_shippingDetails}
        />

        {/* Billing Section */}
        <ShippingSection
          {...billing}
          dataTest={testIds.checkoutpage_billingDetails}
        />

        {hasInitResult && (
          <Box data-test={testIds.checkoutpage_paymentDetails}>
            <Box pb={'10px'}>
              <Typography
                variant="titleRegular"
                text={payment.title}
              />
            </Box>
            <DetailsCard>
              <PaymentDetails {...payment.paymentDetails} />
            </DetailsCard>
          </Box>
        )}
        <Box
          width={isLargeScreen ? '40%' : '100%'}
          margin="auto"
        >
          <Button
            {...restButtonProps}
            dataTest={testIds.checkoutpage_proceedToCheckout}
            disabled={!hasInitResult || (!hasInitResult && !billing.isChecked)}
          />
        </Box>
      </Box>
    </>
  )
}
export default Checkout
