import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { ShippingDetailsProps, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Loader, Typography } from '@beckn-ui/molecules'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import ShippingSection from '@beckn-ui/becknified-components/src/components/checkout/shipping-section'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { ParsedItemModel } from '../types/search.types'
import { getPayloadForInitRequest, getPayloadForSelectRequest } from '@utils/checkout-utils'
import axios from 'axios'
import { SelectResponseModel } from '../types/select.types'

const CheckoutPage = () => {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<ParsedItemModel | null>(null)
  const [isLoadingForSelect, setIsLoadingForSelect] = useState(true)
  const [selectData, setSelectData] = useState<SelectResponseModel[]>([])
  const [submittedDetails, setSubmittedDetails] = useState<ShippingDetailsProps>({
    name: 'Antoine Dubois',
    number: '0612345678',
    location: '15 Rue du Soleil, Paris, France',
    title: '750013'
  })
  const [detailsForm, setdetailsForm] = useState<ShippingFormInitialValuesType>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    pinCode: '750013'
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchSelectData = (selectPayload: any) => {
    axios
      .post(`${apiUrl}/select`, selectPayload)
      .then(res => {
        setSelectData(res.data.data)
        setIsLoadingForSelect(false)
      })
      .catch(e => {
        console.error(e)
        setIsLoadingForSelect(false)
      })
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem('selectedItem')) {
      const parsedSelectedItem = JSON.parse(localStorage.getItem('selectedItem') as string)
      setSelectedProduct(parsedSelectedItem)
    }
  }, [])

  useEffect(() => {
    if (selectedProduct) {
      const selectPayload = getPayloadForSelectRequest(selectedProduct)
      fetchSelectData(selectPayload)
    }
  }, [selectedProduct])

  if (!selectedProduct) {
    return <></>
  }

  if (isLoadingForSelect) {
    return (
      <Box
        height={'calc(100vh - 300px)'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Loader>
          <Box
            mt={'13px'}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
          >
            <Text fontWeight={700}>{t.catalogLoader}</Text>
            <Text>{t.catalogSubLoader}</Text>
          </Box>
        </Loader>
      </Box>
    )
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
  } = selectData[0]
  const { name } = items[0]

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
            onSubmit: data => {
              const initPayload = getPayloadForInitRequest(selectedProduct)
              axios
                .post(`${apiUrl}/init`, initPayload)
                .then(res => console.log(res))
                .catch(e => console.error(e))
            },
            submitButton: { text: 'Save Shipping Details' },
            values: detailsForm,
            onChange: data => () => console.log('ajsdhasd', data)
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
            onSubmit: data => console.log('form data in the billing', data),
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
