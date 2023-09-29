import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Stack, Checkbox, Image, StackDivider } from '@chakra-ui/react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ItemDetails from '../components/detailsCard/ItemDetails'
import ButtonComp from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import PaymentDetails from '../components/detailsCard/PaymentDetails'
import AddShippingButton from '../components/detailsCard/AddShippingButton'
import addShippingBtn from '../public/images/offer.svg'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import locationIcon from '../public/images/locationIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
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
import ItemDetailsForMedicine from '../components/detailsCard/ItemDetailsForMedicine'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  pinCode: string
}

const checkoutForMedicine = () => {
  const [formData, setFormData] = useState<ShippingFormData>({
    name: 'Santosh Kumar',
    mobileNumber: '9876543210',
    email: 'santosh.k@gmail.com',
    address: '151-E, Janpath Road, New Delhi',
    pinCode: '201016'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
    name: 'Santosh Kumar',
    mobileNumber: '9876543210',
    email: 'santosh.k@gmail.com',
    address: '151-E, Janpath Road, New Delhi',
    pinCode: '201016'
  })

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

  const scholarshipId = useSelector((state: any) => state.scholarshipCart.scholarshipId)
  const scholarshipTitle = useSelector((state: any) => state.scholarshipCart.scholarshipTitle)

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
    return <Loader subLoadingText={t['initializingOrderLoader']} />
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
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      {/* <AppHeader appHeaderText={t.checkout} /> */}
      {/* start Item Details */}
      <Box>
        <Box pb={'10px'}>
          <Text fontSize={'17px'}>{t.items}</Text>
        </Box>

        <DetailsCard>
          {cartItems.map(item => {
            return (
              <ItemDetailsForMedicine
                medicineName={item.descriptor.name}
                quantity={item.quantity}
                description={(item as any).bppName}
                price={item.totalPrice}
              />
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

          <DetailsCard>
            <Stack divider={<StackDivider />} spacing="4">
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={nameIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{formData.name}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={locationIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{formData.address}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={CallphoneIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{formData.mobileNumber}</Text>
              </Flex>
            </Stack>
          </DetailsCard>
        </Box>
      )}
      {/* end shipping detals */}
      {isBillingAddressSameAsShippingAddress ? (
        <Box>
          <Flex pb={'20px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.billing}</Text>
            <AddBillingButton
              billingFormData={billingFormData}
              setBillingFormData={setBillingFormData}
              addBillingdetailsBtnText={t.changeText}
              billingFormSubmitHandler={formSubmitHandler}
              imgFlag={false}
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
              imgFlag={false}
            />
          </Flex>

          <DetailsCard>
            <Stack divider={<StackDivider />} spacing="4">
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={nameIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{formData.name}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={locationIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{formData.address}</Text>
              </Flex>
              <Flex alignItems={'center'}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={CallphoneIcon} pr={'12px'} />
                <Text fontSize={'15px'}>{formData.mobileNumber}</Text>
              </Flex>
            </Stack>
          </DetailsCard>
        </Box>
      )}
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
              deliveryChargesValue={`- ${t.currencySymbol} ${getSubTotalAndDeliveryCharges(initRequest.data).subTotal}`}
              totalText={t.totalText}
              totalValue={'0.00'}
            />
          </DetailsCard>
        </Box>
      )}
      {/* end payment details */}
      {!isInitResultPresent() ? (
        <Box>
          <ButtonComp
            buttonText={t.continue}
            background={'rgba(var(--color-primary))'}
            color={'rgba(var(--text-color))'}
            handleOnClick={() => {}}
            isDisabled={true}
          />
        </Box>
      ) : (
        <ButtonComp
          buttonText={t.continue}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          handleOnClick={() => router.push('/paymentMode')}
          isDisabled={false}
        />
      )}
    </Box>
  )
}
export default checkoutForMedicine
