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
      {/* <AppHeader appHeaderText={t.checkout} /> */}
      {/* start Item Details */}
      <Box>
        <Box pb={'10px'}>
          <Text fontSize={'17px'}>{t.items}</Text>
        </Box>
        {/* {cartItems.map((item) => (
          <DetailsCard key={item.id}>
            <ItemDetails
              title={item.descriptor.name}
              description={item.descriptor.short_desc}
              quantity={item.quantity}
              price={`${t.currencySymbol}${item.totalPrice}`}
            />
          </DetailsCard>
        ))} */}
        <DetailsCard>
          {cartItems.map(item => {
            return (
              <>
                <ItemDetails
                  title={item.descriptor.name}
                  description={item.descriptor.short_desc}
                  quantity={item.quantity}
                  price={`${t.currencySymbol}${item.totalPrice}`}
                />
              </>
            )
          })}
        </DetailsCard>
      </Box>
      {/* end item details */}
      {/* start shipping detals */}
      {!isInitResultPresent() ? (
        <Box>
          <Flex pb={'10px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.shipping}</Text>
          </Flex>
          <DetailsCard>
            <AddShippingButton
              imgFlag={!initRequest.data}
              formData={formData}
              setFormData={setFormData}
              addShippingdetailsBtnText={t.addShippingdetailsBtnText}
              formSubmitHandler={formSubmitHandler}
            />
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex pb={'10px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.shipping}</Text>
            <AddShippingButton
              imgFlag={!isInitResultPresent()}
              formData={formData}
              setFormData={setFormData}
              addShippingdetailsBtnText={t.changeText}
              formSubmitHandler={formSubmitHandler}
            />
          </Flex>

          <ShippingOrBillingDetails
            accordionHeader={t.shipping}
            name={formData.name}
            location={formData.address}
            number={formData.mobileNumber}
          />
        </Box>
      )}
      {/* end shipping detals */}
      {/* start payment method */}
      {isBillingAddressSameAsShippingAddress ? (
        <Box>
          <Flex pb={'20px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.billing}</Text>
            <AddBillingButton
              billingFormData={billingFormData}
              setBillingFormData={setBillingFormData}
              addBillingdetailsBtnText={t.changeText}
              billingFormSubmitHandler={formSubmitHandler}
            />
            {/* TODO :- Will enable this button after demo */}
            {/* <Text
            fontSize={"15px"}
            color={"rgba(var(--color-primary))"}
            cursor={"pointer"}
          >
            {t.changeText}
          </Text> */}
          </Flex>
          <DetailsCard>
            <Stack spacing={5} direction="row">
              <Checkbox colorScheme={'red'} pr={'12px'} fontSize={'17px'} defaultChecked>
                {t.orderDetailsCheckboxText}
              </Checkbox>
            </Stack>
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex pb={'20px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.billing}</Text>
            <AddBillingButton
              billingFormData={billingFormData}
              setBillingFormData={setBillingFormData}
              addBillingdetailsBtnText={t.changeText}
              billingFormSubmitHandler={formSubmitHandler}
            />
          </Flex>

          <ShippingOrBillingDetails
            accordionHeader={t.billing}
            name={billingFormData.name}
            location={billingFormData.address}
            number={billingFormData.mobileNumber}
          />
        </Box>
      )}

      {/* end payment method */}
      {/* start payment details */}
      {initRequest.data && (
        <Box>
          <Flex pb={'10px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.paymentText}</Text>
          </Flex>
          <DetailsCard>
            <PaymentDetails
              subtotalText={t.subtotalText}
              subtotalValue={`${t.currencySymbol} ${getSubTotalAndDeliveryCharges(initRequest.data).subTotal}`}
              deliveryChargesText={t.deliveryChargesText}
              deliveryChargesValue={`${t.currencySymbol} ${
                getSubTotalAndDeliveryCharges(initRequest.data).totalDeliveryCharge
              }`}
              totalText={t.totalText}
              totalValue={`${
                getSubTotalAndDeliveryCharges(initRequest.data).subTotal +
                getSubTotalAndDeliveryCharges(initRequest.data).totalDeliveryCharge
              }`}
            />
          </DetailsCard>
        </Box>
      )}
      {/* end payment details */}
      {!isInitResultPresent() ? (
        <Box position={'absolute'} left={'5%'} width={'90%'} bottom={'0'}>
          <ButtonComp
            buttonText={t.proceedToPay}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
            handleOnClick={() => {}}
            isDisabled={true}
          />
        </Box>
      ) : (
        <ButtonComp
          buttonText={t.proceedToCheckout}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          handleOnClick={() => router.push('/paymentMode')}
          isDisabled={false}
        />
      )}
    </>
  )
}
export default CheckoutPage
