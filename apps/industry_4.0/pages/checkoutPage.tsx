import React, { useEffect, useState } from 'react'
import axios from '../services/axios'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Box, Flex, useTheme } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import ShippingSection from '@beckn-ui/becknified-components/src/components/checkout/shipping-section'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { getPayloadForInitRequest, getPaymentBreakDown } from '@utils/checkout-utils'

import { useLanguage } from '../hooks/useLanguage'
import { AssemblyData, ParsedItemModel } from '../types/search.types'
import { SelectResponseModel } from '../types/select.types'
import { InitResponseModel } from '../types/init.types'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { testIds } from '@shared/dataTestIds'

const CheckoutPage = () => {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<ParsedItemModel | null>(null)
  const [selectResponse, setSelectResponse] = useState<SelectResponseModel[] | null>(null)
  const [isLoadingForInit, setIsLoadingForInit] = useState(false)
  const [initData, setInitData] = useState<InitResponseModel[]>([])
  const [showShippingDetails, setShowShippingDetails] = useState(false)
  const [showBillingDetails, setShowBillingDetails] = useState(false)
  const [error, setError] = useState('')
  const [assemblyDetails, setAssemblyDetails] = useState<AssemblyData | null>(null)
  const [detailsForm, setdetailsForm] = useState<ShippingFormInitialValuesType>({
    name: 'santosh kumar',
    mobileNumber: '6251423251',
    email: 'santosh.k@gmail.com',
    address: '151-e, janpath road, new delhi',
    pinCode: '110001'
  })

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'santosh kumar',
    mobileNumber: '6251423251',
    email: 'santosh.k@gmail.com',
    address: '151-e, janpath road, new delhi',
    pinCode: '110001'
  })
  const theme = useTheme()
  const color = theme.colors.primary[100]

  const [isBilling, setIsBilling] = useState(true)
  const [isChecked, setIsChecked] = useState(true)

  const router = useRouter()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('selectedItem') && localStorage.getItem('selectResponse')) {
      const parsedSelectedItem = JSON.parse(localStorage.getItem('selectedItem') as string)
      const parsedSelectResponse = JSON.parse(localStorage.getItem('selectResponse') as string)
      setSelectedProduct(parsedSelectedItem)
      setSelectResponse(parsedSelectResponse)
    }
  }, [])

  useEffect(() => {
    if (localStorage && localStorage.getItem('assemblyDetails')) {
      const parsedAssemblyDetails = JSON.parse(localStorage.getItem('assemblyDetails') as string)
      setAssemblyDetails(parsedAssemblyDetails)
    }
  }, [])

  if (!selectedProduct && !selectResponse) {
    return <></>
  }

  if (isLoadingForInit) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
        data-test={testIds.loadingIndicator}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.checkoutLoaderSubText}
        />
      </Box>
    )
  }

  console.log(error)

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
  } = selectResponse![0]
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
              dataTest={testIds.item_title}
            />
            <Typography
              variant="subTitleRegular"
              text={`${currency} ${value}`}
              dataTest={testIds.item_price}
            />
          </Flex>
          <Box pb={'4px'}>
            <Typography
              variant="subTitleRegular"
              text={name}
              dataTest={testIds.item_name}
            />
          </Box>
          <Box pb={'4px'}>
            <Typography
              variant="subTitleRegular"
              text={`Qty: ${assemblyDetails?.quantity}`}
              dataTest={testIds.item_quantity}
            />
          </Box>
        </DetailsCard>
        <ShippingSection
          dataTest={testIds.checkoutpage_shippingDetails}
          sectionSubtitle={t.addShippingDetails}
          addButtonImage="./images/addShippingBtn.svg"
          showDetails={showShippingDetails}
          color={color}
          shippingDetails={{
            name: detailsForm.name,
            location: detailsForm.address!,
            number: detailsForm.mobileNumber,
            title: t.shipping
          }}
          shippingForm={{
            onSubmit: async shippingData => {
              try {
                setIsLoadingForInit(true)
                const initPayload = await getPayloadForInitRequest(selectedProduct!, shippingData, billingFormData)
                axios
                  .post(`${apiUrl}/init`, initPayload)
                  .then(res => {
                    const initResponseData: InitResponseModel[] = res.data.data
                    const { email, mobileNumber, name, pinCode, address } = shippingData
                    setdetailsForm({
                      address,
                      email,
                      mobileNumber,
                      name,
                      pinCode
                    })

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
              } catch (error) {
                console.error(error)
              }
            },
            submitButton: { text: 'Save Shipping Details' },
            values: detailsForm,
            onChange: data => () => {
              return
            }
          }}
        />
        <ShippingSection
          dataTest={testIds.checkoutpage_billingDetails}
          sectionSubtitle={t.addBillingDetails}
          addButtonImage="./images/addShippingBtn.svg"
          sectionTitle="Billing"
          formTitle="Add Billing Details"
          showDetails={showBillingDetails}
          isBilling={isBilling}
          isChecked={isChecked}
          onCheckChange={() => {
            setIsChecked(false)
          }}
          color={color}
          shippingDetails={{
            name: billingFormData.name,
            location: billingFormData.address!,
            number: billingFormData.mobileNumber,
            title: t.billing
          }}
          shippingForm={{
            onSubmit: async billingData => {
              try {
                setIsLoadingForInit(true)
                const initPayload = await getPayloadForInitRequest(selectedProduct!, detailsForm, billingData)
                axios
                  .post(`${apiUrl}/init`, initPayload)
                  .then(res => {
                    const initResponseData: InitResponseModel[] = res.data.data
                    const { email, mobileNumber, name, pinCode, address } = billingData
                    setBillingFormData({
                      address,
                      email,
                      mobileNumber,
                      name,
                      pinCode
                    })
                    localStorage.setItem('initResult', JSON.stringify(initResponseData))
                    setInitData(initResponseData)
                    setIsLoadingForInit(false)
                    setShowBillingDetails(true)
                    setIsBilling(false)
                    setIsChecked(true)
                  })
                  .catch(e => {
                    setError(e.message)
                    setIsLoadingForInit(false)
                    console.error(e)
                  })
              } catch (error) {
                console.error(error)
              }
            },
            submitButton: { text: 'Save Billing Details' },
            values: billingFormData,
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
              dataTest={testIds.checkoutpage_paymentDetails}
              paymentBreakDown={getPaymentBreakDown(initData).breakUpMap}
              totalText={t.total}
              totalValueWithCurrency={getPaymentBreakDown(initData).totalPricewithCurrent}
            />
          </DetailsCard>
        )}
      </Box>
      <Box m={'20px 0px'}>
        <BecknButton
          disabled={!initData.length}
          dataTest={testIds.checkoutpage_proceedToCheckout}
          children="Proceed to Payment"
          className="checkout_btn "
          handleClick={() => router.push('/paymentMode')}
        />
        <BecknButton
          dataTest={testIds.checkoutpage_cancelOrder}
          children="Cancel Order"
          variant="outline"
          className="checkout_btn"
          handleClick={() => router.push('/')}
        />
      </Box>
    </Box>
  )
}
export default CheckoutPage
