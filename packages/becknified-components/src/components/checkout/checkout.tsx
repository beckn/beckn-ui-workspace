import React, { useState } from 'react'
import { Box, Divider, useBreakpoint } from '@chakra-ui/react'
import { FormField, Typography, Loader, Button, LoaderWithMessage } from '@beckn-ui/molecules'
import DetailsCard from './details-card'
import ItemDetails from './checkout-item-details'
import ShippingSection from './shipping-section'
import { CheckoutProps, ItemDetailProps, ShippingFormInitialValuesType } from './checkout.types'
import PaymentDetails from './payment-details'
import OrderOverview, { RentalItemProps } from './order-overview'

const Checkout: React.FC<CheckoutProps<FormField[]>> = ({
  schema: { items, loader, shipping, billing, payment, pageCTA },
  isLoading = false,
  hasInitResult = false,
  dataTestItemDetails = 'item-details',
  dataTestPaymentDetails = 'paymentDetails'
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
            text={items?.title || ''}
          />
        </Box>
        <Box className="overview-checkout">
          <DetailsCard>
            {items?.type === 'RENT_AND_HIRE' ? (
              <OrderOverview items={items.data as RentalItemProps[]} />
            ) : (
              (items?.data as ItemDetailProps[])?.map((item, i, arr) => (
                <div
                  key={i}
                  data-test={dataTestItemDetails}
                >
                  <ItemDetails
                    title={item.title}
                    description={item.description}
                    quantity={item.quantity}
                    price={item.price}
                    currency={item.currency}
                    image={item.image}
                  />
                  {arr.length > 1 && i !== arr.length - 1 && <Divider mb={'15px'} />}
                </div>
              ))
            )}
          </DetailsCard>
        </Box>
        {/* Shipping section */}
        <ShippingSection {...shipping} />

        {/* Billing Section */}
        {items?.type !== 'RENT_AND_HIRE' && billing && Object.keys(billing).length > 0 && (
          <ShippingSection {...billing} />
        )}

        {hasInitResult && (
          <Box data-test={dataTestPaymentDetails}>
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
            disabled={!hasInitResult || (!hasInitResult && !billing?.isChecked)}
          />
        </Box>
      </Box>
    </>
  )
}
export default Checkout
