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
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const tourismName = cartItems[0]?.categories[0]?.name

  const [formData, setFormData] = useState<ShippingFormInitialValuesType>(
    tourismName === 'Tourism'
      ? {
          name: 'lisa',
          mobileNumber: '9811259151',
          email: 'lisa.k@gmail.com',
          address: '1202 b2, bengaluru urban, bengaluru, karnataka',
          pinCode: '560078'
        }
      : {
          name: 'lisa',
          mobileNumber: '0612345678',
          email: 'lisa.k@gmail.com',
          address: '15 rue du soleil, paris, france',
          pinCode: '75001'
        }
  )
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const toast = useToast()

  const [submittedDetails, setSubmittedDetails] = useState<ShippingFormInitialValuesType>(
    tourismName === 'Tourism'
      ? {
          name: 'lisa',
          mobileNumber: '9811259151',
          email: 'lisa.k@gmail.com',
          address: '1202 b2, bengaluru urban, bengaluru, karnataka',
          pinCode: '560078'
        }
      : {
          name: 'lisa',
          mobileNumber: '0612345678',
          email: 'lisa.k@gmail.com',
          address: '15 rue du soleil, paris, france',
          pinCode: '75001'
        }
  )

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>(
    tourismName === 'Tourism'
      ? {
          name: 'lisa',
          mobileNumber: '9811259151',
          email: 'lisa.k@gmail.com',
          address: '1202 b2, bengaluru urban, bengaluru, karnataka',
          pinCode: '560078'
        }
      : {
          name: 'lisa',
          mobileNumber: '0612345678',
          email: 'lisa.k@gmail.com',
          address: '15 rue du soleil, paris, france',
          pinCode: '75001'
        }
  )

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()
  const { t, locale } = useLanguage()
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)

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
      const { id, type } = selectResponse[0].message.order.fulfillments[0]
      getInitPayload(submittedDetails, billingFormData, cartItems, transactionId, DOMAIN, { id, type }).then(res => {
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

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
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
            color: bgColorOfSecondary,
            shippingDetails: {
              name: submittedDetails.name,
              location: submittedDetails.address,
              number: submittedDetails.mobileNumber,
              title: 'Shipping'
            },
            shippingForm: {
              onSubmit: formSubmitHandler,
              submitButton: { text: 'Save Shipping Details' },
              values: formData,
              onChange: data => setSubmittedDetails(data)
            }
          },
          billing: {
            sectionSubtitle: 'Add Billing Details',
            sectionTitle: 'Billing',
            formTitle: 'Add Billing Details',
            isBilling: true,
            color: bgColorOfSecondary,
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
            text: t.initializingOrderLoader
          },
          pageCTA: {
            text: 'Proceed to Checkout',
            handleClick: () => {
              dispatch(cartActions.clearCart())
              router.push('/paymentMode')
            }
          }
        }}
        isLoading={isLoading}
        hasInitResult={isInitResultPresent()}
      />
    </Box>
  )
}
export default CheckoutPage
