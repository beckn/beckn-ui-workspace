import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Stack, Checkbox, useToast, useTheme } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'

import { CartItemForRequest, DataPerBpp, ICartRootState, TransactionIdRootState } from '@lib/types/cart'
import {
  getInitPayload,
  areShippingAndBillingDetailsSame,
  getPayloadForInitRequest,
  getSubTotalAndDeliveryCharges
} from '@components/checkout/checkout.utils'
import useRequest from '../hooks/useRequest'
import { CustomToast } from '@components/signIn/SignIn'
import { useInitMutation } from '@services/init'
import { responseDataActions } from '../store/responseData-slice'

import { Checkout } from '@beckn-ui/becknified-components'

import { Router, useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { CheckoutRootState, checkoutActions } from '@store/checkout-slice'
import { cartActions } from '@store/cart-slice'
import { isEmpty } from '@utils/common-utils'
import { getSelectPayload } from '@components/cart/cart.utils'
import { useSelectMutation } from '@services/select'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}

export const currencyMap = {
  EUR: '€',
  INR: '₹',
  USD: '$'
}

const CheckoutPage = () => {
  const [formData, setFormData] = useState<ShippingFormInitialValuesType>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    pinCode: '201002'
  })

  const toast = useToast()

  const [submittedDetails, setSubmittedDetails] = useState<ShippingFormInitialValuesType>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    pinCode: '201002'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    pinCode: '75001'
  })
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()

  const [fetchQuotes, { isLoading: isSelectLoading, data, isError: isSelectError }] = useSelectMutation()
  const { t, locale } = useLanguage()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  console.log(selectResponse)

  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)

  useEffect(() => {
    fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
  }, [totalQuantity])

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem('userPhone')) {
        const copiedFormData = structuredClone(formData)
        const copiedBillingFormData = structuredClone(billingFormData)

        copiedFormData.mobileNumber = localStorage.getItem('userPhone') as string
        copiedBillingFormData.mobileNumber = localStorage.getItem('userPhone') as string

        setFormData(copiedFormData)
        setBillingFormData(copiedBillingFormData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isBillingSameRedux) {
      setBillingFormData(submittedDetails)
    }
  }, [isBillingSameRedux])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (localStorage.getItem('billingAddress')) {
        setBillingFormData(JSON.parse(localStorage.getItem('billingAddress') as string))
      }
    }
  }, [])

  useEffect(() => {
    const shippingAddressComplete = Object.values(formData).every(value => value.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(formData))
    }
  }, [formData])

  useEffect(() => {
    const isBillingAddressComplete = Object.values(billingFormData).every(value => value.length > 0)

    if (isBillingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('billingAddress', JSON.stringify(billingFormData))
    }
    setIsBillingAddressSameAsShippingAddress(
      areShippingAndBillingDetailsSame(isBillingAddressComplete, formData, billingFormData)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingFormData])

  // useEffect(()=>{
  //   setIsBillingSame(isBillingSameRedux)
  // },[])

  const formSubmitHandler = (data: any) => {
    if (data) {
      getInitPayload(submittedDetails, billingFormData, selectResponse).then(res => {
        return initialize(res)
      })
      // TODO :_ To check this again

      // if (isBillingAddressSameAsShippingAddress) {
      //   const copiedFormData = structuredClone(data);
      //   setBillingFormData(copiedFormData);
      // }

      // const cartItemsPerBppPerProvider: DataPerBpp = getCartItemsPerBpp(cartItems as CartItemForRequest[])

      // const payLoadForInitRequest = getPayloadForInitRequest(
      //   cartItemsPerBppPerProvider,
      //   transactionId,
      //   data,
      //   billingFormData
      // )
      // initRequest.fetchData(`${apiUrl}/client/v2/initialize_order`, 'POST', payLoadForInitRequest)
    }
  }

  const isInitResultPresent = () => {
    return !!initResponse && initResponse.length > 0
  }

  const createPaymentBreakdownMap = () => {
    const paymentBreakdownMap = {}
    if (isInitResultPresent()) {
      initResponse[0].message.order.quote.breakup.forEach(breakup => {
        paymentBreakdownMap[breakup.title] = {
          value: breakup.price.value,
          currency: breakup.price.currency
        }
      })
    }
    return paymentBreakdownMap
  }

  useEffect(() => {
    if (isError) {
      toast({
        render: () => (
          <CustomToast
            title="Error!"
            message="Unable to proceed with init request"
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  }, [isError])

  if (isSelectLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingSubText=""
          loadingText=""
        />
      </Box>
    )
  }

  return (
    <>
      {/* start Item Details */}
      <Checkout
        schema={{
          items: {
            title: 'Items',
            data: cartItems.map(singleItem => ({
              title: singleItem.name,
              description: singleItem.short_desc,
              quantity: singleItem.quantity,
              // priceWithSymbol: `${currencyMap[singleItem.price.currency]}${singleItem.totalPrice}`,
              price: singleItem.totalPrice,
              currency: singleItem.price.currency,
              image: singleItem.images[0].url
            }))
          },
          shipping: {
            showDetails: isInitResultPresent(),
            sectionSubtitle: 'Add Traveller Details',
            color: bgColorOfSecondary,
            formTitle: 'Add Traveller Details',
            sectionTitle: 'Traveller Details',
            shippingDetails: {
              name: submittedDetails.name,
              location: submittedDetails.address,
              number: submittedDetails.mobileNumber,
              title: 'Traveller Details'
            },
            shippingForm: {
              onSubmit: formSubmitHandler,
              submitButton: { text: 'Save Traveller Details' },
              values: formData,
              onChange: data => setSubmittedDetails(data)
            }
          },
          billing: {
            sectionSubtitle: 'Add Billing Details',
            sectionTitle: 'Billing',
            formTitle: 'Add Billing Details',
            color: bgColorOfSecondary,
            isBilling: true,
            isChecked: isBillingSameRedux,
            onCheckChange: () => {
              // setIsBillingSame(!isBillingSame)
              dispatch(checkoutActions.setIsBillingSame({ isBillingSame: !isBillingSameRedux }))
            },
            showDetails: isInitResultPresent() && !isEmpty(submittedDetails),
            shippingDetails: {
              name: billingFormData.name,
              location: billingFormData.address,
              number: billingFormData.mobileNumber,
              title: 'Billing'
            },
            shippingForm: {
              onSubmit: formSubmitHandler,
              submitButton: { text: 'Save Billing Details' },
              values: formData,
              onChange: data => setBillingFormData(data)
            }
          },
          payment: {
            title: 'Payment',
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap(),
              totalText: 'Total',
              totalValueWithCurrency: {
                value: getSubTotalAndDeliveryCharges(initResponse).subTotal.toString(),
                currency: getSubTotalAndDeliveryCharges(initResponse).currencySymbol
              }
            }
          },
          loader: {
            text: 'Please wait while we set things up for you'
          },
          pageCTA: {
            text: 'Checkout',
            handleClick: () => {
              dispatch(cartActions.clearCart())
              router.push('/paymentMode')
            }
          }
        }}
        isLoading={isLoading}
        isSelectLoading={isSelectLoading}
        hasInitResult={isInitResultPresent()}
      />
    </>
  )
}
export default CheckoutPage
