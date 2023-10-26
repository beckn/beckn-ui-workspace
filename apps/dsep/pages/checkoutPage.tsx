import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Stack, Checkbox, Image } from '@chakra-ui/react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ItemDetails from '../components/detailsCard/ItemDetails'
import ButtonComp from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import PaymentDetails from '../components/detailsCard/PaymentDetails'
import AddShippingButton from '../components/detailsCard/AddShippingButton'
import addShippingBtn from '../public/images/offer.svg'
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
import Cookies from 'js-cookie'
import axios from 'axios'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  pinCode: string
}

const CheckoutPage = () => {
  const [formData, setFormData] = useState<ShippingFormData>({
    name: 'Santosh Kumar',
    mobileNumber: '9876543210',
    email: 'santosh.k@gmail.com',
    address: '151-E, Janpath Road, New Delhi',
    pinCode: '201016'
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormData>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const router = useRouter()
  const initRequest = useRequest()
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

  const scholarshipId = useSelector((state: any) => state.scholarshipCart.scholarshipId)
  const scholarshipTitle = useSelector((state: any) => state.scholarshipCart.scholarshipTitle)

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    const email = Cookies.get('userEmail') as string
    axios
      .get(`${strapiUrl}/profiles?populate[0]=documents.attachment`, axiosConfig)
      .then(res => {
        const profileResponse = res.data
        const documents = profileResponse.data.attributes.documents.data

        const profileData = profileResponse.data.attributes
        const { name, phone, address, zip_code } = profileData
        setFormData({
          address: address ? address : '',
          email,
          mobileNumber: phone,
          pinCode: zip_code ? zip_code : '',
          name
        })
      })
      .catch(e => console.error(e))
  }, [])

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
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      {/* <AppHeader appHeaderText={t.checkout} /> */}
      {/* start Item Details */}
      <Box>
        <Box pb={'10px'}>
          <Text fontSize={'17px'}>{t.overview}</Text>
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
                  provider={(item as any).bppName}
                  quantity={item.quantity}
                  price={item.totalPrice}
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
            <Text fontSize={'17px'}>{t.billing}</Text>
          </Flex>
          <DetailsCard>
            <AddBillingButton
              imgFlag={!initRequest.data}
              billingFormData={formData}
              setBillingFormData={setFormData}
              addBillingdetailsBtnText={t.addBillingdetailsBtnText}
              billingFormSubmitHandler={formSubmitHandler}
            />
          </DetailsCard>
        </Box>
      ) : (
        <Box>
          <Flex pb={'10px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.billing}</Text>
            <AddBillingButton
              imgFlag={!isInitResultPresent()}
              billingFormData={formData}
              setBillingFormData={setFormData}
              addBillingdetailsBtnText={t.changeText}
              billingFormSubmitHandler={formSubmitHandler}
            />
          </Flex>

          <ShippingOrBillingDetails
            accordionHeader={t.billing}
            name={formData.name}
            location={formData.address}
            number={formData.mobileNumber}
          />
        </Box>
      )}
      {/* end shipping detals */}
      {scholarshipTitle.length !== 0 && (
        <Box>
          <Flex pb={'10px'} mt={'20px'} justifyContent={'space-between'}>
            <Text fontSize={'17px'}>{t.scholarship}</Text>
          </Flex>

          <DetailsCard>
            <Flex alignItems={'center'}>
              <Image alt="shippingBtnImage" src={addShippingBtn} />
              <Text ml={'8px'}>
                <span style={{ fontWeight: 'bold' }}>
                  ‘{scholarshipId}-{scholarshipTitle}’
                </span>
              </Text>
            </Flex>
            <Text ml={'35px'}>{t.scholarshipApplied}</Text>
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
              deliveryChargesText={t.scholaarshipApplied}
              deliveryChargesValue={`- ${t.currencySymbol} ${getSubTotalAndDeliveryCharges(initRequest.data).subTotal}`}
              totalText={t.totalText}
              totalValue={'0.00'}
            />
          </DetailsCard>
        </Box>
      )}
      {/* end payment details */}
      {!isInitResultPresent() ? (
        <Box position={'absolute'} left={'5%'} width={'90%'} bottom={'0'}>
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
export default CheckoutPage
