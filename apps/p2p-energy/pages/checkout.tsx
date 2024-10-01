import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useToast, useTheme } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'
import { areShippingAndBillingDetailsSame, getSubTotalAndDeliveryCharges } from '@beckn-ui/common/src/utils'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { isEmpty } from '@beckn-ui/common/src/utils'
import { FormField } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { DiscoveryRootState, ICartRootState, PaymentBreakDownModel } from '@beckn-ui/common'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { testIds } from '@shared/dataTestIds'
import { getInitPayload } from '../utils/payload'
import Checkout from '@components/checkout'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}

const CheckoutPage = () => {
  const { items: cartItems, totalAmount, totalQuantity } = useSelector((state: ICartRootState) => state.cart)

  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const toast = useToast()

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType | Record<string, string>>({
    name: 'Anand',
    mobileNumber: '9886098860',
    email: 'anand@gmail.com',
    address: 'Flat 208, A Block, Janakpuri West, New Delhi',
    pinCode: '110018',
    meterNumber: 'MT451667'
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()
  const { t, locale } = useLanguage()
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
      name: 'meterNumber',
      label: 'Meter Number',
      type: 'text'
    },
    // {
    //   name: 'mobileNumber',
    //   label: t.formNumber,
    //   type: 'number',
    //   validate: (value: string) => {
    //     if (!value.trim()) return t.errorNumber
    //     if (!/^\d{10}$/.test(value)) return t.errorNumber2
    //     return undefined
    //   }
    // },
    // {
    //   name: 'email',
    //   label: t.formEmail,
    //   type: 'email',
    //   validate: (value: string) => {
    //     if (!value.trim()) return t.requiredEmail
    //     if (!/\S+@\S+\.\S+/.test(value)) return t.invalidEmail
    //     return undefined
    //   }
    // },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setShippingFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
    }
  }, [])

  useEffect(() => {
    const shippingAddressComplete = Object.values(shippingFormData).every(value => value.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(shippingFormData))
    }
  }, [shippingFormData])

  const formSubmitHandler = (data: any) => {
    if (data) {
      const { id, type } =
        selectResponse[0].message.order.fulfillments?.[0] ||
        (selectResponse[0].message.order.provider as any)?.fulfillments?.[0]
      getInitPayload(shippingFormData, {}, cartItems, transactionId, DOMAIN, { id, type }).then(res => {
        return initialize(res)
      })
    }
  }

  const isInitResultPresent = () => {
    return !!initResponse && initResponse.length > 0
  }

  const createPaymentBreakdownMap = () => {
    const paymentBreakdownMap: PaymentBreakDownModel = {}
    let totalPayment: number = 0
    if (isInitResultPresent()) {
      const perUnitCost = parseFloat(initResponse[0].message.order.quote.price.value)
      const units = cartItems?.[0]?.quantity
      // Calculate the base cost
      const baseCost = perUnitCost * units
      initResponse[0].message.order.quote.breakup.forEach(breakupItem => {
        let price = parseFloat(breakupItem.price.value)
        console.log(breakupItem)
        if (breakupItem.title === 'P2P Energy Cost') {
          price = baseCost
        } else if (['CGST', 'SGST'].some(ele => breakupItem.title.startsWith(ele))) {
          price = baseCost * 0.05
        } else if (['Wheeling'].some(ele => breakupItem.title.startsWith(ele))) {
          price = units * 0.5
        }

        paymentBreakdownMap[breakupItem.title] = {
          value: price.toString(),
          currency: breakupItem.price.currency
        }
        totalPayment += price
      })
    }

    return { paymentBreakdownMap, totalPayment }
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
              quantity: totalQuantity,
              // priceWithSymbol: `${currencyMap[singleItem.price.currency]}${singleItem.totalPrice}`,
              price: totalAmount,
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
              meterNumber: (shippingFormData as any).meterNumber,
              title: t.billing
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: t.saveBillingDetails },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            },
            sectionTitle: t.billing,
            formTitle: t.addBillingDetails,
            sectionSubtitle: t.addBillingDetails,
            dataTest: testIds.checkoutpage_shippingDetails
          },
          payment: {
            title: t.payment,
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap().paymentBreakdownMap,
              totalText: t.total,
              totalValueWithCurrency: {
                value: createPaymentBreakdownMap().totalPayment.toString(),
                currency: getSubTotalAndDeliveryCharges(initResponse).currencySymbol!
              }
            }
          },
          loader: {
            text: t.initializingOrderLoader
          },
          pageCTA: {
            text: t.proceedToCheckout,
            dataTest: testIds.checkoutpage_proceedToCheckout,
            handleClick: () => {
              router.push('/paymentMode')
              // dispatch(cartActions.clearCart())
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
