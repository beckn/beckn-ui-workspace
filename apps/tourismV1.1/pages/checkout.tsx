import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useToast, useTheme } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'

// import { getInitPayload } from '@components/checkout/checkout.utils'
import useRequest from '../hooks/useRequest'

import { Checkout } from '@beckn-ui/becknified-components'

import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType, ItemDetailProps } from '@beckn-ui/becknified-components'
import LoaderWithMessage from '@components/loader/LoaderWithMessage'
import { FormField } from '@beckn-ui/molecules'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import {
  areShippingAndBillingDetailsSame,
  checkoutActions,
  CheckoutRootState,
  createPaymentBreakdownMap,
  DiscoveryRootState,
  getInitPayload,
  getItemWiseBreakUp,
  getSelectPayload,
  getTotalPriceWithCurrency,
  ICartRootState,
  isEmpty
} from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'

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

  const toast = useToast()

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>(
    tourismName === 'Tourism'
      ? {
          name: 'Lisa',
          mobileNumber: '9811259151',
          email: 'lisa.k@gmail.com',
          address: '1202 B2, Bengaluru urban, Bengaluru, Karnataka',
          pinCode: '560078'
        }
      : {
          name: 'Lisa',
          mobileNumber: '0612345678',
          email: 'lisa.k@gmail.com',
          address: '15 Rue du Soleil, Paris, France',
          pinCode: '75020'
        }
  )
  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>(
    tourismName === 'Tourism'
      ? {
          name: 'Lisa',
          mobileNumber: '9811259151',
          email: 'lisa.k@gmail.com',
          address: '1202 B2, Bengaluru urban, Bengaluru, Karnataka',
          pinCode: '560078'
        }
      : {
          name: 'Lisa',
          mobileNumber: '0612345678',
          email: 'lisa.k@gmail.com',
          address: '15 Rue du Soleil, Paris, France',
          pinCode: '75020'
        }
  )
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()

  const [fetchQuotes, { isLoading: isSelectLoading, data, isError: isSelectError }] = useSelectMutation()
  const { t, locale } = useLanguage()
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)

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
    if (isEmpty(selectResponse)) {
      fetchQuotes(getSelectPayload(items, transactionId, DOMAIN))
    }
  }, [totalQuantity])

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
    if (data && selectResponse.length > 0) {
      getInitPayload(shippingFormData, billingFormData, cartItems, transactionId, DOMAIN, selectResponse).then(res => {
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

  if (isSelectLoading || isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
        data-test={testIds.loadingIndicator}
      >
        <LoaderWithMessage
          loadingSubText={t.initializingOrderLoader}
          loadingText={t.categoryLoadPrimary}
        />
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
    >
      {/* start Item Details */}
      <Checkout
        schema={{
          items: {
            title: `${t.item}`,
            data: cartItems.map(singleItem => ({
              title: singleItem.name,
              description: singleItem.short_desc,
              quantity: singleItem.quantity,
              // priceWithSymbol: `${currencyMap[singleItem.price.currency]}${singleItem.totalPrice}`,
              price: Number(singleItem.price.value),
              currency: singleItem.price.currency,
              image: singleItem.images?.[0].url,
              breakUp: getItemWiseBreakUp(selectResponse, singleItem.id)
            })) as ItemDetailProps[]
          },
          shipping: {
            showDetails: isInitResultPresent(),
            sectionSubtitle: `${t.addTravellerDetails}`,
            color: bgColorOfSecondary,
            formTitle: `${t.addTravellerDetails}`,
            sectionTitle: `${t.travellerDetails}`,
            dataTest: testIds.checkoutpage_shippingDetails,
            shippingDetails: {
              name: shippingFormData.name,
              location: shippingFormData.address!,
              number: shippingFormData.mobileNumber,
              title: `${t.travellerDetails}`
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: `${t.saveTravellerDetails}` },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            }
          },
          billing: {
            triggerFormTitle: `${t.change}`,
            dataTest: testIds.checkoutpage_billingDetails,
            sectionSubtitle: `${t.addBillingdetailsBtnText}`,
            sectionTitle: `${t.billing}`,
            formTitle: `${t.addBillingdetailsBtnText}`,
            color: bgColorOfSecondary,
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
              title: `${t.billing}`
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: `${t.saveBillingDetails}` },
              values: billingFormData,
              onChange: data => setBillingFormData(data)
            }
          },
          payment: {
            title: `${t.paymentText}`,
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap(initResponse),
              totalText: `${t.total}`,
              totalValueWithCurrency: getTotalPriceWithCurrency(initResponse)
            }
          },
          loader: {
            text: `${t.initLoderText}`
          },
          pageCTA: {
            text: `${t.checkout}`,
            dataTest: testIds.checkoutpage_proceedToCheckout,
            handleClick: () => {
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
