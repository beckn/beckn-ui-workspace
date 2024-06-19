import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useToast, useTheme, useBreakpoint } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'

import { useSelectMutation } from '@services/select'
import { ICartRootState } from '@lib/types/cart'
import { getInitPayload } from '@components/checkout/checkout.utils'
import useRequest from '../hooks/useRequest'
import { CustomToast } from '@components/signIn/SignIn'
import { useInitMutation } from '@services/init'
import { getSelectPayload } from '@components/cart/cart.utils'

import { ShippingSection, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { Button, LoaderWithMessage } from '@beckn-ui/molecules'

import { useRouter } from 'next/router'
import { CheckoutRootState, checkoutActions } from '@store/checkout-slice'
import { cartActions } from '@store/cart-slice'
import { isEmpty } from '@utils/common-utils'
import AddSection from '@components/x-input/AddSection'
import { DiscoveryRootState } from '@store/discovery-slice'

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

const DEFAULT_COMPLAINT_FORM_DATA = {
  name: 'santosh kumar',
  mobileNumber: '6251423251',
  email: 'santosh.k@gmail.com',
  address: '151-e, janpath road, new delhi',
  pinCode: '110001'
}

const DEFAULT_BILLING_FORM_DATA = {
  name: 'jay d',
  mobileNumber: '9871432309',
  email: 'jay.d@gmail.com',
  address: '23, east end , sector 10, pritampura, delhi',
  pinCode: '110034'
}

const CheckoutPage = () => {
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const bgColorOfPrimary = theme.colors.primary['100']
  const toast = useToast()

  const complainantFormData = useRef<ShippingFormInitialValuesType>()
  const billingFormData = useRef<ShippingFormInitialValuesType>()

  const [disputeFormSubmitted, setDisputeFormSubmitted] = useState<boolean>(false)
  const [consentFormSubmitted, setConsentFormSubmitted] = useState<boolean>(false)

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
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAddress')) {
        complainantFormData.current = JSON.parse(localStorage.getItem('shippingAddress') as string)
      }
      if (localStorage.getItem('billingAddress')) {
        billingFormData.current = JSON.parse(localStorage.getItem('billingAddress') as string)
      }
    }
  }, [])

  const formSubmitHandler = (data: any) => {
    if (data) {
      let id = '1'
      let type = 'shipping'
      if (selectResponse[0].message.order.fulfillments) {
        id = selectResponse[0].message.order?.fulfillments[0].id
        type = selectResponse[0].message.order?.fulfillments[0].type
      }

      getInitPayload(data, cartItems, transactionId, DOMAIN, { id, type }).then(res => {
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

  const handleComplainantFormSubmit = (data: any) => {
    if (data) {
      complainantFormData.current = data
      localStorage.setItem('shippingAddress', JSON.stringify(data))
      formSubmitHandler({ deliveryAddress: data })
    }
  }

  const handleRespondentFormSubmit = (data: any) => {
    if (data) {
      billingFormData.current = data
      localStorage.setItem('billingAddress', JSON.stringify(data))
      formSubmitHandler({ deliveryAddress: complainantFormData.current, billingAddress: data })
    }
  }

  const complainantDetails = {
    sectionSubtitle: 'Add Complainant Details',
    sectionTitle: 'Complainant & Billing Details',
    formTitle: 'Add Complainant Details',
    showDetails: isInitResultPresent() && !isEmpty(complainantFormData.current),
    color: bgColorOfPrimary,
    shippingDetails: {
      name: complainantFormData.current?.name || '',
      location: complainantFormData.current?.address || '',
      number: complainantFormData.current?.mobileNumber || '',
      title: 'Complainant Details'
    },
    shippingForm: {
      onSubmit: handleComplainantFormSubmit,
      submitButton: { text: 'Save Complainant Details' },
      values: complainantFormData.current || DEFAULT_COMPLAINT_FORM_DATA
    }
  }

  const respondentDetails = {
    sectionSubtitle: 'Add Respondent Details',
    sectionTitle: 'Respondent Details',
    formTitle: 'Add Respondent Details',
    sameAsTitle: 'Same as Complainant Details',
    color: bgColorOfPrimary,
    isChecked: false,
    showDetails: isInitResultPresent() && !isEmpty(billingFormData.current),
    isDisabled: isEmpty(complainantFormData.current),
    shippingDetails: {
      name: billingFormData.current?.name || '',
      location: billingFormData.current?.address || '',
      number: billingFormData.current?.mobileNumber || '',
      title: 'Respondent Details'
    },
    shippingForm: {
      onSubmit: handleRespondentFormSubmit,
      submitButton: { text: 'Save Respondent Details' },
      values: billingFormData.current || DEFAULT_BILLING_FORM_DATA
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

  const hasBtnDisabledState = () => {
    return (
      isEmpty(complainantFormData.current) ||
      isEmpty(billingFormData.current) ||
      !(disputeFormSubmitted && consentFormSubmitted)
    )
  }

  const isSectionDisabled = (response: any, initResponse: any, prevFormSubmited: boolean) => {
    return (
      isEmpty(response) ||
      !hasXinput(response) ||
      (initResponse && (isEmpty(initResponse) || !hasXinput(initResponse))) ||
      !prevFormSubmited
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <Box>
        <ShippingSection {...complainantDetails} />
        <ShippingSection {...respondentDetails} />

        <AddSection
          htmlString={selectResponse?.[0]?.message.order.items?.[0]?.xinput.html}
          disabled={isSectionDisabled(selectResponse, null, true)}
          modalTitle="Add Dispute Details"
          form_id="odrDisputeDetailsForm"
          sectionSubTitle="Dispute Details"
          notifySubmit={setDisputeFormSubmitted}
          isFormSubmit={disputeFormSubmitted}
        />

        <AddSection
          htmlString={initResponse?.[0]?.message.order.items?.[0]?.xinput.html}
          disabled={isSectionDisabled(selectResponse, initResponse, disputeFormSubmitted)}
          modalTitle="Consent Form"
          form_id="odrConsentForm"
          sectionSubTitle="Consent"
          preSubmissionTitle="Consent Form"
          postSubmissionTitle="Consent form added"
          notifySubmit={setConsentFormSubmitted}
          isFormSubmit={consentFormSubmitted}
          bottomGap="10"
        />
        <Box
          width={isLargeScreen ? '40%' : '100%'}
          margin="auto"
        >
          <Button
            disabled={hasBtnDisabledState()}
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
