import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { Checkout } from '@beckn-ui/becknified-components'

import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import {
  areShippingAndBillingDetailsSame,
  cartActions,
  checkoutActions,
  CheckoutRootState,
  createPaymentBreakdownMap,
  DiscoveryRootState,
  getInitPayload,
  getSubTotalAndDeliveryCharges,
  getTotalPriceWithCurrency,
  ICartRootState,
  isEmpty
} from '@beckn-ui/common'

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
  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'santosh kumar',
    mobileNumber: '6251423251',
    email: 'santosh.k@gmail.com',
    address: '151-e, janpath road, new delhi',
    pinCode: '110001'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'santosh kumar',
    mobileNumber: '6251423251',
    email: 'santosh.k@gmail.com',
    address: '151-e, janpath road, new delhi',
    pinCode: '110001'
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId } = useSelector((state: DiscoveryRootState) => state.discovery)

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem('userPhone')) {
        const copiedFormData = structuredClone(shippingFormData)
        const copiedBillingFormData = structuredClone(billingFormData)

        copiedFormData.mobileNumber = localStorage.getItem('userPhone') as string
        copiedBillingFormData.mobileNumber = localStorage.getItem('userPhone') as string

        setShippingFormData(copiedFormData)
        setBillingFormData(copiedBillingFormData)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isBillingSameRedux) {
      setBillingFormData(shippingFormData)
    } else {
      setBillingFormData(billingFormData)
    }
  }, [isBillingSameRedux, shippingFormData])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setShippingFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (localStorage.getItem('billingAddress')) {
        setBillingFormData(JSON.parse(localStorage.getItem('billingAddress') as string))
      }
    }
  }, [])

  useEffect(() => {
    const shippingAddressComplete = Object.values(shippingFormData).every(value => value.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(shippingFormData))
    }
  }, [shippingFormData])

  useEffect(() => {
    const isBillingAddressComplete = Object.values(billingFormData).every(value => value.length > 0)

    if (isBillingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('billingAddress', JSON.stringify(billingFormData))
    }
    setIsBillingAddressSameAsShippingAddress(
      areShippingAndBillingDetailsSame(isBillingAddressComplete, shippingFormData, billingFormData)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billingFormData])

  // useEffect(()=>{
  //   setIsBillingSame(isBillingSameRedux)
  // },[])

  const formSubmitHandler = (data: any) => {
    if (data) {
      const { id, type } = selectResponse[0].message.order.fulfillments[0]
      console.log('Dank', id, type)
      getInitPayload(shippingFormData, billingFormData, cartItems, transactionId, DOMAIN, { id, type }).then(res => {
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

  const isInitResultPresent = (): boolean => {
    return !!initResponse && initResponse.length > 0 && !!initResponse[0].message
  }

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
              price: parseFloat(singleItem.price.value) * singleItem.quantity,
              currency: singleItem.price.currency,
              image: singleItem.images?.[0].url
            }))
          },
          shipping: {
            showDetails: isInitResultPresent(),
            shippingDetails: {
              name: shippingFormData.name,
              location: shippingFormData.address!,
              number: shippingFormData.mobileNumber,
              title: 'Shipping'
            },
            shippingForm: {
              onSubmit: formSubmitHandler,
              submitButton: { text: 'Save Shipping Details' },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            }
          },
          billing: {
            sectionSubtitle: 'Add Billing Details',
            sectionTitle: 'Billing',
            formTitle: 'Add Billing Details',
            isBilling: true,
            isChecked: isBillingSameRedux,
            onCheckChange: () => {
              // setIsBillingSame(!isBillingSame)
              dispatch(checkoutActions.setIsBillingSame({ isBillingSame: !isBillingSameRedux }))
            },
            showDetails: isInitResultPresent() && !isEmpty(shippingFormData),
            shippingDetails: {
              name: billingFormData.name,
              location: billingFormData.address!,
              number: billingFormData.mobileNumber,
              title: 'Billing'
            },
            shippingForm: {
              onSubmit: formSubmitHandler,
              submitButton: { text: 'Save Billing Details' },
              values: billingFormData,
              onChange: data => setBillingFormData(data)
            }
          },
          payment: {
            title: 'Payment',
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap(initResponse),
              totalText: 'Total',
              totalValueWithCurrency: getTotalPriceWithCurrency(initResponse)
            }
          },
          loader: {
            text: 'Initializing your request'
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
