import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Container,
  Text,
  Flex,
  VStack,
  HStack,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  IconButton,
  Divider,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton
} from '@chakra-ui/react'
import { DOMAIN } from '@lib/config'
import { useLanguage } from '../hooks/useLanguage'
import {
  getInitPayload,
  getItemWiseBreakUp,
  getTotalPriceWithCurrency,
  createPaymentBreakdownMap
} from '@beckn-ui/common/src/utils'
import { useRouter } from 'next/router'
import { ShippingFormInitialValuesType } from '@beckn-ui/becknified-components'
import { checkoutActions, CheckoutRootState } from '@beckn-ui/common/src/store/checkout-slice'
import { useInitMutation } from '@beckn-ui/common/src/services/init'
import { DiscoveryRootState, ICartRootState } from '@beckn-ui/common'
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiArrowRight, FiArrowLeft, FiPlus } from 'react-icons/fi'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import ItemDetails from '@components/checkout/ItemDetails'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'

const CheckoutPage = () => {
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const router = useRouter()
  const dispatch = useDispatch()
  const [initialize, { isLoading }] = useInitMutation()
  const { t } = useLanguage()
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const selectResponse = useSelector((state: CheckoutRootState) => state.checkout.selectResponse)
  const isBillingSameRedux = useSelector((state: CheckoutRootState) => state.checkout.isBillingSame)
  const { transactionId } = useSelector((state: DiscoveryRootState) => state.discovery)

  const [shippingFormData, setShippingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'Santosh Kumar',
    mobileNumber: '9876543210',
    email: 'santosh.k@gmail.com',
    address: '1394, Sunshine Colony, Bengaluru, Karnataka',
    pinCode: '560076'
  })

  const [billingFormData, setBillingFormData] = useState<ShippingFormInitialValuesType>({
    name: 'Santosh Kumar',
    mobileNumber: '9876543210',
    email: 'santosh.k@gmail.com',
    address: '1394, Sunshine Colony, Bengaluru, Karnataka',
    pinCode: '560076'
  })

  const [shippingErrors, setShippingErrors] = useState<Record<string, string>>({})
  const [billingErrors, setBillingErrors] = useState<Record<string, string>>({})
  const { isOpen: isShippingOpen, onOpen: onShippingOpen, onClose: onShippingClose } = useDisclosure()
  const { isOpen: isBillingOpen, onOpen: onBillingOpen, onClose: onBillingClose } = useDisclosure()

  useEffect(() => {
    if (localStorage) {
      if (localStorage.getItem('userPhone')) {
        const phone = localStorage.getItem('userPhone') as string
        setShippingFormData(prev => ({ ...prev, mobileNumber: phone }))
        setBillingFormData(prev => ({ ...prev, mobileNumber: phone }))
      }
      if (localStorage.getItem('shippingAdress')) {
        setShippingFormData(JSON.parse(localStorage.getItem('shippingAdress') as string))
      }
      if (localStorage.getItem('billingAddress')) {
        setBillingFormData(JSON.parse(localStorage.getItem('billingAddress') as string))
      }
    }
  }, [])

  useEffect(() => {
    if (isBillingSameRedux) {
      setBillingFormData(shippingFormData)
    }
  }, [isBillingSameRedux, shippingFormData])

  useEffect(() => {
    const shippingAddressComplete = Object.values(shippingFormData).every(value => value && value.length > 0)
    if (shippingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('shippingAdress', JSON.stringify(shippingFormData))
    }
  }, [shippingFormData])

  useEffect(() => {
    const isBillingAddressComplete = Object.values(billingFormData).every(value => value && value.length > 0)
    if (isBillingAddressComplete && typeof window !== 'undefined') {
      localStorage.setItem('billingAddress', JSON.stringify(billingFormData))
    }
  }, [billingFormData])

  const validateShipping = (): boolean => {
    const errors: Record<string, string> = {}
    if (!shippingFormData.name?.trim()) errors.name = 'Name is required'
    if (!shippingFormData.mobileNumber?.trim()) errors.mobileNumber = 'Phone is required'
    if (!shippingFormData.email?.trim()) errors.email = 'Email is required'
    if (!shippingFormData.address?.trim()) errors.address = 'Address is required'
    if (!shippingFormData.pinCode?.trim()) errors.pinCode = 'PIN code is required'
    setShippingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateBilling = (): boolean => {
    const errors: Record<string, string> = {}
    if (!billingFormData.name?.trim()) errors.name = 'Name is required'
    if (!billingFormData.mobileNumber?.trim()) errors.mobileNumber = 'Phone is required'
    if (!billingFormData.email?.trim()) errors.email = 'Email is required'
    if (!billingFormData.address?.trim()) errors.address = 'Address is required'
    if (!billingFormData.pinCode?.trim()) errors.pinCode = 'PIN code is required'
    setBillingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const initCall = async () => {
    if (!selectResponse || selectResponse.length === 0) {
      console.error('Select response is not available. Please go back to cart and try again.')
      return
    }
    try {
      const payload = await getInitPayload(
        shippingFormData,
        billingFormData,
        cartItems,
        transactionId,
        DOMAIN,
        selectResponse
      )
      console.log('payload', payload)
      await initialize(payload)
    } catch (error) {
      console.error('Init API call failed:', error)
    }
  }

  const handleSaveShipping = async () => {
    if (validateShipping()) {
      onShippingClose()
      await initCall()
    }
  }

  const handleSaveBilling = async () => {
    if (validateBilling()) {
      onBillingClose()
      await initCall()
    }
  }

  const isInitResultPresent = () => {
    return !!initResponse && initResponse.length > 0
  }

  const isShippingComplete = () => {
    return Object.values(shippingFormData).every(v => v && v.trim() !== '')
  }

  const isBillingComplete = () => {
    return Object.values(billingFormData).every(v => v && v.trim() !== '')
  }

  const canProceed = () => {
    return isInitResultPresent() && isShippingComplete() && isBillingComplete()
  }

  // Get payment breakdown from init response
  const paymentBreakdownMap = isInitResultPresent() ? createPaymentBreakdownMap(initResponse) : {}
  const paymentBreakdown =
    paymentBreakdownMap && typeof paymentBreakdownMap === 'object' && !Array.isArray(paymentBreakdownMap)
      ? Object.entries(paymentBreakdownMap).map(([title, price]) => ({
          title,
          value: typeof price === 'object' && price.value ? price.value : String(price)
        }))
      : Array.isArray(paymentBreakdownMap)
        ? paymentBreakdownMap
        : []
  const totalPriceObj = isInitResultPresent() ? getTotalPriceWithCurrency(initResponse) : { value: 0, currency: 'INR' }

  if (isLoading) {
    return (
      <Box
        display="grid"
        height="calc(100vh - 300px)"
        alignContent="center"
      >
        <LoaderWithMessage
          loadingText={t.pleaseWait || 'Please wait'}
          loadingSubText={t.initializingOrderLoader || 'Initializing your order...'}
        />
      </Box>
    )
  }

  return (
    <Box
      bg="gray.50"
      minH="calc(100vh - 100px)"
      py={{ base: '16px', md: '24px' }}
    >
      <Container maxW="1200px">
        {/* Header */}
        <Flex align="center">
          <IconButton
            aria-label="Go Back"
            icon={<FiArrowLeft />}
            size="lg"
            w="56px"
            h="56px"
            minW="56px"
            fontSize="24px"
            variant="ghost"
            onClick={() => router.back()}
          />
          <Text
            fontSize={{ base: '24px', md: '32px' }}
            fontWeight="700"
            color="gray.800"
            mb={'10px'}
          >
            {t.orderOverview || 'Checkout'}
          </Text>
        </Flex>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap="24px"
        >
          {/* Left Column - Items & Addresses */}
          <VStack
            flex="1"
            spacing="20px"
            align="stretch"
          >
            {/* Order Overview */}
            <Box
              bg="white"
              borderRadius={{ base: '16px', md: '20px' }}
              p={{ base: '16px', md: '24px' }}
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            >
              <Box className="overview-checkout">
                {cartItems.map((item, idx) => {
                  const itemBreakUp = getItemWiseBreakUp(selectResponse, item.id)
                  return (
                    <Fragment key={item.id}>
                      <DetailsCard>
                        <ItemDetails
                          title={item.name}
                          description={item.short_desc}
                          quantity={item.quantity}
                          price={Number(itemBreakUp.totalPricewithCurrent.value)}
                          currency={item.price.currency || 'INR'}
                          image={item.images?.[0]?.url}
                          breakUp={itemBreakUp.paymentBreakdownMap}
                        />
                      </DetailsCard>
                      {idx < cartItems.length - 1 && (
                        <Divider
                          color="#BFBFBF"
                          my="16px"
                          border="0.5px solid #BFBFBF"
                          opacity={0.5}
                        />
                      )}
                    </Fragment>
                  )
                })}
              </Box>
            </Box>

            {/* Delivery Address */}
            <Box
              bg="white"
              borderRadius={{ base: '16px', md: '20px' }}
              p={{ base: '16px', md: '24px' }}
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            >
              <Flex
                justify="space-between"
                align="center"
                mb="4px"
              >
                <Text
                  fontSize={{ base: '18px', md: '20px' }}
                  fontWeight="700"
                  color="gray.800"
                >
                  {t.shipping || 'Delivery Address'}
                </Text>
                {isShippingComplete() && (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorScheme="orange"
                    mb="0px"
                    leftIcon={<FiEdit2 />}
                    onClick={onShippingOpen}
                  >
                    {t.change || 'Change'}
                  </Button>
                )}
              </Flex>

              {isShippingComplete() ? (
                <VStack
                  align="start"
                  spacing="8px"
                >
                  <Text fontWeight="600">{shippingFormData.name}</Text>
                  <HStack
                    color="gray.600"
                    fontSize="14px"
                  >
                    <FiMapPin />
                    <Text>
                      {shippingFormData.address}, {shippingFormData.pinCode}
                    </Text>
                  </HStack>
                  <Flex
                    flexWrap="wrap"
                    gap="16px"
                    color="gray.600"
                    fontSize="14px"
                  >
                    <HStack>
                      <FiPhone />
                      <Text>{shippingFormData.mobileNumber}</Text>
                    </HStack>
                    <HStack>
                      <FiMail />
                      <Text>{shippingFormData.email}</Text>
                    </HStack>
                  </Flex>
                </VStack>
              ) : (
                <Button
                  w="100%"
                  bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
                  color="white"
                  size="md"
                  padding="10px 20px"
                  fontSize="14px"
                  borderRadius="12px"
                  leftIcon={<FiPlus />}
                  onClick={onShippingOpen}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)' }}
                >
                  {t.addShippingDetails || 'Add Delivery Address'}
                </Button>
              )}
            </Box>

            {/* Billing Address */}
            <Box
              bg="white"
              borderRadius={{ base: '16px', md: '20px' }}
              p={{ base: '16px', md: '24px' }}
              boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            >
              <Flex
                justify="space-between"
                align="center"
                mb="16px"
              >
                <Text
                  fontSize={{ base: '18px', md: '20px' }}
                  fontWeight="700"
                  color="gray.800"
                >
                  {t.billing || 'Billing Address'}
                </Text>
                {isBillingComplete() && !isBillingSameRedux && (
                  <Button
                    size="sm"
                    variant="ghost"
                    mb="0px"
                    colorScheme="orange"
                    leftIcon={<FiEdit2 />}
                    onClick={onBillingOpen}
                  >
                    {t.change || 'Change'}
                  </Button>
                )}
              </Flex>

              <Checkbox
                isChecked={isBillingSameRedux}
                onChange={() => dispatch(checkoutActions.setIsBillingSame({ isBillingSame: !isBillingSameRedux }))}
                colorScheme="orange"
                mb="16px"
                fontSize="14px"
              >
                Same as delivery address
              </Checkbox>

              {!isBillingSameRedux &&
                (isBillingComplete() ? (
                  <VStack
                    align="start"
                    spacing="8px"
                  >
                    <Text fontWeight="600">{billingFormData.name}</Text>
                    <HStack
                      color="gray.600"
                      fontSize="14px"
                    >
                      <FiMapPin />
                      <Text>
                        {billingFormData.address}, {billingFormData.pinCode}
                      </Text>
                    </HStack>
                  </VStack>
                ) : (
                  <Button
                    w="100%"
                    bg="linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)"
                    color="white"
                    size="lg"
                    borderRadius="12px"
                    leftIcon={<FiPlus />}
                    onClick={onBillingOpen}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(255, 107, 53, 0.3)' }}
                  >
                    {t.addBillingDetails || 'Add Billing Address'}
                  </Button>
                ))}
            </Box>
          </VStack>

          {/* Right Column - Payment Summary */}
          <Box
            w={{ base: '100%', lg: '400px' }}
            bg="white"
            borderRadius={{ base: '16px', md: '20px' }}
            p={{ base: '16px', md: '24px' }}
            boxShadow="0 2px 12px rgba(0,0,0,0.08)"
            h="fit-content"
            position={{ base: 'relative', lg: 'sticky' }}
            top="24px"
          >
            <Text
              fontSize={{ base: '18px', md: '20px' }}
              fontWeight="700"
              color="gray.800"
              mb="20px"
            >
              {t.payment || 'Payment Summary'}
            </Text>

            <VStack
              spacing="12px"
              align="stretch"
              mb="20px"
            >
              {paymentBreakdown.length > 0 ? (
                paymentBreakdown.map((item, idx) => (
                  <Flex
                    key={idx}
                    justify="space-between"
                  >
                    <Text color="gray.600">{item.title}</Text>
                    <Text fontWeight="600">₹{item.value}</Text>
                  </Flex>
                ))
              ) : (
                <Text
                  color="gray.500"
                  textAlign="center"
                  py="20px"
                >
                  Add delivery address to see payment details
                </Text>
              )}

              {paymentBreakdown.length > 0 && (
                <>
                  <Divider />
                  <Flex justify="space-between">
                    <Text
                      fontSize="18px"
                      fontWeight="700"
                    >
                      {t.total || 'Total'}
                    </Text>
                    <Text
                      fontSize="18px"
                      fontWeight="700"
                      color="#FF6B35"
                    >
                      ₹{typeof totalPriceObj === 'object' ? totalPriceObj.value?.toFixed(2) : totalPriceObj}
                    </Text>
                  </Flex>
                </>
              )}
            </VStack>

            <Button
              w="100%"
              bg="#FF6B35"
              color="white"
              size="lg"
              borderRadius="12px"
              fontSize="18px"
              fontWeight="700"
              py="20px"
              rightIcon={<FiArrowRight />}
              onClick={() => router.push('/paymentMode')}
              isDisabled={!canProceed()}
              _hover={{ bg: '#E55A2B', transform: 'translateY(-2px)' }}
              _disabled={{ bg: 'gray.300', cursor: 'not-allowed' }}
            >
              {t.proceedToCheckout || 'Proceed to Payment'}
            </Button>
          </Box>
        </Flex>
      </Container>

      {/* Shipping Modal */}
      <Modal
        isOpen={isShippingOpen}
        onClose={onShippingClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent
          mx="16px"
          borderRadius="20px"
        >
          <ModalHeader>{t.addShippingDetails || 'Delivery Address'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="24px">
            <VStack spacing="16px">
              <FormControl isInvalid={!!shippingErrors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={shippingFormData.name}
                  onChange={e => setShippingFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{shippingErrors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!shippingErrors.mobileNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={shippingFormData.mobileNumber}
                  onChange={e => setShippingFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  placeholder="Enter phone number"
                  type="tel"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{shippingErrors.mobileNumber}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!shippingErrors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={shippingFormData.email}
                  onChange={e => setShippingFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                  type="email"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{shippingErrors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!shippingErrors.address}>
                <FormLabel>Address</FormLabel>
                <Input
                  value={shippingFormData.address}
                  onChange={e => setShippingFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{shippingErrors.address}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!shippingErrors.pinCode}>
                <FormLabel>PIN Code</FormLabel>
                <Input
                  value={shippingFormData.pinCode}
                  onChange={e => setShippingFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                  placeholder="Enter PIN code"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{shippingErrors.pinCode}</FormErrorMessage>
              </FormControl>
              <Button
                w="100%"
                bg="#FF6B35"
                color="white"
                size="lg"
                borderRadius="12px"
                onClick={handleSaveShipping}
                _hover={{ bg: '#E55A2B' }}
              >
                {t.saveShippingDetails || 'Save Address'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Billing Modal */}
      <Modal
        isOpen={isBillingOpen}
        onClose={onBillingClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent
          mx="16px"
          borderRadius="20px"
        >
          <ModalHeader>{t.addBillingDetails || 'Billing Address'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="24px">
            <VStack spacing="16px">
              <FormControl isInvalid={!!billingErrors.name}>
                <FormLabel>Full Name</FormLabel>
                <Input
                  value={billingFormData.name}
                  onChange={e => setBillingFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{billingErrors.name}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!billingErrors.mobileNumber}>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  value={billingFormData.mobileNumber}
                  onChange={e => setBillingFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                  placeholder="Enter phone number"
                  type="tel"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{billingErrors.mobileNumber}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!billingErrors.email}>
                <FormLabel>Email</FormLabel>
                <Input
                  value={billingFormData.email}
                  onChange={e => setBillingFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                  type="email"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{billingErrors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!billingErrors.address}>
                <FormLabel>Address</FormLabel>
                <Input
                  value={billingFormData.address}
                  onChange={e => setBillingFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter full address"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{billingErrors.address}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!billingErrors.pinCode}>
                <FormLabel>PIN Code</FormLabel>
                <Input
                  value={billingFormData.pinCode}
                  onChange={e => setBillingFormData(prev => ({ ...prev, pinCode: e.target.value }))}
                  placeholder="Enter PIN code"
                  borderRadius="12px"
                  size="lg"
                />
                <FormErrorMessage>{billingErrors.pinCode}</FormErrorMessage>
              </FormControl>
              <Button
                w="100%"
                bg="#FF6B35"
                color="white"
                size="lg"
                borderRadius="12px"
                onClick={handleSaveBilling}
                _hover={{ bg: '#E55A2B' }}
              >
                {t.saveBillingDetails || 'Save Address'}
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default CheckoutPage
