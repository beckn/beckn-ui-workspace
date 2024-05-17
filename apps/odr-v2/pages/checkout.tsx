import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Stack, Checkbox, useToast, useTheme, useBreakpoint } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'
import { PlusSquareIcon } from '@chakra-ui/icons'

import { useSelectMutation } from '@services/select'
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
import { getSelectPayload } from '@components/cart/cart.utils'

import { Checkout, ShippingSection, ShippingFormInitialValuesType, DetailCard } from '@beckn-ui/becknified-components'
import { Loader, Button, LoaderWithMessage } from '@beckn-ui/molecules'

import { Router, useRouter } from 'next/router'
import { CheckoutRootState, checkoutActions } from '@store/checkout-slice'
import { cartActions } from '@store/cart-slice'
import { isEmpty } from '@utils/common-utils'
import DyForm from '@components/x-input/DyForm'
import AddSection from '@components/x-input/AddSection'

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
    name: 'santosh kumar',
    mobileNumber: '6251423251',
    email: 'santosh.k@gmail.com',
    address: '151-e, janpath road, new delhi',
    pinCode: '110001'
  })
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const bgColorOfPrimary = theme.colors.primary['100']
  const toast = useToast()

  const [submittedDetails, setSubmittedDetails] = useState<ShippingFormInitialValuesType>({
    name: 'santosh kumar',
    mobileNumber: '6251423251',
    email: 'santosh.k@gmail.com',
    address: '151-e, janpath road, new delhi',
    pinCode: '110001'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'jay d',
    mobileNumber: '9871432309',
    email: 'jay.d@gmail.com',
    address: '23, east end , sector 10, pritampura, delhi',
    pinCode: '110034'
  })

  const [filledDetails, setFilledDetails] = useState({
    complainant: false,
    respondent: false,
    dispute: false,
    consent: false
  })

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()
  const { t, locale } = useLanguage()
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { items, totalQuantity } = useSelector((state: ICartRootState) => state.cart)
  const [fetchQuotes, { isLoading: isSelectLoading, data, isError: isSelectError }] = useSelectMutation()
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)

  const breakpoint = useBreakpoint()
  const mobileBreakpoints = ['base', 'sm', 'md']
  const isLargeScreen = !mobileBreakpoints.includes(breakpoint)

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
      let id = '1'
      let type = 'shipping'
      if (selectResponse[0].message.order.fulfillments) {
        id = selectResponse[0].message.order?.fulfillments[0].id
        type = selectResponse[0].message.order?.fulfillments[0].type
      }
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

  const hasXinput = (response: any) => {
    return !isEmpty(response[0].message.order.items[0].xinput)
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

  const complainantDetails = {
    sectionSubtitle: 'Add Complainant Details',
    sectionTitle: 'Complainant',
    formTitle: 'Add Complainant Details',
    showDetails: isInitResultPresent(),
    color: bgColorOfPrimary,
    shippingDetails: {
      name: submittedDetails.name,
      location: submittedDetails.address,
      number: submittedDetails.mobileNumber,
      title: 'Complainant Details'
    },
    shippingForm: {
      onSubmit: formSubmitHandler,
      submitButton: { text: 'Save Complainant Details' },
      values: formData,
      onChange: data => setSubmittedDetails(data)
    }
  }

  const respondentDetails = {
    sectionSubtitle: 'Add Respondent Details',
    sectionTitle: 'Respondent',
    formTitle: 'Add Respondent Details',
    sameAsTitle: 'Same as Complainant Details',
    isBilling: true,
    color: bgColorOfPrimary,
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
      title: 'Respondent Details'
    },
    shippingForm: {
      onSubmit: formSubmitHandler,
      submitButton: { text: 'Save Respondent Details' },
      values: formData,
      onChange: data => setBillingFormData(data)
    }
  }

  if (isLoading || isSelectLoading)
    return (
      <Box
        display="flex"
        height="100vh"
        justifyContent="center"
        transform="translateY(-20%)"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait}
          loadingSubText={t.initializingOrderLoader}
        />
      </Box>
    )

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <Box>
        <ShippingSection {...complainantDetails} />
        <ShippingSection {...respondentDetails} />

        {!isEmpty(selectResponse) && hasXinput(selectResponse) && (
          <AddSection
            htmlString={selectResponse[0].message.order.items[0].xinput.html}
            form_id="odrDisputeDetailsForm"
          />
        )}
        {!isEmpty(initResponse) && hasXinput(initResponse) && (
          <AddSection
            htmlString={initResponse[0].message.order.items[0].xinput.html}
            form_id="odrConsentForm"
            preSubmissionTitle="Consent Form"
            postSubmissionTitle="Consent form added"
          />
        )}
        <Box
          width={isLargeScreen ? '40%' : '100%'}
          margin="auto"
        >
          <Button
            text="Confirm"
            handleClick={() => {
              dispatch(cartActions.clearCart())
              router.push('/orderConfirmation')
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
export default CheckoutPage
