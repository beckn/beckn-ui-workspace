import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Card, CardBody, Container, Divider, Flex, Heading, Stack, Text, useTheme, VStack } from '@chakra-ui/react'
import { BecknAuth, ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { InputProps, Loader } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import {
  CheckoutRootState,
  DiscoveryRootState,
  ICartRootState,
  CartItemForRequest,
  Item,
  ParsedItemModel
} from '@beckn-ui/common'
import { useDispatch, useSelector } from 'react-redux'
import { getCountryCode } from '@utils/general'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { getInitPayload, getSelectPayload } from '@utils/payload'
import { AuthRootState } from '@store/auth-slice'
import { currencyMap, DOMAIN } from '@lib/config'
import { useSelectMutation } from '@beckn-ui/common/src/services/select'
import { useLanguage } from '@hooks/useLanguage'
import { ChargerSelectRootState } from '@store/chargerSelect-slice'
import { useRouter } from 'next/router'
import { cartActions } from '@store/cart-slice'
import { getPaymentBreakDown } from '@utils/checkout-utils'

interface FormData {
  amountToPay: string
  kwhToCharge: string
}

interface FormErrors {
  amountToPay: string
  kwhToCharge: string
}

const validateForm = (formData: FormData) => {
  const errors: FormErrors = { amountToPay: '', kwhToCharge: '' }
  const numberRegex = /^\d*\.?\d*$/

  if (!formData.amountToPay) {
    errors.amountToPay = 'Amount to Pay is required'
  } else if (!numberRegex.test(formData.amountToPay.toString())) {
    errors.amountToPay = 'Please enter a valid number'
  }

  if (!formData.kwhToCharge) {
    errors.kwhToCharge = 'kWh to Charge is required'
  } else if (!numberRegex.test(formData.kwhToCharge.toString())) {
    errors.kwhToCharge = 'Please enter a valid number'
  }

  return errors
}

const ChargerDetails = () => {
  const domain = DOMAIN

  const [formData, setFormData] = useState<FormData>({ amountToPay: '', kwhToCharge: '' })
  const [formErrors, setFormErrors] = useState<FormErrors>({ amountToPay: '', kwhToCharge: '' })
  const [showPayment, setShowPayment] = useState(false)
  const [chargerDetails, setChargerDetails] = useState({
    stationId: '',
    stationName: '',
    chargerId: '',
    chargerName: '',
    portType: '',
    rate: 0,
    power: '',
    portId: ''
  })
  const [isLoading, setIsLoading] = useState<{
    select: boolean
    updateCart: boolean
    initialize: boolean
  }>({
    select: false,
    updateCart: false,
    initialize: false
  })

  const initResponse = useSelector((state: CheckoutRootState) => state.checkout?.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout?.selectResponse)
  const { items, totalQuantity, totalAmount } = useSelector((state: ICartRootState) => state.cart)
  const { selectedCharger } = useSelector((state: ChargerSelectRootState) => state?.selectCharger)
  const { transactionId } = useSelector((state: DiscoveryRootState) => state.discovery)
  const [fetchQuotes, { isLoading: selectLoading, error: selectError }] = useSelectMutation()
  const [initialize, { isLoading: initializeLoading, error: initializeError }] = useInitMutation()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const theme = useTheme()
  const primaryColor = theme.colors.primary[100]

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: '',
    mobileNumber: '',
    email: '',
    address: '',
    pinCode: ''
  })

  useEffect(() => {
    if (items && items.length > 0) {
      setIsLoading(prev => ({ ...prev, select: true }))
      console.log(selectedCharger)
      const firstItem = items[0] as CartItemForRequest
      const initialAmount = parseFloat(selectedCharger?.rate?.toString() || '0') || 0
      const initialKwh = parseFloat(firstItem.quantity.toString()) || 0

      setChargerDetails({
        stationName: firstItem.providerName || '',
        stationId: firstItem.providerId || '',
        chargerName: selectedCharger?.name || '',
        chargerId: selectedCharger?.id || '',
        portType: selectedCharger?.selectedPort?.type || '',
        rate: initialAmount,
        power: firstItem.shortDesc || '',
        portId: selectedCharger?.selectedPort?.type || ''
      })

      setFormData({
        amountToPay: totalAmount.toString(),
        kwhToCharge: totalQuantity.toString()
      })

      fetchQuotes(
        getSelectPayload(
          items,
          transactionId,
          DOMAIN,
          {
            location: getCountryCode()
          },
          selectedCharger || undefined
        )
      )
        .unwrap()
        .then(() => {})
        .catch(() => {
          setIsLoading(prev => ({ ...prev, select: false }))
        })
    }
  }, [items, transactionId, selectedCharger, totalQuantity])

  useEffect(() => {
    console.log('Dank user', user)

    let formData = {
      name: '',
      mobileNumber: '',
      email: '',
      address: '5890 W Vernor Hwy, Detroit, Michigan',
      pinCode: '48209'
    }

    if (user?.agent) {
      // If user.agent exists, use its data
      formData = {
        ...formData,
        name: user.agent.first_name.trim(),
        mobileNumber: `${user.agent.agent_profile.phone_number}`,
        email: user.email || '',
        address: '5890 W Vernor Hwy, Detroit, Michigan',
        pinCode: '48209'
      }
    } else {
      // If no user.agent, use default data
      formData = {
        ...formData,
        name: 'Lisa',
        mobileNumber: '9811259151',
        email: 'lisa.k@gmail.com',
        address: '5890 W Vernor Hwy, Detroit, Michigan',
        pinCode: '48209'
      }
    }

    console.log('Dank formData', formData)
    setShippingFormData(formData)
    setBillingFormData(formData)
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log('Dank value', Number(value))
    const numericValue = value

    if (Number(numericValue) < 0) return

    let updatedFormData = { ...formData }

    if (name === 'kwhToCharge') {
      const calculatedAmount = Number((parseFloat(numericValue) * chargerDetails.rate).toFixed(2))

      updatedFormData = {
        ...formData,
        kwhToCharge: numericValue,
        amountToPay: calculatedAmount.toString()
      }
    } else if (name === 'amountToPay') {
      const calculatedKwh = Number((parseFloat(numericValue) / chargerDetails.rate).toFixed(2))
      updatedFormData = {
        ...formData,
        amountToPay: numericValue,
        kwhToCharge: calculatedKwh.toString()
      }
    }

    setFormData(updatedFormData)

    const errors = validateForm(updatedFormData)
    setFormErrors(prevErrors => ({
      ...prevErrors,
      ['kwhToCharge']: errors['kwhToCharge'] || '',
      ['amountToPay']: errors['amountToPay'] || ''
    }))
  }

  const getInputs = () => {
    const inputs: InputProps[] = [
      {
        type: 'number',
        name: 'amountToPay',
        variant: 'rounded',
        className: 'amount-to-pay-input',
        value: formData.amountToPay.toString(),
        handleChange: handleInputChange,
        label: 'Amount to Pay',
        error: formErrors.amountToPay,
        dataTest: '',
        disabled: true,
        step: '0.01',
        leftElement: () => (
          <Text fontSize={'14px'}>{currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}</Text>
        )
      },
      {
        type: 'number',
        name: 'kwhToCharge',
        variant: 'rounded',
        className: 'kwh-to-charge-input',
        value: formData.kwhToCharge.toString(),
        handleChange: handleInputChange,
        label: 'kWh to Charge',
        error: formErrors.kwhToCharge,
        dataTest: '',
        disabled: initResponse.length > 0,
        step: '0.01'
      }
    ]
    return inputs
  }

  const handleInitCall = useCallback(async () => {
    if (selectResponse.length === 0) return
    const { id, type } = selectResponse[0]?.message?.order?.fulfillments[0] || {}

    const payloadPromise = getInitPayload(
      shippingFormData,
      billingFormData,
      { cartItems: items, updatedQuantity: formData.kwhToCharge },
      transactionId,
      domain,
      { id, type },
      {
        location: getCountryCode()
      }
    )
    payloadPromise
      .then(async res => {
        await initialize(res)
        setShowPayment(true)
      })
      .finally(() => {
        setIsLoading(prev => ({ ...prev, updateCart: false }))
      })
  }, [shippingFormData, billingFormData, items, transactionId, domain, selectResponse, formData])

  const handleInitialize = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, updateCart: true }))

    await new Promise<void>(resolve => {
      dispatch(
        cartActions.addItemToCart({
          product: {
            ...selectedCharger?.data?.providerDetails,
            item: selectedCharger?.data?.itemDetails as Item
          } as ParsedItemModel,
          amountToPay: parseFloat(formData.amountToPay),
          quantity: parseFloat(formData.kwhToCharge)
        })
      )
      resolve()
    })

    await handleInitCall()
  }, [formData, selectedCharger, dispatch])

  const isFormFilled = useMemo(() => {
    return (
      Object.values(formData).every(value => value !== '' && value > 0) &&
      Object.values(formErrors).every(value => value === '')
    )
  }, [formData, formErrors])

  if (isLoading.select && !isLoading.updateCart) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
        justifyContent={'center'}
      >
        <Loader text={t.quoteRequestLoader} />
      </Box>
    )
  }

  if (selectError || initializeError) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
        justifyContent={'center'}
      >
        <Text fontSize={'16px'}>{t.errorText}</Text>
      </Box>
    )
  }

  return (
    <Container
      maxW="md"
      padding={'20px 0px'}
    >
      <VStack
        spacing={6}
        align="stretch"
      >
        {/* Charger Details Card */}
        <Card
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <CardBody p={'10px'}>
            <Heading
              size="md"
              mb={4}
              fontSize={'16px'}
              fontWeight="400"
            >
              Charger Details
            </Heading>

            <Stack spacing={1}>
              <Flex justify="space-between">
                <Text
                  color="#595959"
                  fontWeight={'500'}
                >
                  Station Name
                </Text>
                <Text
                  color={'#797979'}
                  fontWeight={'500'}
                >
                  {chargerDetails.stationName}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text
                  color="#595959"
                  fontWeight={'500'}
                >
                  Charger Name
                </Text>
                <Text
                  color={'#797979'}
                  fontWeight={'500'}
                >
                  {chargerDetails.chargerName}
                </Text>
              </Flex>

              <Flex justify="space-between">
                <Text
                  color="#595959"
                  fontWeight={'500'}
                >
                  Rate
                </Text>
                <Text
                  color={'#4461F2'}
                  fontWeight={'500'}
                >
                  {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                  {chargerDetails.rate} / kwh
                </Text>
              </Flex>

              <Box
                mt={2}
                bg="#F0F0F0"
                borderRadius="md"
                p={'10px'}
              >
                <Flex justify="space-between">
                  <Flex
                    textAlign="center"
                    flex={1}
                    flexDirection={'column'}
                    gap={'10px'}
                  >
                    <Text
                      color={'#595959'}
                      fontWeight={'500'}
                    >
                      {chargerDetails.chargerId}
                    </Text>
                    <Text
                      color="#797979"
                      fontSize="12px"
                    >
                      Charger ID
                    </Text>
                  </Flex>

                  <Divider
                    orientation="vertical"
                    borderColor="#BFBFBF"
                    height="50px"
                    margin="0 10px"
                  />

                  <Flex
                    textAlign="center"
                    flex={1}
                    flexDirection={'column'}
                    gap={'10px'}
                  >
                    <Text
                      color={'#595959'}
                      fontWeight={'500'}
                    >
                      {chargerDetails.portType}
                    </Text>
                    <Text
                      color="#797979"
                      fontSize="12px"
                    >
                      Port Type
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </Stack>
          </CardBody>
        </Card>

        {/* Connector Tariffs Card */}
        <Card
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <CardBody p={'10px'}>
            <Heading
              size="md"
              fontSize={'16px'}
              fontWeight="400"
            >
              Connector Tariffs
            </Heading>

            <Box className="book_charger_form">
              <BecknAuth
                schema={{
                  buttons: [
                    {
                      text: 'Confirm',
                      handleClick: handleInitialize,
                      variant: 'solid',
                      colorScheme: 'primary',
                      isLoading: isLoading.updateCart,
                      disabled: !isFormFilled || initResponse.length > 0
                    }
                  ],
                  inputs: getInputs()
                }}
                isLoading={false}
              />
            </Box>
          </CardBody>
        </Card>

        {/* Payment Section - Only shown after confirmation */}
        {showPayment && initResponse.length > 0 && (
          <>
            <Card
              borderRadius="lg"
              boxShadow="md"
              overflow="hidden"
            >
              <CardBody p={2}>
                <Heading
                  size="md"
                  mb={4}
                  fontSize={'16px'}
                  fontWeight="400"
                >
                  Payment
                </Heading>

                <Stack spacing={3}>
                  {Object.entries(getPaymentBreakDown(initResponse, parseFloat(formData.kwhToCharge)).breakUpMap).map(
                    ([label, amount]) => (
                      <Flex
                        key={label}
                        justify="space-between"
                      >
                        <Text
                          color="#000000"
                          fontSize={'12px'}
                          fontWeight={'500'}
                        >
                          {label}
                        </Text>
                        <Text
                          color="#797979"
                          fontSize={'12px'}
                          fontWeight={'500'}
                        >
                          {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                          {amount.value}
                        </Text>
                      </Flex>
                    )
                  )}
                </Stack>
              </CardBody>
            </Card>

            {/* Total Amount Section */}
            <Card
              borderRadius="lg"
              boxShadow="md"
              overflow="hidden"
            >
              <CardBody p={2}>
                <Flex
                  justify="space-between"
                  align="center"
                >
                  <Flex
                    flexDir={'column'}
                    gap={'2px'}
                  >
                    <Text
                      color="#000000"
                      fontSize={'12px'}
                      fontWeight="500"
                      whiteSpace={'nowrap'}
                    >
                      Total Amount
                    </Text>
                    <Text
                      color={primaryColor}
                      fontSize="15px"
                      fontWeight="700"
                    >
                      {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                      {getPaymentBreakDown(initResponse, parseFloat(formData.kwhToCharge)).totalPricewithCurrent.value}
                    </Text>
                  </Flex>
                  <Box>
                    <BecknButton
                      text="Proceed to pay"
                      sx={{
                        marginBottom: '0px'
                      }}
                      handleClick={() => router.push('/paymentMode')}
                    />
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          </>
        )}
      </VStack>
    </Container>
  )
}

export default ChargerDetails
