import React from 'react'
import { Box, Divider, useBreakpoint } from '@chakra-ui/react'
import { FormField, Typography, Loader, Button } from '@beckn-ui/molecules'
import DetailsCard from './details-card'
import ItemDetails from './checkout-item-details'
import ShippingSection from './shipping-section'
import { CheckoutProps, ItemDetailProps } from './checkout.types'
// import PaymentDetails from './payment-details'
import OrderOverview, { RentalItemProps } from './order-overview'
import { formatCurrency } from '../product-price/product-price'
const Checkout: React.FC<CheckoutProps<FormField[]>> = ({
  schema: { items, loader, shipping, billing, payment, pageCTA },
  isLoading = false,
  hasInitResult = false,
  dataTestItemDetails = 'item-details'
  // dataTestPaymentDetails = 'paymentDetails'
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

  const { ...restButtonProps } = pageCTA

  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md']
  const isLargeScreen = !mobileBreakpoints.includes(breakpoint)

  return (
    <>
      <Box paddingBottom={'5rem'}>
        <Box pb={'10px'}>
          <Typography
            variant="titleRegular"
            text={items?.title || ''}
          />
        </Box>
        <Box className="overview-checkout">
          {items?.type === 'RENT_AND_HIRE' ? (
            <DetailsCard>
              <OrderOverview items={items.data as RentalItemProps[]} />
            </DetailsCard>
          ) : (
            (items?.data as ItemDetailProps[])?.map((item, i, arr) => (
              <>
                <DetailsCard key={i}>
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
                      breakUp={item.breakUp}
                    />
                  </div>
                </DetailsCard>
                {arr.length > 1 && i !== arr.length - 1 && (
                  <Divider
                    color={'#BFBFBF'}
                    margin={'15px -20px'}
                    border="0.5px solid #BFBFBF"
                    opacity={0.5}
                  />
                )}
              </>
            ))
          )}
        </Box>
        {/* Shipping section */}
        <ShippingSection {...shipping!} />

        {/* Billing Section */}
        {items?.type !== 'RENT_AND_HIRE' && billing && Object.keys(billing).length > 0 && (
          <ShippingSection {...billing} />
        )}

        {/* {hasInitResult && ( 
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
        )} */}
      </Box>
      <Box
        position={'fixed'}
        bottom={0}
        left={0}
        right={0}
        width={isLargeScreen ? '40%' : '90%'}
        margin="auto"
        bg="white"
        borderRadius={'12px'}
        boxShadow={
          '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 8px 24px 0px rgba(0, 0, 0, 0.12)'
        }
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginBottom={'10px'}
        gap={'2rem'}
      >
        {Number(payment?.paymentDetails?.totalValueWithCurrency?.value) > 0 && (
          <Box>
            <Box
              fontWeight="500"
              fontSize="12px"
              color="#000000"
              whiteSpace={'nowrap'}
            >
              Total Amount
            </Box>
            <Box
              fontWeight="700"
              fontSize="15px"
              color={'secondary.100'}
              lineHeight={1.2}
              whiteSpace={'nowrap'}
            >
              {formatCurrency(
                Number(payment.paymentDetails.totalValueWithCurrency.value),
                payment.paymentDetails.totalValueWithCurrency.currency
              ) || '-'}
            </Box>
          </Box>
        )}
        <Button
          {...restButtonProps}
          text={'Proceed to pay'}
          fullWidth={true}
          disabled={
            !hasInitResult ||
            (!hasInitResult && !billing?.isChecked) ||
            !payment?.paymentDetails?.totalValueWithCurrency?.value ||
            !payment?.paymentDetails?.totalValueWithCurrency?.currency
          }
          sx={{ marginBottom: '0px', fontSize: '15px', padding: '10px 20px' }}
        />
      </Box>
    </>
  )
}
export default Checkout
