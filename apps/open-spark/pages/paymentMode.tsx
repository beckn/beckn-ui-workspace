import React, { useEffect, useMemo, useRef, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import {
  CheckoutRootState,
  discoveryActions,
  feedbackActions,
  ICartRootState,
  PaymentMethodSelectionProps
} from '@beckn-ui/common'
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
  useToast,
  Select
} from '@chakra-ui/react'
// import phonePay from '@public/images/phonePayPayment.svg'
// import gPay from '@public/images/gpay.svg'
import applyPay from '@public/images/visaNew.svg'
import stripePay from '@public/images/masterNew.svg'
import CashOnDelivery from '@public/images/cash.svg'
import NetBanking from '@public/images/netbanking.svg'
import { BottomModal, GenericDropdown, InputProps, Loader, SelectOptionType, Typography } from '@beckn-ui/molecules'
import PaymentDetailsCard from '@beckn-ui/common/src/components/paymentDetailsCard'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { useDispatch, useSelector } from 'react-redux'
import axios from '@services/axios'
import { parseSearchFinancelist } from '@utils/serach-utils-finance'
import { discoveryEmiPlanActions } from '@store/discoveryEmiPlan-slice'
import AddNewItemModal from '@components/modal/AddNewItemModal'
import { emiFormActions, EMIFormState } from '@store/emiForm-slice'
import { setApiResponse, setEmiDetails } from '@store/emiSelect-slice'
import { UserRootState } from '@store/user-slice'
import { AuthRootState } from '@store/auth-slice'
import { useGetDocumentsMutation } from '@services/walletService'
import { parseDIDData } from '@utils/did'
import { ItemMetaData } from '@lib/types/becknDid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { currencyFormat, getCountryCode } from '@utils/general'
import { DetailCard } from '@beckn-ui/becknified-components'
import { currencyMap } from '@lib/config'

interface FormData {
  fullName: string
  dateOfBirth: Date | null
  // panCard?: string
  // aadhaar?: string
  ssNumber?: string
  mobileNumber?: string
  loanTenure?: string
}

interface FormErrors {
  fullName?: string
  dateOfBirth?: string
  // panCard?: string
  // aadhaar?: string
  ssNumber?: string
  mobileNumber?: string
  loanTenure?: string
}

// Add interface for EMIApplicationModal props
interface EMIApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  handleSyncWallet: () => void
  syncWalletIsLoading?: boolean
  walletDetails?: {
    aadharNumber?: string
    panNumber?: string
    fullName: string
    dateOfBirth: Date | null
    mobileNumber: string
    ssNumber: string
  }
  handleOnSubmitForm: (data: FormData) => void
  syncWalletSuccess?: boolean
}

const EMIApplicationModal = ({
  isOpen,
  onClose,
  handleSyncWallet,
  syncWalletIsLoading,
  walletDetails,
  handleOnSubmitForm,
  syncWalletSuccess
}: EMIApplicationModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: walletDetails?.fullName || '',
    dateOfBirth: walletDetails?.dateOfBirth || null,
    panCard: walletDetails?.panNumber || '',
    // aadhaar: walletDetails?.aadharNumber || '',
    // mobileNumber: walletDetails?.mobileNumber || '',
    ssNumber: walletDetails?.ssNumber || '',
    loanTenure: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const toast = useToast()
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [selectedEmiPlan, setSelectedEmiPlan] = useState<string | null>(null)
  const selectedEmi = useSelector((state: any) => state.selectedEmi.apiResponse?.[0]?.message.order.items) || 0
  const monthlyInstallment = useSelector((state: any) => state.selectedEmi.emiDetails)

  useEffect(() => {
    setFormData(prevFormData => ({
      ...prevFormData,
      // panCard: walletDetails?.panNumber || '',
      // aadhaar: walletDetails?.aadharNumber || '',
      ssNumber: walletDetails?.ssNumber || '',
      fullName: walletDetails?.fullName || '',
      dateOfBirth: walletDetails?.dateOfBirth || null,
      mobileNumber: walletDetails?.mobileNumber || '',
      loanTenure: ''
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
    // if (!formData.panCard.trim()) {
    //   newErrors.panCard = 'PAN card number is required'
    // } else if (!/^[A-Z0-9]{10}$/.test(formData.panCard.toUpperCase())) {
    //   newErrors.panCard = 'PAN card must be 10 characters'
    // }

    // // Aadhaar validation
    // if (!formData.aadhaar.trim()) {
    //   newErrors.aadhaar = 'Aadhaar number is required'
    // } else if (!/^\d{12}$/.test(formData.aadhaar)) {
    //   newErrors.aadhaar = 'Aadhaar must be 12 digits'
    // }
    if (!formData.ssNumber!.trim()) {
      newErrors.ssNumber = 'SS number is required'
    } else if (!/^\d{9}$/.test(formData.ssNumber!)) {
      newErrors.ssNumber = 'SS number must be 9 digits'
    }

    // Mobile Number validation
    if (!formData.mobileNumber!.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^\d{10}$/.test(formData.mobileNumber!)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits'
    }

    if (!formData.loanTenure) {
      newErrors.loanTenure = 'Loan tenure is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    // Input restrictions
    if (field === 'mobileNumber' && !/^\d*$/.test(value)) {
      return // Only allow digits in mobile number
    }
    // if (field === 'aadhaar' && !/^\d*$/.test(value)) {
    //   return // Only allow digits in aadhaar
    // }
    // if (field === 'panCard') {
    //   value = value.toUpperCase() // Convert PAN to uppercase
    //   if (value.length > 10) return // Limit to 10 characters
    // }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    dispatch(emiFormActions.updateForm({ [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSelectChange = (selectedItem: any) => {
    const { name, value, data } = selectedItem

    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))

    const updatedFormData = {
      ...formData,
      [name]: value
    }
    // const errors = validateCredForm(updatedFormData)
    // setErrors(prevErrors => ({
    //   ...prevErrors,
    //   [name]: t[`${errors[name as keyof CredFormErrors]}`] || ''
    // }))
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
      handleOnSubmitForm(formData)
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

  const isFormFilled = useMemo(() => {
    return Object.values(formData).every(value => value !== '') && Object.values(errors).every(value => value === '')
  }, [formData, errors])

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
            color="#4398E8"
            text="Sync wallet"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (user?.deg_wallet) {
                handleSyncWallet()
              } else {
                dispatch(
                  feedbackActions.setToastData({
                    toastData: {
                      message: 'Wallet not connected!',
                      display: true,
                      type: 'warning',
                      description: 'Please connect your wallet before proceeding.'
                    }
                  })
                )
              }
            }}
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
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Full Name *"
              />
              {syncWalletSuccess && formData.fullName && (
                <Typography
                  fontWeight="400"
                  fontSize="12px"
                  text="Verified by Vault"
                  color="#53A052"
                />
              )}
            </Flex>
            <Input
              value={formData.fullName}
              onChange={e => handleInputChange('fullName', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.fullName ? 'red.500' : '#4398E8' }}
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
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Date of Birth *"
              />
              {syncWalletSuccess && formData.dateOfBirth && (
                <Typography
                  fontWeight="400"
                  fontSize="12px"
                  text="Verified by Vault"
                  color="#53A052"
                />
              )}
            </Flex>
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
                  _focusVisible={{ borderColor: errors.dateOfBirth ? 'red.500' : '#4398E8' }}
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
          {/* <Box mb="20px">
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="PAN Card *"
              />
              {syncWalletSuccess && formData.panCard && (
                <Typography
                  fontWeight="400"
                  fontSize="12px"
                  text="Verified by Vault"
                  color="#53A052"
                />
              )}
            </Flex>
            <Input
              value={formData.panCard}
              onChange={e => handleInputChange('panCard', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.panCard ? 'red.500' : '#4398E8' }}
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
          </Box> */}

          {/* Aadhaar Field */}
          {/* <Box mb="20px">
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Aadhaar *"
              />
              {syncWalletSuccess && formData.aadhaar && (
                <Typography
                  fontWeight="400"
                  fontSize="12px"
                  text="Verified by Vault"
                  color="#53A052"
                />
              )}
            </Flex>
            <Input
              value={formData.aadhaar}
              onChange={e => handleInputChange('aadhaar', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.aadhaar ? 'red.500' : '#4398E8' }}
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
          </Box> */}

          {/* SSN Field */}
          <Box mb="20px">
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Social Security Number *"
              />
              {syncWalletSuccess && formData.ssNumber && (
                <Typography
                  fontWeight="400"
                  fontSize="12px"
                  text="Verified by Vault"
                  color="#53A052"
                />
              )}
            </Flex>
            <Input
              value={formData.ssNumber ? formData.ssNumber.replace(/^(.{5})/g, '*****') : ''}
              onChange={e => handleInputChange('ssNumber', e.target.value)}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.ssNumber ? 'red.500' : '#4398E8' }}
              border="unset"
              borderBottom="1px solid"
              borderColor={errors.ssNumber ? 'red.500' : '#3A3A3A'}
              borderRadius="0"
            />
            {errors.ssNumber && (
              <Typography
                color="red.500"
                fontSize="12px"
                text={errors.ssNumber}
              />
            )}
          </Box>

          {/* Mobile Number Field */}
          <Box mb="20px">
            <Flex
              flexDir={'row'}
              justifyContent={'space-between'}
            >
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Mobile Number *"
              />
              {syncWalletSuccess && formData.mobileNumber && (
                <Typography
                  fontWeight="400"
                  fontSize="12px"
                  text="Verified by Vault"
                  color="#53A052"
                />
              )}
            </Flex>
            <Input
              value={formData.mobileNumber}
              onChange={e => handleInputChange('mobileNumber', e.target.value)}
              maxLength={10}
              paddingInlineStart="unset"
              _focusVisible={{ borderColor: errors.mobileNumber ? 'red.500' : '#4398E8' }}
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
          <Box mb="20px">
            <Typography
              fontWeight="400"
              fontSize="15px"
              text="Loan Tenure *"
            />

            <GenericDropdown
              name={'loanTenure'}
              options={selectedEmi?.map((emi: any, index: number) => ({
                label: `${emi.name} months: ${currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}${currencyFormat(monthlyInstallment[index].emi)}/months`,
                value: monthlyInstallment[index].itemId
              }))}
              placeholder={''}
              selectedValue={formData.loanTenure!}
              handleChange={handleSelectChange}
              buttonStyles={{ marginBottom: '35px', borderBottom: '1px solid #3A3A3A' }}
            />
          </Box>

          <BecknButton
            text="Submit"
            disabled={!isFormFilled}
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
  const formData = useSelector((state: EMIFormState) => state)
  const emiPlansData = useSelector((state: any) => state.discoveryEmiPlan)
  const { transactionId, products } = useSelector((state: any) => state.discoveryEmiPlan)
  const [selectedEmiDetails, setSelectedEmiDetails] = useState<any>(null)
  const price = initResponse[0]?.message.order.quote.price || 0
  const cartItems = useSelector((state: ICartRootState) => state.cart.items)
  const [aadharNumber, setAadharNumber] = useState<string>()
  const [PANNumber, setPANNumber] = useState<string>()
  const [SSNumber, setSSNumber] = useState<string>()
  const [walletDetails, setWalletDetails] = useState<any>({
    fullName: '',
    dateOfBirth: '',
    mobileNumber: '',
    aadharNumber: '',
    panNumber: ''
  })
  const [syncWalletSuccess, setSyncWalletSuccess] = useState(false)
  const [payableAmount, setPayableAmount] = useState<Record<string, number>>()
  const [dicountedSearch, setDicountedSearch] = useState(false)
  const [newCalculationIsLoading, setNewCalculationIsLoading] = useState<Record<string, boolean>>()
  const [fetchTransactionsMessage, setFetchTransactionsMessage] = useState('')
  const [previousIndex, setPreviousIndex] = useState<number>()
  const [isAppliedForDiscountingEMIPlans, setIsAppliedForDiscountingEMIPlans] = useState<boolean>(false)
  const [newTotalCost, setNewTotalCost] = useState(() => {
    return Number(localStorage.getItem('totalCost')) || 0
  })
  console.log(newTotalCost)
  // const payableAmountRef = useRef<Record<string, number>>()
  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const selectAPIRes = useSelector((state: any) => state.selectedEmi.apiResponse)
  const selectedEmi = useSelector((state: any) => state.selectedEmi?.apiResponse?.[0]?.message?.order?.items) || []
  const selectedEMIDetails = useSelector((state: any) => state.selectedEmi.emiDetails)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  console.log(selectedPlan)

  const mergeUniqueObjects = (arr1: any[], arr2: any[]): any[] => {
    const mergedMap = new Map<string, any>()

    // Add all objects from arr2 first
    arr2.forEach(obj => {
      mergedMap.set(obj.id, obj)
    })

    // Override with objects from arr1 if ID matches
    arr1.forEach(obj => {
      mergedMap.set(obj.id, obj)
    })

    return Array.from(mergedMap.values())
  }

  const fetchEMIPlans = (providerId?: string) => {
    // console.log(selectedItem)
    const searchPayload = {
      context: {
        domain: 'deg:finance',
        location: getCountryCode()
      },
      searchString: '',
      ...(providerId && {
        provider: {
          providerId
        }
      }),
      category: { categoryCode: 'loan_type', categoryName: 'Battery' },
      ...(providerId && {
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
        const prevUnselectedEmiPlans = [...emiPlans].filter(item => item.id !== selectedPlan)
        const parsedSearchItems = parseSearchFinancelist(res.data.data)
        const formatedSearchData = mergeUniqueObjects(parsedSearchItems, prevUnselectedEmiPlans)
        console.log('daata', formatedSearchData)
        dispatch(discoveryEmiPlanActions.addProducts({ products: formatedSearchData }))
        setEmiPlans(formatedSearchData)
        setIsLoading(true)
        if (providerId) {
          const selectedPlanData = formatedSearchData.find(plan => plan.id === selectedPlan)
          handleEmiSelect(selectedPlanData?.id!, formatedSearchData)
        }
      })
      .catch(e => {
        setIsLoading(false)
        console.log('error')
      })
  }
  console.log(emiPlans)
  useEffect(() => {
    fetchEMIPlans()
    localStorage.removeItem('totalCost')
  }, [])

  const handleDiscountedSearch = (text: string, providerId: string) => {
    const messagesList = [
      'Fetching transactions from your wallet...',
      `Sending transaction history to ${text}...`,
      'Fetching updated offers...'
    ]
    setNewCalculationIsLoading(prevState => ({ ...prevState, [providerId]: true }))
    messagesList.forEach((message, index) => {
      setTimeout(() => {
        setFetchTransactionsMessage(message)
      }, index * 1500)
    })
    setTimeout(() => {
      setDicountedSearch(true)
      setNewCalculationIsLoading(prevState => ({ ...prevState, [providerId]: false }))
    }, 10000)
    fetchEMIPlans(providerId)
    setIsAppliedForDiscountingEMIPlans(true)
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

  const handleFinanceOnConfirm = (data: FormData) => {
    if (selectAPIRes && selectedEmi.length > 0) {
      const calculatedEMIs = JSON.parse(localStorage.getItem('calculatedEMIs')!) || 0
      console.log('selectedPlan', calculatedEMIs[selectedEmi[0].id], data) // calculatedEMIs[selectedPlan.i])

      const payload = {
        data: [
          {
            context: {
              transaction_id: transactionId,
              bpp_id: selectAPIRes[0].context.bpp_id,
              bpp_uri: selectAPIRes[0].context.bpp_uri,
              domain: 'deg:finance',
              location: getCountryCode()
            },
            message: {
              orders: [
                {
                  items: selectAPIRes[0].message.order.items.filter((item: any) => item.id === data.loanTenure), // calculatedEMIs[selectedPlan.i].id),
                  provider: {
                    id: selectAPIRes[0].message.order.provider.id
                  },
                  fulfillments: [
                    {
                      type: 'Delivery',
                      customer: {
                        person: {
                          name: data.fullName
                        },
                        contact: {
                          phone: data.mobileNumber
                        }
                      },
                      stops: [
                        {
                          location: {
                            gps: '13.2008459,77.708736',
                            address:
                              "123, Terminal 1, Kempegowda Int'\''l Airport Rd, A - Block, Gangamuthanahalli, Karnataka 560300, India",
                            city: {
                              name: 'Gangamuthanahalli'
                            },
                            state: {
                              name: 'Karnataka'
                            },
                            country: {
                              code: 'IND'
                            },
                            area_code: '75001'
                          },
                          contact: {
                            phone: formData.mobileNumber,
                            email: user?.email
                          }
                        }
                      ]
                    }
                  ],
                  billing: {
                    name: data.fullName,
                    address:
                      "123, Terminal 1, Kempegowda Int'\''l Airport Rd, A - Block, Gangamuthanahalli, Karnataka 560300, India",
                    state: {
                      name: 'Gangamuthanahalli'
                    },
                    city: {
                      name: 'Karnataka'
                    },
                    email: user?.email,
                    phone: data.mobileNumber
                  },
                  payments: [
                    {
                      params: {
                        amount: `${calculatedEMIs[selectedEmi[0].id].totalCost - calculatedEMIs[selectedEmi[0].id].actualInterestAmount}`,
                        currency: `${currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}`,
                        bank_account_number: '1234002341',
                        bank_code: 'INB0004321'
                      },
                      status: 'PAID',
                      type: 'PRE-FULFILLMENT'
                    }
                  ],
                  ...(isAppliedForDiscountingEMIPlans && {
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
              ]
            }
          }
        ]
      }
      axios
        .post(`${apiUrl}/confirm`, payload)
        .then(response => {
          // dispatch(setApiResponse(response.data))
        })
        .catch(error => {
          console.error('Error calling select API:', error.response ? error.response.data : error.message)
        })
    }
  }

  const handleOnSubmit = (data: FormData) => {
    console.log('Submitting Form:', data)
    console.log(localStorage.getItem('actualCost'))
    setIsSubmitting(true)
    setOpenModal(false)
    handleFinanceOnConfirm(data)

    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        Router.push('/newPaymentOverView')
      }, 3000)
    }, 5000)
  }
  const handleEmiSelect = (planId: string, customEMIPlans?: any[]) => {
    const emiPlanList = customEMIPlans ? customEMIPlans : emiPlans
    console.log('emiPlanList', emiPlanList)
    const selectedPlan = emiPlanList.find(plan => plan.id === planId)
    if (!selectedPlan) {
      console.error('Selected EMI plan not found!')
      return
    }
    const emiDetails = selectedPlan.item.map((item: any, ind: number) => {
      const itemId = item.id
      const quantity = Number(cartItems[0]?.quantity) || 1
      const totalPrice = Number(cartItems[ind]?.price?.value || 0)

      const months = parseInt(item.name.match(/\d+/)?.[0] || '1')
      const annualInterestRate = Number(parseFloat(item?.price?.value) || 0)
      const processingFees = Number(emiPlanList[ind].providerShortDescription) || 0
      const priceValue = Number(price?.value) || 0
      const priceTotal = priceValue * quantity
      const principal = priceTotal || totalPrice || priceTotal + totalPrice
      const approvedLoanPercentage = Number(item.code) || 0
      const approvedLoanAmount = (approvedLoanPercentage / 100) * principal
      const newPayableAmount = Number(principal - approvedLoanAmount) || 0

      if (payableAmount && payableAmount?.[planId] !== newPayableAmount) {
        setPayableAmount(prevState => ({ ...prevState, [planId]: newPayableAmount }))
        // payableAmountRef.current = {...payableAmountRef.current, [planId]: newPayableAmount }
      }

      const monthlyInterestRate = annualInterestRate / 12 / 100
      const emiWithoutInterest =
        (approvedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
          (Math.pow(1 + monthlyInterestRate, months) - 1) || 0

      const emi = Math.floor(emiWithoutInterest + processingFees / months) // no interest calculated on processing fees

      const totalCost = emi * months

      const actualInterestAmount = totalCost - approvedLoanAmount
      return { emi, actualInterestAmount, annualInterestRate, totalCost, payableAmount: newPayableAmount, itemId }
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
            domain: 'deg:finance',
            location: getCountryCode()
          },
          message: {
            orders: [
              {
                items: selectedItems,
                provider: {
                  id: selectedPlan.providerId
                },
                ...(isAppliedForDiscountingEMIPlans && {
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
      const data = {
        fullName: `${user?.agent?.first_name || ''} ${user?.agent?.last_name || ''}`,
        dateOfBirth: new Date('01/05/1994'),
        mobileNumber: `${user?.agent?.agent_profile.phone_number}`,
        aadharNumber: '743160366069',
        panNumber: 'EPLPB9268F'
      }
      setAadharNumber('743160366069')
      setPANNumber('EPLPB9268F')
      setSSNumber('675721423')
      setWalletDetails(data)
      setSyncWalletSuccess(true)
      const list: ItemMetaData[] = parseDIDData(result)['identities'].map((item, index) => {
        if (/\/type\/aadhar_card\/id\//.test((item as any).did)) {
          setAadharNumber(item.id)
        } else {
          setAadharNumber('743160366069')
        }
        if (/\/type\/pan_card\/id\//.test((item as any).did)) {
          setPANNumber(item.id)
        } else {
          setPANNumber('EPLPB9268F')
        }
        setSSNumber('675721423')

        return {
          id: index,
          title: item.type,
          isVerified: true,
          image: '',
          datetime: new Date().toString(),
          data: item
        }
      })
      return list
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
    console.log('getDoc', getDoc)
  }

  const getCartItemsWithQuantity = () => {
    const cartItemQuantity: any = {}
    let totalCartPrice: number = 0
    cartItems.forEach((item: any) => {
      const totalPrice = Number(item.price.value) * item.quantity
      cartItemQuantity[item.id] = {
        id: item.id,
        quantity: item.quantity,
        totalPrice: totalPrice
      }
      totalCartPrice = totalCartPrice + totalPrice
    })
    return { cartItemQuantity, totalCartPrice }
  }

  const calculateEMIDetails = (item: any, cartItems: any[], index: number, price: any, plan: any) => {
    const storageKey = `originalInterestRate_${plan.id}`

    const cartDetails = getCartItemsWithQuantity()
    const totalCartPrice = Number(cartDetails.totalCartPrice || 0)
    const months = parseInt(item.name.match(/\d+/)?.[0] || '1')
    const annualInterestRate = Number(parseFloat(item?.price?.value) || 0)
    const processingFees = Number(emiPlans[index].providerShortDescription) || 0

    // Only store the original rate once per provider/loan type
    const storedRate = localStorage.getItem(storageKey)
    if (!storedRate) {
      // Store the highest interest rate as the original rate
      const allRatesForProvider = plan.item.map((item: any) => Number(parseFloat(item?.price?.value) || 0))
      const maxRate = Math.max(...allRatesForProvider)
      localStorage.setItem(storageKey, maxRate.toString())
    }

    // Calculate with current interest rate
    const principal = totalCartPrice
    const approvedLoanPercentage = Number(item.code) || 0
    const approvedLoanAmount = (approvedLoanPercentage / 100) * principal

    const newPayableAmount = Number(principal - approvedLoanAmount) || 0

    if (payableAmount?.[plan.id] !== newPayableAmount) {
      setPayableAmount(prevState => ({ ...prevState, [plan.id]: newPayableAmount }))
      // payableAmountRef.current = { ...payableAmountRef.current, [plan.id]: newPayableAmount }
    }

    const monthlyInterestRate = annualInterestRate / 12 / 100
    const emiWithoutInterest =
      (approvedLoanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
        (Math.pow(1 + monthlyInterestRate, months) - 1) || 0

    const emi = Math.floor(emiWithoutInterest + processingFees / months) // no interest calculated on processing fees
    const totalCost = emi * months

    // Calculate with original (non-discounted) interest rate
    const originalMonthlyRate = Number(storedRate) / 12 / 100
    const originalEmiWithoutInterest =
      (approvedLoanAmount * originalMonthlyRate * Math.pow(1 + originalMonthlyRate, months)) /
        (Math.pow(1 + originalMonthlyRate, months) - 1) || 0

    const originalEmi = Math.floor(originalEmiWithoutInterest + processingFees / months) // no interest calculated on processing fees
    const nonDiscountedPrice = originalEmi * months

    if (!localStorage.getItem(`totalCost`)) {
      localStorage.setItem(`totalCost`, nonDiscountedPrice.toString())
    }

    const actualInterestAmount = totalCost - approvedLoanAmount
    localStorage.setItem(
      `calculatedEMIs`,
      JSON.stringify({
        ...JSON.parse(localStorage.getItem(`calculatedEMIs`)!),
        [item.id]: {
          emi,
          totalCost,
          actualInterestAmount,
          payableAmount: newPayableAmount,
          originalRate: annualInterestRate,
          nonDiscountedPrice
        }
      })
    )
    return {
      emi,
      totalCost,
      actualInterestAmount,
      payableAmount: newPayableAmount,
      originalRate: annualInterestRate,
      nonDiscountedPrice
    }
  }

  const checkIsWalletTransactionsExist = async () => {
    if (user?.deg_wallet) {
      const result = await getDocuments(user?.deg_wallet?.deg_wallet_id!).unwrap()
      const count = parseDIDData(result)['transactions'].length > 0 || 0
      if (count === 0) {
        dispatch(
          feedbackActions.setToastData({
            toastData: {
              message: 'Oops! No Transactions Found',
              display: true,
              type: 'warning',
              description: 'You do not have any transaction in your wallet to avail discount.'
            }
          })
        )
      }
      return !!count
    } else {
      dispatch(
        feedbackActions.setToastData({
          toastData: {
            message: 'Wallet not connected!',
            display: true,
            type: 'warning',
            description: 'Please connect your wallet before proceeding.'
          }
        })
      )
    }
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
        background={'#fff'}
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
            textAlign="center"
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
                      key={plan.provider_id}
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
                              <Image
                                src={plan.providerImage}
                                width="100px"
                                height="auto"
                              />
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
                          {newCalculationIsLoading && newCalculationIsLoading?.[plan.id] ? (
                            <>
                              <Loader>
                                <Typography
                                  fontWeight="500"
                                  fontSize="12px"
                                  text={'Please wait!'}
                                />
                                <Typography
                                  fontSize="12px"
                                  text={fetchTransactionsMessage}
                                />
                              </Loader>
                            </>
                          ) : (
                            <>
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
                                  Payment Overview
                                </Text>
                                <Flex
                                  justifyContent={'space-between'}
                                  alignItems="center"
                                >
                                  <Text fontSize={'10px'}>Initial Payment</Text>
                                  <Text fontSize={'10px'}>
                                    {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                                    {currencyFormat(Number(payableAmount?.[plan.id]?.toFixed(2)))}
                                  </Text>
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
                                  const {
                                    emi,
                                    totalCost,
                                    actualInterestAmount,
                                    payableAmount,
                                    originalRate,
                                    nonDiscountedPrice
                                  } = calculateEMIDetails(item, cartItems, index, price, plan)

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
                                          {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                                          {currencyFormat(Number(emi.toFixed(2)))} x {item.name}m
                                        </Box>
                                        <Box
                                          fontSize="10px"
                                          fontWeight="500"
                                          color="#626060"
                                        >
                                          {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                                          {currencyFormat(Number(actualInterestAmount.toFixed(2)))} ({originalRate}
                                          %)
                                        </Box>
                                        <Box>
                                          {plan.item[0].code === '90' && (
                                            <Box
                                              textDecoration="line-through"
                                              fontSize="10px"
                                              fontWeight="500"
                                              color="#626060"
                                            >
                                              {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                                              {nonDiscountedPrice}.00
                                            </Box>
                                          )}
                                          <Box
                                            fontSize="10px"
                                            fontWeight="500"
                                            color={`${plan.item[0].code === '90' ? '#3C8508' : '#626060'}`}
                                          >
                                            {currencyMap[getCountryCode().country.code as keyof typeof currencyMap]}
                                            {currencyFormat(Number(totalCost.toFixed(2)))}
                                          </Box>
                                        </Box>
                                      </Flex>
                                      <Divider />
                                    </React.Fragment>
                                  )
                                })}
                                {plan.item[0].code !== '90' ? (
                                  <Box pt="5px">
                                    <Text
                                      fontSize={'10px'}
                                      fontWeight="500"
                                      as="span"
                                      display={'flex'}
                                      flexDirection={'row'}
                                      justifyContent={'space-evenly'}
                                      alignItems="center"
                                    >
                                      for better offers sync your transactions
                                      <Text
                                        as="span"
                                        fontWeight="500"
                                        fontSize={'10px'}
                                        backgroundColor="#4398E8"
                                        padding={'3px'}
                                        borderRadius="4px"
                                        color="#fff"
                                        cursor={'pointer'}
                                        onClick={async () => {
                                          // if (!localStorage.getItem('totalCost')) {
                                          //   localStorage.setItem('totalCost', newTotalCost.toString())
                                          // }
                                          if (await checkIsWalletTransactionsExist()) {
                                            handleDiscountedSearch(plan.providerName, plan.id)
                                          }
                                        }}
                                      >
                                        Sync now
                                      </Text>
                                    </Text>
                                  </Box>
                                ) : (
                                  <Box
                                    lineHeight={'14px'}
                                    pt="5px"
                                  >
                                    <Text
                                      fontSize={'10px'}
                                      fontWeight="500"
                                      as="span"
                                    >
                                      {`🎉 Congratulations! You have received a 2% discount on interest rates based on your transactions.`}
                                    </Text>
                                  </Box>
                                )}
                              </Box>
                            </>
                          )}
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
                ...walletDetails,
                // aadharNumber: aadharNumber!,
                // panNumber: PANNumber!,
                ssNumber: SSNumber!
              }}
              handleOnSubmitForm={handleOnSubmit}
              syncWalletSuccess={syncWalletSuccess}
            />
          </Box>
        )
      )}
    </Box>
  )
}

export default PaymentMode
