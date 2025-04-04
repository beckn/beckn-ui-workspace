import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { CheckoutRootState, discoveryActions, ICartRootState, PaymentMethodSelectionProps } from '@beckn-ui/common'
import { testIds } from '@shared/dataTestIds'
import Visa from '@public/images/visa.svg'
import masterCard from '@public/images/masterCard.svg'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Divider,
  Flex,
  Input,
  ButtonProps,
  Image,
  useToast
} from '@chakra-ui/react'
// import phonePay from '@public/images/phonePayPayment.svg'
// import gPay from '@public/images/gpay.svg'
import applyPay from '@public/images/visaNew.svg'
import stripePay from '@public/images/masterNew.svg'
import CashOnDelivery from '@public/images/cash.svg'
import NetBanking from '@public/images/netbanking.svg'
import { BottomModal, InputProps, Loader, SelectOptionType, Typography } from '@beckn-ui/molecules'
import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useDispatch, useSelector } from 'react-redux'
import axios from '@services/axios'
import { parseSearchFinancelist } from '@utils/serach-utils-finance'
import { discoveryEmiPlanActions } from '@store/discoveryEmiPlan-slice'
import AddNewItemModal from '@components/modal/AddNewItemModal'
import { emiFormActions } from '@store/emiForm-slice'
import { setApiResponse, setEmiDetails } from '@store/emiSelect-slice'
import { UserRootState } from '@store/user-slice'
import { AuthRootState } from '@store/auth-slice'
import { useGetDocumentsMutation } from '@services/walletService'
import { parseDIDData } from '@utils/did'
import { ItemMetaData } from '@lib/types/becknDid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface FormData {
  fullName: string
  dateOfBirth: Date | null
  panCard: string
  aadhaar: string
  mobileNumber: string
}

interface FormErrors {
  fullName?: string
  dateOfBirth?: string
  panCard?: string
  aadhaar?: string
  mobileNumber?: string
}

// Add interface for EMIApplicationModal props
interface EMIApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  handleSyncWallet: () => void
  syncWalletIsLoading?: boolean
  walletDetails?: { aadharNumber: string; panNumber: string }
  handleOnSubmitForm: () => void
}

const EMIApplicationModal = ({
  isOpen,
  onClose,
  handleSyncWallet,
  syncWalletIsLoading,
  walletDetails,
  handleOnSubmitForm
}: EMIApplicationModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: null,
    panCard: walletDetails?.panNumber || '',
    aadhaar: walletDetails?.aadharNumber || '',
    mobileNumber: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const toast = useToast()

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      panCard: walletDetails?.panNumber || '',
      aadhaar: walletDetails?.aadharNumber || ''
    }))
  }, [walletDetails])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

    // PAN Card validation
    if (!formData.panCard.trim()) {
      newErrors.panCard = 'PAN card number is required'
    } else if (!/^[A-Z0-9]{10}$/.test(formData.panCard.toUpperCase())) {
      newErrors.panCard = 'PAN card must be 10 characters'
    }

    // Aadhaar validation
    if (!formData.aadhaar.trim()) {
      newErrors.aadhaar = 'Aadhaar number is required'
    } else if (!/^\d{12}$/.test(formData.aadhaar)) {
      newErrors.aadhaar = 'Aadhaar must be 12 digits'
    }

    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Input restrictions
    if (field === 'mobileNumber' && !/^\d*$/.test(value)) {
      return // Only allow digits in mobile number
    }
    if (field === 'aadhaar' && !/^\d*$/.test(value)) {
      return // Only allow digits in aadhaar
    }
    if (field === 'panCard') {
      value = value.toUpperCase() // Convert PAN to uppercase
      if (value.length > 10) return // Limit to 10 characters
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Add your submission logic here
      toast({
        title: 'Success',
        description: 'Form submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
      handleOnSubmitForm()
    } else {
      toast({
        title: 'Error',
        description: 'Please fill all required fields correctly',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box pt="20px">
        <Flex
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            fontSize="17px"
            text="EMI Application"
          />
          <Typography
            fontSize="15px"
            fontWeight="500"
            color="#228B22"
            text="Sync wallet"
            onClick={handleSyncWallet}
          />
        </Flex>
        <Divider
          mb="24px"
          mt="4px"
        />
      </Box>

      {syncWalletIsLoading ? (
        <>
          <Box
            display={'grid'}
            height={'calc(100vh - 510px)'}
            alignContent={'center'}
          >
            <Loader />
          </Box>
        </>
      ) : (
        <>
          {/* Full Name Field */}
          <Box mb="20px">
            <Typography
              fontWeight="400"
              fontSize="15px"
              text="Full Name *"
            />
            <Input
              value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.fullName ? 'red.500' : '#228B22' }}
              border="unset"
              borderBottom="1px solid"
              borderColor={errors.fullName ? 'red.500' : '#3A3A3A'}
              borderRadius="0"
            />
            {errors.fullName && (
              <Typography
                color="red.500"
                fontSize="12px"
                text={errors.fullName}
              />
            )}
          </Box>

          {/* Date of Birth Field */}
          <Box
            mb="20px"
            position="relative"
            width="100%"
          >
            <Typography
              fontWeight="400"
              fontSize="15px"
              text="Date of Birth *"
            />
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={date => {
                setFormData(prev => ({ ...prev, dateOfBirth: date }))
                if (errors.dateOfBirth) {
                  setErrors(prev => ({ ...prev, dateOfBirth: undefined }))
                }
              }}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              customInput={
                <Input
                  width="100%"
                  paddingInlineStart="unset"
                  _focusVisible={{ borderColor: errors.dateOfBirth ? 'red.500' : '#228B22' }}
                  border="unset"
                  borderBottom="1px solid"
                  borderColor={errors.dateOfBirth ? 'red.500' : '#3A3A3A'}
                  borderRadius="0"
                  style={{ width: '100%' }}
                />
              }
            />
            {errors.dateOfBirth && (
              <Typography
                color="red.500"
                fontSize="12px"
                text={errors.dateOfBirth}
              />
            )}
          </Box>

          {/* PAN Card Field */}
          <Box mb="20px">
            <Typography
              fontWeight="400"
              fontSize="15px"
              text="PAN Card *"
            />
            <Input
              value={formData.panCard}
              onChange={e => handleInputChange('panCard', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.panCard ? 'red.500' : '#228B22' }}
              border="unset"
              borderBottom="1px solid"
              borderColor={errors.panCard ? 'red.500' : '#3A3A3A'}
              borderRadius="0"
            />
            {errors.panCard && (
              <Typography
                color="red.500"
                fontSize="12px"
                text={errors.panCard}
              />
            )}
          </Box>

          {/* Aadhaar Field */}
          <Box mb="20px">
            <Typography
              fontWeight="400"
              fontSize="15px"
              text="Aadhaar *"
            />
            <Input
              value={formData.aadhaar}
              onChange={e => handleInputChange('aadhaar', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.aadhaar ? 'red.500' : '#228B22' }}
              border="unset"
              borderBottom="1px solid"
              borderColor={errors.aadhaar ? 'red.500' : '#3A3A3A'}
              borderRadius="0"
            />
            {errors.aadhaar && (
              <Typography
                color="red.500"
                fontSize="12px"
                text={errors.aadhaar}
              />
            )}
          </Box>

          {/* Mobile Number Field */}
          <Box mb="20px">
            <Typography
              fontWeight="400"
              fontSize="15px"
              text="Mobile Number *"
            />
            <Input
              value={formData.mobileNumber}
              onChange={e => handleInputChange('mobileNumber', e.target.value)}
              maxLength={10}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.mobileNumber ? 'red.500' : '#228B22' }}
              border="unset"
              borderBottom="1px solid"
              borderColor={errors.mobileNumber ? 'red.500' : '#3A3A3A'}
              borderRadius="0"
              type="tel"
            />
            {errors.mobileNumber && (
              <Typography
                color="red.500"
                fontSize="12px"
                text={errors.mobileNumber}
              />
            )}
          </Box>

          <BecknButton
            text="Submit"
            handleClick={handleSubmit}
          />
        </>
      )}
    </BottomModal>
  )
}

const PaymentMode = (props: PaymentMethodSelectionProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [emiPlans, setEmiPlans] = useState<any[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)

  const [isLoading, setIsLoading] = useState(false)
  const [syncWalletIsLoading, setSyncWalletIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [checkedState, setCheckedState] = useState<string | null>(null)
  const [checkedPayment, setCheckedPayment] = useState<string | null>(null)
  const formData = useSelector((state: any) => state.emiForm)
  const emiPlansData = useSelector((state: any) => state.discoveryEmiPlan)
  const { transactionId, products } = useSelector((state: any) => state.discoveryEmiPlan)
  const [selectedEmiDetails, setSelectedEmiDetails] = useState<any>(null)
  const price = initResponse[0]?.message.order.quote.price || 0
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const [aadharNumber, setAadharNumber] = useState<string>()
  const [PANNumber, setPANNumber] = useState<string>()
  const [payableAmount, setPayableAmount] = useState<number>()
  const [dicountedSearch, setDicountedSearch] = useState(false)
  const [previousIndex, setPreviousIndex] = useState<number>()
  const [newTotalCost, setNewTotalCost] = useState(() => {
    return Number(localStorage.getItem('totalCost')) || 0
  })

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchEMIPlans = (isDiscounted = false) => {
    const searchPayload = {
      context: {
        domain: 'deg:finance'
      },
      searchString: '',
      ...(isDiscounted && {
        tags: [
          {
            descriptor: {
              code: 'preFinanced',
              name: 'true'
            }
          }
        ]
      })
    }

    axios
      .post(`${apiUrl}/search`, searchPayload)
      .then(res => {
        dispatch(discoveryEmiPlanActions.addTransactionId({ transactionId: res.data.data[0].context.transaction_id }))
        const parsedSearchItems = parseSearchFinancelist(res.data.data)
        dispatch(discoveryEmiPlanActions.addProducts({ products: parsedSearchItems }))
        setEmiPlans(parsedSearchItems)
        setIsLoading(true)
      })
      .catch(e => {
        setIsLoading(false)
        console.log('error')
      })
  }

  useEffect(() => {
    fetchEMIPlans()
    localStorage.removeItem('totalCost')
  }, [])

  const handleDiscountedSearch = () => {
    setIsLoading(true)
    fetchEMIPlans(true)
    setDicountedSearch(true)

    setIsLoading(false)
  }

  const {
    handleOrderConfirmation,
    disableButton = false,
    paymentMethods = [
      {
        category: 'Credit & Debit Cards',
        img: Visa,
        paymentMethod: t.cardNumber,
        paymentMethodNet: t.cardNumber,
        disabled: false,
        dataTest: testIds.paymentpage_visa
      },
      {
        category: 'Credit & Debit Cards',
        img: masterCard,
        paymentMethod: t.cardNumber,
        paymentMethodNet: t.cardNumber,
        disabled: false,
        dataTest: testIds.paymentpage_masterCard
      },
      {
        category: 'Other Payment Options',
        img: applyPay,
        paymentMethod: t.applyPay || 'Apple Pay',
        paymentMethodNet: t.applyPay || 'Apple Pay',
        disabled: true,
        dataTest: testIds.paymentpage_phonePay
      },
      {
        category: 'Other Payment Options',
        img: stripePay,
        paymentMethod: t.stripePay || 'Stripe',
        paymentMethodNet: t.stripePay || 'Stripe',
        disabled: true,
        dataTest: testIds.paymentpage_phonePay
      }
      // {
      //   category: 'UPI',
      //   img: gPay,
      //   paymentMethod: t.gPay || 'Google Pay',
      //   paymentMethodNet: t.gPay || 'Google Pay',
      //   disabled: false,
      //   dataTest: testIds.paymentpage_phonePay
      // },
      // {
      //   category: 'UPI',
      //   img: phonePay,
      //   paymentMethod: t.phonePay || 'PhonePe UPI',
      //   paymentMethodNet: t.phonePay || 'PhonePe UPI',
      //   disabled: false,
      //   dataTest: testIds.paymentpage_phonePay
      // }
    ]
  } = props

  const handleChange = (id: string) => {
    setSelectedPaymentMethod(id)
    setCheckedPayment(id === checkedState ? null : id)
    setSelectedPlan('')
  }

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    dispatch(emiFormActions.updateForm({ [field]: event.target.value }))
  }

  const handleOnSubmit = () => {
    console.log('Submitting Form:', formData)

    setIsSubmitting(true)
    setOpenModal(false)

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        Router.push('/newPaymentOverView')
      }, 3000)
    }, 5000)
  }
  const handleEmiSelect = (planId: string) => {
    const selectedPlan = emiPlans.find(plan => plan.id === planId)
    if (!selectedPlan) {
      console.error('Selected EMI plan not found!')
      return
    }
    const emiDetails = selectedPlan.item.map((item: any, ind: number) => {
      const quantity = Number(cartItems[0]?.quantity) || 1
      const totalPrice = Number(cartItems[ind]?.price?.value || 0)

      const months = parseInt(item.name.match(/\d+/)?.[0] || '1')
      const annualInterestRate = Number(parseFloat(item?.price?.value) || 0)
      const priceValue = Number(price?.value) || 0
      const priceTotal = priceValue * quantity
      const principal = priceTotal || totalPrice || priceTotal + totalPrice
      const approvedLoanPercentage = Number(item.code) || 0
      const approvedLoanAmount =
        (approvedLoanPercentage / 100) * principal + Number(emiPlans[ind].providerShortDescription)
      const newPayableAmount = Number(principal - approvedLoanAmount) || 0

      if (payableAmount !== newPayableAmount) {
        setPayableAmount(newPayableAmount)
      }

      const monthlyInterestRate = annualInterestRate / 12 / 100
      const emiWithoutInterest =
        (approvedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
          (Math.pow(1 + monthlyInterestRate, months) - 1) || 0

      const emi = Math.floor(emiWithoutInterest)

      const totalCost = emi * months

      const actualInterestAmount = totalCost - approvedLoanAmount
      return { emi, actualInterestAmount, annualInterestRate, totalCost, payableAmount: newPayableAmount }
    })

    dispatch(setEmiDetails({ emiDetails }))

    // Ensure `transactionId` is defined
    if (!transactionId) {
      console.error('Transaction ID is missing!')
      return
    }
    setCheckedPayment(null)

    const selectedItems = selectedPlan.item.map((item: { id: any }) => ({
      id: item.id,
      selected: {
        quantity: {
          count: 1
        }
      }
    }))

    const payload = {
      data: [
        {
          context: {
            transaction_id: transactionId,
            bpp_id: selectedPlan.bppId,
            bpp_uri: selectedPlan.bppUri,
            domain: 'deg:finance'
          },
          message: {
            orders: [
              {
                items: selectedItems,
                provider: {
                  id: selectedPlan.providerId
                }
              }
            ]
          }
        }
      ]
    }
    axios
      .post(`${apiUrl}/select`, payload)
      .then(response => {
        dispatch(setApiResponse(response.data))
      })
      .catch(error => {
        console.error('Error calling select API:', error.response ? error.response.data : error.message)
      })
  }

  const fetchCredentials = async () => {
    try {
      setIsLoading(true)
      setSyncWalletIsLoading(true)
      const result = await getDocuments(user?.deg_wallet?.deg_wallet_id!).unwrap()
      console.log(result)
      const list: ItemMetaData[] = parseDIDData(result)['identities'].map((item, index) => {
        if (/\/type\/aadhar_card\/id\//.test((item as any).did)) {
          setAadharNumber(item.id)
        }
        if (/\/type\/pan_card\/id\//.test((item as any).did)) {
          setPANNumber(item.id)
        }
        return {
          id: index,
          title: item.type,
          isVerified: true,
          image: '',
          datetime: new Date().toString(),
          data: item
        }
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
      setSyncWalletIsLoading(false)
    }
  }

  const handleSyncWallet = async () => {
    console.log(user?.deg_wallet?.deg_wallet_id)
    const getDoc = await fetchCredentials()
  }

  return (
    <Box
      className="hideScroll"
      maxH="calc(100vh - 100px)"
      overflowY={'scroll'}
    >
      <PaymentDetailsCard
        checkedState={checkedPayment!}
        handleChange={handleChange}
        paymentMethods={paymentMethods}
        t={key => t[key]}
      />

      <Typography
        text="Available EMI Plans"
        fontSize="17px"
        style={{ marginTop: '20px' }}
      />
      <Box
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
        borderRadius="12px"
        margin={'0 auto'}
        mt="20px"
        mb="20px"
      >
        {!isLoading ? (
          <Box
            display={'grid'}
            height={'calc(60vh - 300px)'}
            alignContent={'center'}
          >
            <Loader text={t.loading} />
          </Box>
        ) : (
          <Box
            p="12px 4px"
            pb="20px"
          >
            <Accordion
              allowToggle
              index={previousIndex}
              onChange={indx => setPreviousIndex(indx as number)}
            >
              <RadioGroup
                onChange={setSelectedPlan}
                value={selectedPlan}
                className="radio-group-emi"
              >
                {emiPlans.map(plan => {
                  return (
                    <AccordionItem
                      key={plan.id}
                      border="none"
                    >
                      <AccordionButton className="btn-for-emi">
                        <Box
                          flex="1"
                          textAlign="left"
                        >
                          <Stack direction="row">
                            <Radio
                              _focusVisible={{ boxShadow: 'unset' }}
                              value={plan.id}
                              colorScheme="green"
                              className="radio-for-emi"
                              onChange={() => handleEmiSelect(plan.id)}
                            />
                            <Flex
                              justifyContent={'space-between'}
                              alignItems="center"
                              width={'84%'}
                            >
                              <Box p="10px">
                                <Text fontSize="15px">{plan.providerName}</Text>
                                <Text
                                  fontWeight="500"
                                  color="#E12525"
                                  fontSize="10px"
                                >
                                  Processing Fee: {plan.providerShortDescription}
                                </Text>
                              </Box>
                              <Image src={plan.providerImage} />
                            </Flex>
                          </Stack>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>

                      <Box p="0 20px">
                        <Divider
                          color="#D9D9D9"
                          borderWidth="1.5px"
                        />
                      </Box>

                      {emiPlans.length > 0 && (
                        <AccordionPanel>
                          <Box
                            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                            borderRadius="12px"
                            p="8px"
                            mb="10px"
                          >
                            <Text
                              fontSize={'10px'}
                              fontWeight="500"
                              mb="8px"
                            >
                              New Payment Overview
                            </Text>
                            <Flex
                              justifyContent={'space-between'}
                              alignItems="center"
                            >
                              <Text fontSize={'10px'}>Pay Now</Text>
                              <Text fontSize={'10px'}>₹{payableAmount?.toFixed(2)}</Text>
                            </Flex>
                          </Box>
                          <Box
                            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                            borderRadius="12px"
                            p="10px"
                          >
                            <Flex
                              justifyContent="space-between"
                              p="12px 20px"
                              bg="#D9D9D9"
                              borderRadius="6px"
                            >
                              <Box
                                fontSize="10px"
                                fontWeight="500"
                              >
                                EMI plan
                              </Box>
                              <Box
                                fontSize="10px"
                                fontWeight="500"
                              >
                                Interest rate (p.a)
                              </Box>
                              <Box
                                fontSize="10px"
                                fontWeight="500"
                              >
                                Total Cost
                              </Box>
                            </Flex>

                            {plan.item.map((item: any, index: number) => {
                              const quantity = Number(cartItems[0]?.quantity) || 1
                              const totalPrice = Number(cartItems[index]?.price?.value || 0)
                              const months = parseInt(item.name.match(/\d+/)?.[0] || '1')
                              const annualInterestRate = Number(parseFloat(item?.price?.value) || 0)
                              const priceValue = Number(price?.value) || 0
                              const processingFees = Number(emiPlans[index].providerShortDescription) || 0

                              const priceTotal = priceValue * quantity
                              const principal = priceTotal || totalPrice || priceTotal + totalPrice
                              const approvedLoanPercentage = Number(item.code) || 0
                              const approvedLoanAmount = (approvedLoanPercentage / 100) * principal + processingFees // Include processing fees

                              const newPayableAmount = Number(principal - approvedLoanAmount) || 0

                              if (payableAmount !== newPayableAmount) {
                                setPayableAmount(newPayableAmount)
                              }

                              const monthlyInterestRate = annualInterestRate / 12 / 100
                              const emiWithoutInterest =
                                (approvedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                                  (Math.pow(1 + monthlyInterestRate, months) - 1) || 0

                              const emi = Math.floor(emiWithoutInterest + processingFees / months)

                              const totalCost = emi * months
                              if (!localStorage.getItem('totalCost')) {
                                localStorage.setItem('totalCost', totalCost.toString())
                              }

                              const actualInterestAmount = totalCost - approvedLoanAmount

                              return (
                                <React.Fragment key={index}>
                                  <Flex
                                    justifyContent="space-between"
                                    p="12px 20px"
                                  >
                                    <Box
                                      fontSize="10px"
                                      fontWeight="500"
                                      color="#626060"
                                    >
                                      ₹ {emi.toFixed(2)} x {item.name}m
                                    </Box>
                                    <Box
                                      fontSize="10px"
                                      fontWeight="500"
                                      color="#626060"
                                    >
                                      ₹ {actualInterestAmount.toFixed(2)} ({annualInterestRate}%)
                                    </Box>
                                    <Box>
                                      {dicountedSearch && (
                                        <Box
                                          textDecoration="line-through"
                                          fontSize="10px"
                                          fontWeight="500"
                                          color="#626060"
                                        >
                                          ₹{localStorage.getItem('totalCost')}.00
                                        </Box>
                                      )}
                                      <Box
                                        fontSize="10px"
                                        fontWeight="500"
                                        color="#626060"
                                      >
                                        ₹ {totalCost.toFixed(2)}
                                      </Box>
                                    </Box>
                                  </Flex>
                                  <Divider />
                                </React.Fragment>
                              )
                            })}
                            {!dicountedSearch ? (
                              <Box
                                pt="5px"
                                onClick={handleDiscountedSearch}
                              >
                                <Text
                                  fontSize={'10px'}
                                  fontWeight="500"
                                  as="span"
                                >
                                  for better interest
                                  <Text
                                    pl="5px"
                                    as="span"
                                    fontWeight="500"
                                    fontSize={'10px'}
                                    color="#228B22"
                                    cursor={'pointer'}
                                  >
                                    sync your transactions from wallet
                                  </Text>
                                </Text>
                              </Box>
                            ) : (
                              <Box
                                lineHeight={'14px'}
                                pt="5px"
                                onClick={handleDiscountedSearch}
                              >
                                <Text
                                  fontSize={'10px'}
                                  fontWeight="500"
                                  as="span"
                                >
                                  {`Congratulations! We have added 2% discount based on your criteria.`}
                                  transactions
                                </Text>
                              </Box>
                            )}
                          </Box>
                        </AccordionPanel>
                      )}
                    </AccordionItem>
                  )
                })}
              </RadioGroup>
            </Accordion>
          </Box>
        )}
      </Box>
      <BecknButton
        dataTest={testIds.paymentpage_confirmButton}
        children={t.confirmOrder}
        handleClick={() => {
          setOpenModal(true)
          if (checkedPayment) {
            // router.push('/retailOrderConfirmation')
            if (selectedPaymentMethod.includes('UPI')) {
              router.push('/upiScreen')
            } else {
              router.push('/secureCheckout')
            }
          }
        }}
        disabled={(!checkedState && !selectedPlan && !checkedPayment) || disableButton}
      />

      {isSubmitting || showSuccess ? (
        <BottomModal
          onClose={() => {}}
          isOpen={isSubmitting || showSuccess}
        >
          <Box
            display={'grid'}
            height={'60vh'}
            alignContent={'center'}
          >
            {showSuccess ? (
              <Flex
                justifyContent={'center'}
                alignItems="center"
                flexDirection={'column'}
                mb="50px"
              >
                <Image
                  src="./images/orderConfirmmark.svg"
                  alt="confirmation img"
                  mt="20px"
                />

                <Typography
                  style={{ textAlign: 'center' }}
                  fontWeight="500"
                  fontSize="17px"
                  text={'Congratulations!'}
                />
                <Typography
                  style={{ textAlign: 'center', paddingTop: '10px' }}
                  fontSize="15px"
                  text={'Your documents have been successfully verified, and your loan request has been approved!'}
                />
              </Flex>
            ) : (
              <Loader>
                <Typography
                  fontWeight="500"
                  fontSize="17px"
                  text={'Please wait!'}
                />
                <Typography
                  fontSize="15px"
                  text={'While your documents are being verified'}
                />
              </Loader>
            )}
          </Box>
        </BottomModal>
      ) : (
        openModal &&
        !showSuccess &&
        !checkedPayment && (
          <Box className="btm-modal-payment">
            <EMIApplicationModal
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
              handleSyncWallet={() => {
                setSyncWalletIsLoading(true)
                setTimeout(() => {
                  handleSyncWallet()
                }, 3000)
              }}
              syncWalletIsLoading={syncWalletIsLoading}
              walletDetails={{
                aadharNumber: aadharNumber!,
                panNumber: PANNumber!
              }}
              handleOnSubmitForm={handleOnSubmit}
            />
          </Box>
        )
      )}
    </Box>
  )
}

export default PaymentMode
