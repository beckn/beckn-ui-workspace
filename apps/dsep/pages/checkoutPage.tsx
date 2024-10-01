import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Image, useTheme } from '@chakra-ui/react'
import { DetailCard } from '@beckn-ui/becknified-components'
import ItemDetails from '../components/detailsCard/ItemDetails'
import { useLanguage } from '../hooks/useLanguage'
import addShippingBtn from '../public/images/offer.svg'
import { ICartRootState } from '../lib/types/cart'
import { cartActions } from '../store/cart-slice'
import { getPaymentBreakDown, handleFormSubmit } from '../utilities/checkout-utils'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import ShippingSection from '@beckn-ui/becknified-components/src/components/checkout/shipping-section'
import addBillingButton from '../public/images/addShippingBtn.svg'
import { SelectResponseModel } from '../lib/types/select.types'
import { Typography } from '@beckn-ui/molecules'
import { InitResponseModel } from '../lib/types/init.types'
import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import PaymentDetails from '@beckn-ui/becknified-components/src/components/checkout/payment-details'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import axios from '../services/axios'
import { testIds } from '@shared/dataTestIds'

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
    pinCode: '110001'
  })
  // TODO :- check for refactoring and some issue fix in this component
  const [isLoadingForInit, setIsLoadingForInit] = useState(false)
  const [isError, setIsError] = useState(false)
  const [initData, setInitData] = useState<InitResponseModel | null>(null)
  const [selectResponse, setSelectResponse] = useState<SelectResponseModel | null>(null)

  const router = useRouter()
  const dispatch = useDispatch()
  const { t, locale } = useLanguage()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const totalAmount = useSelector((state: ICartRootState) => state.cart.totalAmount)

  const scholarshipId = useSelector((state: any) => state.scholarshipCart.scholarshipId)
  const scholarshipTitle = useSelector((state: any) => state.scholarshipCart.scholarshipTitle)
  const theme = useTheme()
  const color = theme.colors.primary[100]

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem('initResult')) {
      setInitData(JSON.parse(localStorage.getItem('initResult') as string))
    }
  }, [])

  useEffect(() => {
    if (localStorage && localStorage.getItem('quoteResponse')) {
      const parsedSelectResponse: SelectResponseModel = JSON.parse(localStorage.getItem('quoteResponse') as string)
      setSelectResponse(parsedSelectResponse)
    }
  }, [])

  useEffect(() => {
    const email = Cookies.get('userEmail') as string
    axios
      .get(`${strapiUrl}/profiles?populate[0]=documents.attachment`, axiosConfig)
      .then(res => {
        const profileResponse = res.data
        const documents = profileResponse.data.attributes.documents.data
        const profileData = profileResponse.data.attributes
        const { phone, name, zip_code, address } = profileData

        setFormData(prevData => {
          return {
            ...prevData,
            email,
            name,
            mobileNumber: phone
          }
        })
      })
      .catch(e => {
        console.error(e)
      })
  }, [])

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem('userPhone')) {
        const userPhone = localStorage.getItem('userPhone') as string
        setFormData(prevData => {
          return {
            ...prevData,

            mobileNumber: userPhone
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('shippingAdress')) {
        setFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
    }
  }, [])

  useEffect(() => {
    const shippingAddressComplete = Object.values(formData).every(value => value?.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(formData))
    }
  }, [formData])

  if (!selectResponse) {
    return <></>
  }

  if (isLoadingForInit) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.initializingOrderLoader}
        />
      </Box>
    )
  }

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      {/* <AppHeader appHeaderText={t.checkout} /> */}
      {/* start Item Details */}
      <Box>
        <Box pb={'10px'}>
          <Typography
            text={t.overview}
            fontSize={'17px'}
          />
        </Box>
        <DetailCard>
          {cartItems.map(item => {
            return (
              <>
                <ItemDetails
                  currencyType={item.item.price.currency}
                  key={item.item.id}
                  title={item.item.name}
                  provider={item.providerName}
                  quantity={item.quantity}
                  price={totalAmount}
                />
              </>
            )
          })}
        </DetailCard>
      </Box>
      <ShippingSection
        dataTest={testIds.checkoutpage_shippingDetails}
        color={color}
        sectionSubtitle={t.addBillingdetailsBtnText}
        addButtonImage={addBillingButton}
        sectionTitle={t.billing}
        formTitle={t.addBillingdetailsBtnText}
        isBilling={false}
        showDetails={!!initData}
        shippingDetails={{
          name: formData.name,
          location: formData.address,
          number: formData.mobileNumber,
          title: t.billing
        }}
        shippingForm={{
          onSubmit: formData => {
            setFormData({ ...(formData as ShippingFormData) })
            return handleFormSubmit(
              formData as ShippingFormData,
              selectResponse,
              setInitData,
              setIsLoadingForInit,
              setIsError,
              apiUrl as string
            )
          },
          submitButton: { text: 'Save Billing Details' },
          values: formData,
          onChange: data => () => {
            console.log('data in the change', data)
          }
        }}
      />
      {scholarshipTitle.length !== 0 && (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
          >
            <Text fontSize={'17px'}>{t.scholarship}</Text>
          </Flex>

          <DetailCard>
            <Flex alignItems={'center'}>
              <Image
                alt="shippingBtnImage"
                src={addShippingBtn}
              />
              <Text ml={'8px'}>
                <span
                  style={{
                    fontWeight: 'bold'
                  }}
                >
                  ‘{scholarshipId}-{scholarshipTitle}’
                </span>
              </Text>
            </Flex>
            <Text ml={'35px'}>{t.scholarshipApplied}</Text>
          </DetailCard>
        </Box>
      )}
      {/* start payment details */}
      {!!initData && (
        <Box>
          <Flex
            pb={'10px'}
            mt={'20px'}
            justifyContent={'space-between'}
            data-test={testIds.checkoutpage_paymentDetails}
          >
            <Text fontSize={'17px'}>{t.paymentText}</Text>
          </Flex>
          <DetailCard>
            {initData.data.map((data, idx) => {
              return (
                <PaymentDetails
                  key={idx}
                  paymentBreakDown={getPaymentBreakDown(data).breakUpMap}
                  totalText={t.total}
                  totalValueWithCurrency={getPaymentBreakDown(data).totalPricewithCurrent}
                />
              )
            })}
          </DetailCard>
        </Box>
      )}
      <Box m={'20px 0px'}>
        <BecknButton
          dataTest={testIds.checkoutpage_proceedToCheckout}
          disabled={!!!initData}
          children={t.confirm}
          className="checkout_btn "
          handleClick={() => {
            dispatch(cartActions.clearCart())
            router.push('/orderConfirmation')
          }}
        />
      </Box>
    </Box>
  )
}
export default CheckoutPage
