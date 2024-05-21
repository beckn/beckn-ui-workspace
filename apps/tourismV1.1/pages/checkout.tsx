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
  getSubTotalAndDeliveryCharges,
  formFieldConfig
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
import { FormField } from '@beckn-ui/molecules'

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
          pinCode: '75001'
        }
  )

  const toast = useToast()

  const [submittedDetails, setSubmittedDetails] = useState<ShippingFormInitialValuesType>(
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
          pinCode: '75001'
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
          pinCode: '75001'
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
  console.log(cartItems)
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
            message={t.initLoderTextFail}
          />
        ),
        position: 'top',
        duration: 2000,
        isClosable: true
      })
    }
  }, [isError])

  if (isSelectLoading || isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
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
      overflowY={'scroll'}
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
              price: singleItem.totalPrice,
              currency: singleItem.price.currency,
              image: singleItem.images[0].url
            }))
          },
          shipping: {
            showDetails: isInitResultPresent(),
            sectionSubtitle: `${t.addTravellerDetails}`,
            color: bgColorOfSecondary,
            formTitle: `${t.addTravellerDetails}`,
            sectionTitle: `${t.travellerDetails}`,
            shippingDetails: {
              name: submittedDetails.name,
              location: submittedDetails.address,
              number: submittedDetails.mobileNumber,
              title: `${t.travellerDetails}`
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: `${t.saveTravellerDetails}` },
              values: formData,
              onChange: data => setSubmittedDetails(data)
            }
          },
          billing: {
            triggerFormTitle: `${t.change}`,
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
            showDetails: isInitResultPresent() && !isEmpty(submittedDetails),
            shippingDetails: {
              name: billingFormData.name,
              location: billingFormData.address,
              number: billingFormData.mobileNumber,
              title: `${t.billing}`
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: `${t.saveBillingDetails}` },
              values: formData,
              onChange: data => setBillingFormData(data)
            }
          },
          payment: {
            title: `${t.paymentText}`,
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
            text: `${t.initLoderText}`
          },
          pageCTA: {
            text: `${t.checkout}`,
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
    </Box>
  )
}
export default CheckoutPage
