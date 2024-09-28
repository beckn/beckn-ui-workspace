import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useToast, useTheme } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'
import {
  areShippingAndBillingDetailsSame,
  getInitPayload,
  getSubTotalAndDeliveryCharges
} from '@beckn-ui/common/src/utils'
import { Checkout } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { isEmpty } from '@beckn-ui/common/src/utils'
import { FormField } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { DiscoveryRootState, ICartRootState, PaymentBreakDownModel } from '@beckn-ui/common'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { testIds } from '@shared/dataTestIds'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}

const CheckoutPage = () => {
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)

  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const toast = useToast()

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'Anand',
    mobileNumber: '9886098860',
    email: 'nobody@nomail.com',
    address: 'B005 aspire heights, Jurong East, SGP',
    pinCode: '680230'
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
        (selectResponse[0].message.order.provider as any)?.fulfillments[0]
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
      initResponse[0].message.order.quote.breakup.forEach(breakup => {
        let price = breakup.price.value
        const totalAmount = cartItems?.[0]?.totalPrice
        if (breakup.title === 'base-price') {
          price = (totalAmount - totalAmount * (12 / 100)).toString()
        }
        if (breakup.title === 'taxes') {
          price = (totalAmount * (12 / 100)).toString()
        }
        paymentBreakdownMap[breakup.title] = {
          value: price,
          currency: breakup.price.currency
        }
        totalPayment = Number(totalPayment) + Number(price)
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
              quantity: singleItem.quantity,
              // priceWithSymbol: `${currencyMap[singleItem.price.currency]}${singleItem.totalPrice}`,
              price: singleItem.totalPrice,
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
              title: t.shipping
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: t.saveShippingDetails },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            },
            sectionTitle: t.shipping,
            formTitle: t.addShippingDetails,
            sectionSubtitle: t.addShippingDetails,
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
