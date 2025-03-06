import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, useToast, useTheme, Divider, Flex, Image, Text } from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'
import {
  areShippingAndBillingDetailsSame,
  getInitPayload,
  getSubTotalAndDeliveryCharges
} from '@beckn-ui/common/src/utils'
import { Checkout, ProductPrice } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { isEmpty } from '@beckn-ui/common/src/utils'
import { FormField, Loader, Typography } from '@beckn-ui/molecules'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { DiscoveryRootState, ICartRootState, PaymentBreakDownModel } from '@beckn-ui/common'
import { cartActions } from '@beckn-ui/common/src/store/cart-slice'
import { testIds } from '@shared/dataTestIds'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'
import { RootState } from '@store/index'
import { DOMAIN_PATH } from '@lib/config'
import { calcLength } from 'framer-motion'
import { calculateDuration, generateRentalInitPayload } from '@utils/checkout-util'
import { setEmiDetails } from '@store/emiSelect-slice'
import { formatDate } from '@beckn-ui/common'
import { AuthRootState } from '@store/auth-slice'

export type ShippingFormData = {
  name: string
  mobileNumber: string
  email: string
  address: string
  zipCode: string
}
const color = '#4398E8'
const CheckoutPage = () => {
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const type = useSelector((state: RootState) => state.navigation.type)
  const selectRentalResponse = useSelector((state: RootState) => state.rental.orderData)
  const theme = useTheme()
  const bgColorOfSecondary = theme.colors.secondary['100']
  const toast = useToast()
  const { user } = useSelector((state: AuthRootState) => state.auth)

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const [isBillingAddressSameAsShippingAddress, setIsBillingAddressSameAsShippingAddress] = useState(true)

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const router = useRouter()
  const dispatch = useDispatch()
  const [initialize, { isLoading, isError }] = useInitMutation()
  const { t, locale } = useLanguage()
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId, productList } = useSelector((state: DiscoveryRootState) => state.discovery)
  const domain = type === 'RENT_AND_HIRE' ? DOMAIN_PATH.RENT_AND_HIRE : DOMAIN_PATH.MY_STORE
  const [fromTime, setFromTime] = useState<string>()
  const [toTime, setToTime] = useState<string>()
  const [duration, setDuration] = useState<number>()

  const emiDetails = useSelector((state: any) => state.selectedEmi.emiDetails[0])

  useEffect(() => {
    const storedFromTime = localStorage.getItem('fromTimestamp')
    const storedToTime = localStorage.getItem('toTimestamp')
    const formatedFromTime = formatDate(Number(storedFromTime) * 1000, 'h:mm a') as string
    const formatedToTime = formatDate(Number(storedToTime) * 1000, 'h:mm a') as string
    setFromTime(formatedFromTime)
    setToTime(formatedToTime)

    if (formatedFromTime && formatedToTime) {
      const calculatedDuration = calculateDuration(formatedFromTime, formatedToTime)
      setDuration(calculatedDuration)
    }
  }, [])

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
    console.log('Dank user', user)

    let formData = {
      name: '',
      mobileNumber: '',
      email: '',
      address: '1202 b2, Bengaluru urban, Bengaluru, Karnataka',
      pinCode: '560078'
    }

    if (user?.agent) {
      // If user.agent exists, use its data
      formData = {
        ...formData,
        name: user.agent.first_name.trim(),
        mobileNumber: user.agent.agent_profile.phone_number,
        email: user.email || ''
      }
    } else {
      // If no user.agent, use default data
      formData = {
        ...formData,
        name: 'Lisa',
        mobileNumber: '9811259151',
        email: 'lisa.k@gmail.com'
      }
    }

    console.log('Dank formData', formData)
    setShippingFormData(formData)
    setBillingFormData(formData)
  }, [user])

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
    if (data) {
      const { id, type } = selectResponse[0]?.message?.order?.fulfillments[0] || {}
      const payloadPromise =
        type === 'RENT_AND_HIRE'
          ? generateRentalInitPayload(selectRentalResponse, shippingFormData, domain)
          : getInitPayload(shippingFormData, billingFormData, cartItems, transactionId, domain, { id, type })
      payloadPromise.then(res => {
        return initialize(res)
      })
    }
  }
  console.log(shippingFormData)
  const isInitResultPresent = () => {
    return !!initResponse && initResponse.length > 0
  }

  const createPaymentBreakdownMap = () => {
    const cartItemsWithQuantity = getCartItemsWithQuantity()
    const paymentBreakdownMap: PaymentBreakDownModel = {}
    if (isInitResultPresent()) {
      initResponse.map((res, ind) => {
        res.message.order.quote.breakup.forEach(breakup => {
          let quantity = cartItemsWithQuantity[breakup.item?.id!]?.quantity || 1
          paymentBreakdownMap[breakup.title] = {
            value: (
              Number(paymentBreakdownMap[breakup.title]?.value || 0) +
              quantity * Number(breakup.price.value) * (type === 'RENT_AND_HIRE' ? duration || 1 : 1)
            ).toString(),
            currency: breakup.price.currency
          }
        })
      })
    }
    console.log(paymentBreakdownMap)

    return paymentBreakdownMap
  }

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader text={t.quoteRequestLoader} />
      </Box>
    )
  }
  const rentalItems =
    selectRentalResponse?.message?.order?.items?.map((singleItem: { name: string; code: string }) => {
      return {
        batteryType: singleItem.name,
        capacity: singleItem.code,
        rentedFrom: selectRentalResponse?.message?.order?.provider?.name,
        timeSlot: `${fromTime} to ${toTime}`,
        duration: `${duration} hrs`
      }
    }) ?? []
  console.log('duration', duration)

  const getCartItemsWithQuantity = () => {
    const cartItemQuantity: any = {}
    cartItems.forEach((item: any) => {
      cartItemQuantity[item.id] = {
        id: item.id,
        quantity: item.quantity
      }
    })
    return cartItemQuantity
  }

  return (
    <Box
      className={`hideScroll ${type !== 'RENT_AND_HIRE' ? 'checkout-open-spark' : ''}`}
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
      padding={'0 10px'}
    >
      {type !== 'RENT_AND_HIRE' && (
        <>
          <Box
            fontSize={'17px'}
            marginBottom="10px"
            mt="10px"
          >
            Order Overview
          </Box>
          <DetailsCard>
            {cartItems.map((singleItem, ind) => (
              <React.Fragment key={ind}>
                <Box pb="10px">
                  <Flex alignItems={'center'}>
                    <Image
                      src={singleItem.images?.[0].url}
                      alt={'img'}
                      width="120px"
                      height="94px"
                    />
                    <Box>
                      <Text
                        fontSize="15px"
                        fontWeight="600"
                        noOfLines={2}
                        textOverflow="ellipsis"
                        whiteSpace="pre-wrap"
                        overflowWrap="break-word"
                        height={'fit-content'}
                        mb="10px"
                      >
                        {singleItem.name}
                      </Text>
                      <Typography
                        text={singleItem.short_desc}
                        variant="subTextRegular"
                      />
                      <Flex>
                        <Typography
                          fontWeight="600"
                          text={'Sold by:'}
                          variant="subTextRegular"
                          style={{ marginRight: '2px', whiteSpace: 'nowrap' }}
                        />
                        <Typography
                          text={singleItem.productInfo.providerName}
                          variant="subTextRegular"
                        />
                      </Flex>
                    </Box>
                  </Flex>

                  <Box>
                    <Flex
                      pb="5px"
                      alignItems="center"
                    >
                      <Flex alignItems="center">
                        <Text
                          mr="10px"
                          fontWeight={'600'}
                        >
                          Qty
                        </Text>
                        <Typography
                          className="quantity-checkout"
                          text={` ${singleItem.quantity.toString()}`}
                          variant="subTextRegular"
                        />
                      </Flex>
                      <Box ml="25px">
                        <ProductPrice
                          price={Number(singleItem.price.value) * singleItem.quantity}
                          currencyType={singleItem.price.currency}
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Box>
                <Divider />
              </React.Fragment>
            ))}
          </DetailsCard>
        </>
      )}

      <Checkout
        schema={{
          ...(type === 'RENT_AND_HIRE' && {
            items: {
              title: t.items,
              data: rentalItems,
              type: type || ''
            }
          }),
          shipping: {
            triggerFormTitle: t.change,
            showDetails: isInitResultPresent(),
            color: type === 'RENT_AND_HIRE' ? color : bgColorOfSecondary,
            shippingDetails: {
              name: shippingFormData.name,
              location: shippingFormData.address!,
              number: shippingFormData.mobileNumber,
              title: '',
              noAccordion: true
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: type === 'RENT_AND_HIRE' ? t.saveBillingDetails : t.saveShippingDetails },
              values: shippingFormData,
              onChange: data => setShippingFormData(data)
            },
            sectionTitle: type === 'RENT_AND_HIRE' ? t.billing : t.shipping,
            formTitle: type === 'RENT_AND_HIRE' ? 'Add Billing Details' : t.addShippingDetails,
            sectionSubtitle: type === 'RENT_AND_HIRE' ? 'Add Billing Details' : t.addShippingDetails,
            dataTest: testIds.checkoutpage_shippingDetails
          },
          billing: {
            triggerFormTitle: t.change,
            dataTest: testIds.checkoutpage_billingDetails,
            sectionSubtitle: t.addBillingDetails,
            sectionTitle: t.billing,
            formTitle: t.addBillingDetails,
            isBilling: true,
            color: bgColorOfSecondary,
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
              title: '',
              noAccordion: true
            },
            shippingForm: {
              formFieldConfig: formFieldConfig,
              onSubmit: formSubmitHandler,
              submitButton: { text: t.saveBillingDetails },
              values: billingFormData,
              onChange: data => setBillingFormData(data)
            }
          },
          payment: {
            title: t.payment,
            paymentDetails: {
              hasBoxShadow: false,
              paymentBreakDown: createPaymentBreakdownMap(),
              totalText: t.total,
              totalValueWithCurrency: {
                value: getSubTotalAndDeliveryCharges(
                  initResponse,
                  type === 'RENT_AND_HIRE' ? duration : getCartItemsWithQuantity()
                ).subTotal.toString(),
                currency: getSubTotalAndDeliveryCharges(initResponse, type === 'RENT_AND_HIRE' ? duration : 1)
                  .currencySymbol!
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
              if (type === 'RENT_AND_HIRE') {
                router.push('/retailPaymentMethod')
              } else {
                // dispatch(cartActions.clearCart())
                router.push('/paymentMode')
              }
              dispatch(
                setEmiDetails({
                  emiDetails: [
                    {
                      ...emiDetails,
                      payableAmount: getSubTotalAndDeliveryCharges(
                        initResponse,
                        type === 'RENT_AND_HIRE' ? duration : getCartItemsWithQuantity()
                      ).subTotal.toString()
                    }
                  ]
                })
              )
            }
          }
        }}
        // isLoading={isLoading}
        hasInitResult={isInitResultPresent()}
      />
    </Box>
  )
}
export default CheckoutPage
