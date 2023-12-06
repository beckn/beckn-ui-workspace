import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Stack, Checkbox } from '@chakra-ui/react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ItemDetails from '../components/detailsCard/ItemDetails'
import ButtonComp from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import PaymentDetails from '../components/detailsCard/PaymentDetails'
import AddShippingButton from '../components/detailsCard/AddShippingButton'
import { CartItemForRequest, DataPerBpp, ICartRootState, TransactionIdRootState } from '../lib/types/cart'
import { getCartItemsPerBpp } from '../utilities/cart-utils'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import {
  areShippingAndBillingDetailsSame,
  getPayloadForInitRequest,
  getSubTotalAndDeliveryCharges,
  getTotalCartItems
} from '../utilities/checkout-utils'
import Loader from '../components/loader/Loader'
import { Checkout } from '@beckn-ui/becknified-components'
import AddBillingButton from '../components/detailsCard/AddBillingButton'
import { useRouter } from 'next/router'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}

const CheckoutPage = () => {
  const [formData, setFormData] = useState<ShippingFormData>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    zipCode: '75001'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
    name: 'Antoine Dubois',
    mobileNumber: '0612345678',
    email: 'antoine.dubois@gmail.com',
    address: '15 Rue du Soleil, Paris, France',
    zipCode: '75001'
  })

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

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
    if (initRequest.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('initResult', JSON.stringify(initRequest.data))
      }

      dispatch(responseDataActions.addInitResponse(initRequest.data))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initRequest.data])

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

  const formSubmitHandler = () => {
    if (formData) {
      // TODO :_ To check this again

      // if (isBillingAddressSameAsShippingAddress) {
      //   const copiedFormData = structuredClone(formData);
      //   setBillingFormData(copiedFormData);
      // }

      const cartItemsPerBppPerProvider: DataPerBpp = getCartItemsPerBpp(cartItems as CartItemForRequest[])

      const payLoadForInitRequest = getPayloadForInitRequest(
        cartItemsPerBppPerProvider,
        transactionId,
        formData,
        billingFormData
      )
      initRequest.fetchData(`${apiUrl}/client/v2/initialize_order`, 'POST', payLoadForInitRequest)
    }
  }

  if (initRequest.loading) {
    return <Loader loadingText={t['initializingOrderLoader']} />
  }

  const isInitResultPresent = () => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('initResult')) {
        return true
      }
    }

    return !!initRequest.data
  }

  return (
    <>
      {/* start Item Details */}
      <Checkout />
    </>
  )
}
export default CheckoutPage
