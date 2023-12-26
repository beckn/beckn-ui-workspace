import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { ShippingDetailsProps, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Box, Flex, Text, useTheme } from '@chakra-ui/react'
import { Loader, Typography } from '@beckn-ui/molecules'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import ShippingSection from '@beckn-ui/becknified-components/src/components/checkout/shipping-section'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { ParsedItemModel } from '../types/search.types'
import { getPayloadForInitRequest, getPayloadForSelectRequest, getPaymentBreakDown } from '@utils/checkout-utils'
import axios from 'axios'
import { SelectResponseModel } from '../types/select.types'
import { useRouter } from 'next/router'
import { InitResponseModel } from '../types/init.types'

const CheckoutPage = () => {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<ParsedItemModel | null>(null)
  const [isLoadingForSelect, setIsLoadingForSelect] = useState(true)
  const [isLoadingForInit, setIsLoadingForInit] = useState(false)
  const [selectData, setSelectData] = useState<SelectResponseModel[]>([])
  const [initData, setInitData] = useState<InitResponseModel[]>([])
  const [showShippingDetails, setShowShippingDetails] = useState(false)
  const [showBillingDetails, setShowBillingDetails] = useState(false)
  const [error, setError] = useState('')
  const [detailsForm, setdetailsForm] = useState<ShippingFormInitialValuesType>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    pinCode: '750013'
  })

  const router = useRouter()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchSelectData = (selectPayload: any) => {
    axios
      .post(`${apiUrl}/select`, selectPayload)
      .then(res => {
        setSelectData(res.data.data)
        setIsLoadingForSelect(false)
      })
      .catch(e => {
        setError(e.message)
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

  if (isLoadingForSelect || isLoadingForInit) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader>
          <Box
            mt={'13px'}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
          >
            <Text
              as={Typography}
              fontWeight={600}
              fontSize={'15px'}
              text={t.pleaseWait}
            />

            <Text
              as={Typography}
              text={t.checkoutLoaderSubText}
              textAlign={'center'}
              alignSelf={'center'}
              fontWeight={400}
              fontSize={'15px'}
            />
          </Box>
        </Loader>
      </Box>
    )
  }

  if (error.length) {
    return (
      <Box
        height={'60vh'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Typography text={error} />
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
      mt={'20px'}
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
          showDetails={showShippingDetails}
          shippingDetails={{
            name: detailsForm.name,
            location: detailsForm.address,
            number: detailsForm.mobileNumber,
            title: t.shipping
          }}
          shippingForm={{
            onSubmit: data => {
              setIsLoadingForInit(true)
              const initPayload = getPayloadForInitRequest(selectedProduct, data)
              axios
                .post(`${apiUrl}/init`, initPayload)
                .then(res => {
                  const initResponseData = res.data.data
                  localStorage.setItem('initResult', JSON.stringify(initResponseData))
                  setInitData(initResponseData)
                  setIsLoadingForInit(false)
                  setShowShippingDetails(true)
                })
                .catch(e => {
                  setError(e.message)
                  setIsLoadingForInit(false)
                  console.error(e)
                })
            },
            submitButton: { text: 'Save Shipping Details' },
            values: detailsForm,
            onChange: data => () => {
              return
            }
          }}
        />
        <ShippingSection
          sectionSubtitle={t.addBillingDetails}
          addButtonImage="./images/addShippingBtn.svg"
          sectionTitle="Billing"
          formTitle="Add Billing Details"
          isBilling={true}
          showDetails={showBillingDetails}
          shippingDetails={{
            name: detailsForm.name,
            location: detailsForm.address,
            number: detailsForm.mobileNumber,
            title: t.billing
          }}
          shippingForm={{
            onSubmit: data => setShowBillingDetails(true),
            submitButton: { text: 'Save Billing Details' },
            values: detailsForm,
            onChange: data => () => {
              return
            }
          }}
        />
        {initData.length > 0 && (
          <DetailsCard>
            <Box pb={'15px'}>
              <Typography
                variant="titleSemibold"
                text={t.overviewofBillingDetails}
              />
            </Box>
            <PaymentDetails
              paymentBreakDown={getPaymentBreakDown(initData).breakUpMap}
              totalText={t.total}
              totalValueWithSymbol={getPaymentBreakDown(initData).totalPricewithCurrent}
            />
          </DetailsCard>
        )}
      </Box>
      <BecknButton
        disabled={!initData.length}
        children="Proceed to Payment"
        className="checkout_btn "
        handleClick={() => router.push('/paymentMode')}
      />
      <BecknButton
        children="Cancel Order"
        variant="outline"
        className="checkout_btn"
        handleClick={() => router.push('/homePage')}
      />
    </Box>
  )
}
export default CheckoutPage
