import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { Router, useRouter } from 'next/router'
import { CheckoutProps, ShippingDetailsProps, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Box, Divider, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import ShippingSection from '@beckn-ui/becknified-components/src/components/checkout/shipping-section'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const CheckoutPage = () => {
  const { t, locale } = useLanguage()
  const [submittedDetails, setSubmittedDetails] = useState<ShippingDetailsProps>({
    name: 'Antoine Dubois',
    number: '0612345678',
    location: '15 Rue du Soleil, Paris, France',
    title: '75001'
  })
  const [detailsForm, setdetailsForm] = useState<ShippingFormInitialValuesType>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    pinCode: '75001'
  })
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box>
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
              text={'Assembly'}
            />
            <Typography
              variant="subTitleRegular"
              text={'€ 30,000'}
            />
          </Flex>
          <Box pb={'4px'}>
            <Typography
              variant="subTitleRegular"
              text={'RTAL Assembly Lines'}
            />
          </Box>
          <Box pb={'4px'}>
            <Typography
              variant="subTitleRegular"
              text={'Qty: 150'}
            />
          </Box>
          <Divider
            mt="10px"
            mb="10px"
          />
          <Flex
            pb={'15px'}
            pt="10px"
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography
              variant="subTitleSemibold"
              text={'Assembly'}
            />
            <Typography
              variant="subTitleRegular"
              text={'€ 30,000'}
            />
          </Flex>
          <Typography
            variant="subTitleRegular"
            text={'RTAL Assembly Lines'}
          />
        </DetailsCard>
        <ShippingSection
          sectionSubtitle={t.addShippingDetails}
          addButtonImage="./images/addShippingBtn.svg"
          showDetails={false}
          shippingDetails={{
            name: detailsForm.name,
            location: detailsForm.address,
            number: detailsForm.mobileNumber,
            title: t.shipping
          }}
          shippingForm={{
            onSubmit: () => console.log('jdkasd'),
            submitButton: { text: 'Save Shipping Details' },
            values: detailsForm,
            onChange: data => () => console.log('ajsdhasd')
          }}
        />
        <ShippingSection
          sectionSubtitle={t.addBillingDetails}
          addButtonImage="./images/addShippingBtn.svg"
          sectionTitle="Billing"
          formTitle="Add Billing Details"
          showDetails={false}
          shippingDetails={{
            name: detailsForm.name,
            location: detailsForm.address,
            number: detailsForm.mobileNumber,
            title: t.billing
          }}
          shippingForm={{
            onSubmit: () => console.log('jdkasd'),
            submitButton: { text: 'Save Billing Details' },
            values: detailsForm,
            onChange: data => () => console.log('ajsdhasd')
          }}
        />
        <DetailsCard>
          <Box pb={'15px'}>
            <Typography
              variant="titleSemibold"
              text={t.overviewofBillingDetails}
            />
          </Box>
          <PaymentDetails
            paymentBreakDown={{
              'Total Manufacturing Cost': `${t.currencySymbol} 999`,
              'Shipping Cost': `${t.currencySymbol} 999`,
              Taxes: `${t.currencySymbol} 999`
            }}
            totalText="Total"
            totalValueWithSymbol={`${t.currencySymbol} 999`}
          />
        </DetailsCard>
      </Box>
      <BecknButton
        children="Proceed to Payment"
        className="checkout_btn "
      />
      <BecknButton
        children="Cancel Order"
        variant="outline"
        className="checkout_btn"
      />
    </Box>
  )
}
export default CheckoutPage
