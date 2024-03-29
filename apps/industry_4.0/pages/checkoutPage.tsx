import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Box, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import ShippingSection from '@beckn-ui/becknified-components/src/components/checkout/shipping-section'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { getPayloadForInitRequest, getPayloadForSelectRequest, getPaymentBreakDown } from '@utils/checkout-utils'

import { useLanguage } from '../hooks/useLanguage'
import { AssemblyData, ParsedItemModel } from '../types/search.types'
import { SelectResponseModel } from '../types/select.types'
import { InitResponseModel } from '../types/init.types'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'

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
  const [assemblyDetails, setAssemblyDetails] = useState<AssemblyData | null>(null)
  const [detailsForm, setdetailsForm] = useState<ShippingFormInitialValuesType>({
    name: 'Rahul Raj',
    mobileNumber: '9845898458',
    email: 'rahul.raj@becknprotocol.io',
    address: '43, Residency Road, Bengaluru',
    pinCode: '560025'
  })

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'Rahul Raj',
    mobileNumber: '9845898458',
    email: 'rahul.raj@becknprotocol.io',
    address: '43, Residency Road, Bengaluru',
    pinCode: '560025'
  })

  const [isBilling, setIsBilling] = useState(true)

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
    if (localStorage && localStorage.getItem('assemblyDetails')) {
      const parsedAssemblyDetails = JSON.parse(localStorage.getItem('assemblyDetails') as string)
      setAssemblyDetails(parsedAssemblyDetails)
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
            {/* <Typography
              variant="subTitleSemibold"
              text={t.assembly}
            /> */}
            <Typography
              variant="subTitleRegular"
              text={name}
            />
            <Typography
              variant="subTitleRegular"
              text={`₹ ${value}`}
            />
          </Flex>
          {/* <Box pb={'4px'}>
            <Typography
              variant="subTitleRegular"
              text={name}
            />
          </Box> */}
          {/* <Box pb={'4px'}>
            <Typography
              variant="subTitleRegular"
              text={`Qty: ${assemblyDetails?.quantity}`}
            />
          </Box> */}
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
            onSubmit: async shippingData => {
              try {
                setIsLoadingForInit(true)
                const initPayload = await getPayloadForInitRequest(selectedProduct, shippingData, billingFormData)
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
          sectionSubtitle={t.addBillingDetails}
          addButtonImage="./images/addShippingBtn.svg"
          sectionTitle="Billing"
          formTitle="Add Billing Details"
          isBilling={isBilling}
          showDetails={showBillingDetails}
          shippingDetails={{
            name: billingFormData.name,
            location: billingFormData.address,
            number: billingFormData.mobileNumber,
            title: t.billing
          }}
          shippingForm={{
            onSubmit: async billingData => {
              try {
                setIsLoadingForInit(true)
                const initPayload = await getPayloadForInitRequest(selectedProduct, detailsForm, billingData)
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
      <Box m={'20px 0px'}>
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
    </Box>
  )
}
export default CheckoutPage
