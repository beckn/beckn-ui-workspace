import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useTheme } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'
import { getInitPayload, getSubTotalAndDeliveryCharges } from '@beckn-ui/common/src/utils'
import { Checkout } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { isEmpty } from '@beckn-ui/common/src/utils'
import { FormField } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { DiscoveryRootState, ICartRootState, ParsedItemModel, PaymentBreakDownModel } from '@beckn-ui/common'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { testIds } from '@shared/dataTestIds'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
  meterNumber: string
}

const CheckoutPage = () => {
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const totalBillingItems = useSelector((state: CheckoutRootState) => state.checkout.totalBillingItems)
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'lisa',
    mobileNumber: '9811259151',
    email: 'lisa.k@gmail.com',
    address: '1202 b2, Bengaluru urban, Bengaluru, Karnataka',
    pinCode: '560078',
    meterNumber: 'MT451667'
  })
  console.log(cartItems)
  const router = useRouter()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()
  const { t, locale } = useLanguage()
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const { transactionId } = useSelector((state: DiscoveryRootState) => state.discovery)

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
        copiedFormData.mobileNumber = localStorage.getItem('userPhone') as string
        setShippingFormData(copiedFormData)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setShippingFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (totalBillingItems > 0 && totalBillingItems !== cartItems.length) {
        initReq()
      }
    }
  }, [])

  useEffect(() => {
    const shippingAddressComplete = Object.values(shippingFormData).every(value => value.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(shippingFormData))
    }
  }, [shippingFormData])

  const initReq = () => {
    getInitPayload(shippingFormData, {}, cartItems, transactionId, DOMAIN).then(res => {
      dispatch(checkoutActions.setTotalBillingItems({ totalBillingItems: cartItems.length }))
      return initialize(res)
    })
  }

  const formSubmitHandler = (data: any) => {
    if (data) {
      initReq()
    }
  }

  const isInitResultPresent = () => {
    return !!initResponse && initResponse.length > 0
  }

  const createPaymentBreakdownMap = () => {
    const paymentBreakdownMap: PaymentBreakDownModel = {}
    if (isInitResultPresent()) {
      initResponse.forEach(initRes => {
        initRes.message.order.quote?.breakup?.forEach(breakup => {
          paymentBreakdownMap[breakup.title] = {
            value: breakup.price.value,
            currency: breakup.price.currency
          }
        })
      })
    }
    return paymentBreakdownMap
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
              description: singleItem.providerName,
              quantity: 1,
              // priceWithSymbol: `${currencyMap[singleItem.price.currency]}${singleItem.totalPrice}`,
              price: Number(singleItem.price.value),
              currency: singleItem.price.currency,
              image: singleItem.images?.[0].url
            }))
          },
          shipping: {
            triggerFormTitle: t.change,
            showDetails: isInitResultPresent(),
            color: bgColorOfSecondary,
            shippingDetails: {
              name: shippingFormData.name,
              location: shippingFormData.address!,
              number: shippingFormData.mobileNumber,
              title: t.billing
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: t.addBillingDetails },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            },
            sectionTitle: t.billing,
            formTitle: t.addBillingDetails,
            sectionSubtitle: t.addBillingDetails,
            dataTest: testIds.checkoutpage_billingDetails
          },

          payment: {
            title: t.payment,
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap(),
              totalText: t.total,
              totalValueWithCurrency: {
                value: getSubTotalAndDeliveryCharges(initResponse).subTotal.toString(),
                currency: getSubTotalAndDeliveryCharges(initResponse).currencySymbol!
              }
            }
          },
          loader: {
            text: t.initializingOrderLoader
          },
          pageCTA: {
            text: t.procced,
            dataTest: testIds.checkoutpage_proceedToCheckout,
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
