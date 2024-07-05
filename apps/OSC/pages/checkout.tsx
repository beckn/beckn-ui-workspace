import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useTheme } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'

import { ICartRootState } from '@lib/types/cart'
import {
  getInitPayload,
  areShippingAndBillingDetailsSame,
  getSubTotalAndDeliveryCharges
} from '@components/checkout/checkout.utils'
import useRequest from '../hooks/useRequest'

import { Checkout } from '@beckn-ui/becknified-components'

import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { CheckoutRootState, checkoutActions } from '@store/checkout-slice'
import { cartActions } from '@store/cart-slice'
import { isEmpty } from '@utils/common-utils'
import { FormField, LoaderWithMessage } from '@beckn-ui/molecules'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { DiscoveryRootState } from '@beckn-ui/common'

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
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'lisa',
    mobileNumber: '0612345678',
    email: 'lisa.k@gmail.com',
    address: '15 rue du soleil, paris, france',
    pinCode: '75001'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'lisa',
    mobileNumber: '0612345678',
    email: 'lisa.k@gmail.com',
    address: '15 rue du soleil, paris, france',
    pinCode: '75001'
  })

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const [initialize, { isLoading }] = useInitMutation()
  const { t } = useLanguage()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)

  //////////  For field Data ///////////
  const formFieldConfig: FormField[] = [
    {
      name: 'name',
      label: t.formName,
      type: 'text',
      validate: (value: string) => {
        if (!value.trim()) return t.errorName
        return undefined
      }
    },
    {
      name: 'mobileNumber',
      label: t.formNumber,
      type: 'number',
      validate: (value: string) => {
        if (!value.trim()) return t.errorNumber
        if (!/^\d{10}$/.test(value)) return t.errorNumber2
        return undefined
      }
    },
    {
      name: 'email',
      label: t.formEmail,
      type: 'email',
      validate: (value: string) => {
        if (!value.trim()) return t.requiredEmail
        if (!/\S+@\S+\.\S+/.test(value)) return t.invalidEmail
        return undefined
      }
    },
    {
      name: 'address',
      label: t.formAddress,
      type: 'text',
      validate: (value: string) => {
        if (!value.trim()) return t.errorAddress
        return undefined
      }
    },
    {
      name: 'pinCode',
      label: t.formZipCode,
      type: 'text',
      validate: (value: string) => {
        if (!value.trim()) return t.errorZipcode
        if (!/^\d{5,6}$/.test(value)) return t.errorZipcode2
        return undefined
      }
    }
  ]

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

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.initLoaderSubText}
        />
      </Box>
    )
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
            title: t.items,
            data: cartItems.map(singleItem => ({
              title: singleItem.name,
              description: singleItem.short_desc,
              quantity: singleItem.quantity,
              // priceWithSymbol: `${currencyMap[singleItem.price.currency]}${singleItem.totalPrice}`,
              price: parseFloat(singleItem.price.value) * singleItem.quantity,
              currency: singleItem.price.currency,
              image: singleItem.images[0].url
            }))
          },
          shipping: {
            triggerFormTitle: t.change,
            showDetails: isInitResultPresent(),
            color: bgColorOfSecondary,
            shippingDetails: {
              name: shippingFormData.name,
              location: shippingFormData.address,
              number: shippingFormData.mobileNumber,
              title: t.shipping
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: t.saveShippingDetails },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            },
            sectionSubtitle: t.addShippingDetails,
            sectionTitle: t.shipping,
            formTitle: t.addShippingDetails,
            sameAsTitle: t.sameAsShipping
          },
          billing: {
            triggerFormTitle: t.change,
            sectionSubtitle: t.addBillingDetails,
            sectionTitle: t.billing,
            formTitle: t.addBillingDetails,
            isBilling: true,
            color: bgColorOfSecondary,
            isChecked: isBillingSameRedux,
            sameAsTitle: t.sameAsShipping,
            onCheckChange: () => {
              // setIsBillingSame(!isBillingSame)
              dispatch(checkoutActions.setIsBillingSame({ isBillingSame: !isBillingSameRedux }))
            },
            showDetails: isInitResultPresent() && !isEmpty(shippingFormData),
            shippingDetails: {
              name: billingFormData.name,
              location: billingFormData.address,
              number: billingFormData.mobileNumber,
              title: t.billing
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: t.saveBillingDetails },
              values: billingFormData,
              onChange: data => setBillingFormData(data)
            }
          },
          payment: {
            title: t.payment,
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap(),
              totalText: t.total,
              totalValueWithCurrency: {
                value: getSubTotalAndDeliveryCharges(initResponse).subTotal.toString(),
                currency: getSubTotalAndDeliveryCharges(initResponse).currencySymbol
              }
            }
          },
          loader: {
            text: t.initializingInit
          },
          pageCTA: {
            text: t.proceedTOCheckout,
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
