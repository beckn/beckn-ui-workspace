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
  Image
} from '@chakra-ui/react'
import phonePay from '@public/images/phonePayPayment.svg'
import gPay from '@public/images/gpay.svg'
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

const PaymentMode = (props: PaymentMethodSelectionProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [emiPlans, setEmiPlans] = useState<any[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)

  const [isLoading, setIsLoading] = useState(false)
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

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const [getDocuments, { isLoading: verifyLoading }] = useGetDocumentsMutation()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const fetchEMIPlans = () => {
    const searchPayload = {
      context: {
        domain: 'deg:finance'
      },
      searchString: ''
    }

    axios
      .post(`${apiUrl}/search`, searchPayload)
      .then(res => {
        dispatch(discoveryEmiPlanActions.addTransactionId({ transactionId: res.data.data[0].context.transaction_id }))
        const parsedSearchItems = parseSearchFinancelist(res.data.data)
        dispatch(discoveryEmiPlanActions.addProducts({ products: parsedSearchItems }))
        setEmiPlans(parsedSearchItems)
        setIsLoading(true)
        console.log(res.data.data)
      })
      .catch(e => {
        setIsLoading(false)
        console.log('error')
      })
  }

  useEffect(() => {
    fetchEMIPlans()
  }, [])

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
        category: 'UPI',
        img: gPay,
        paymentMethod: t.gPay || 'Google Pay',
        paymentMethodNet: t.gPay || 'Google Pay',
        disabled: false,
        dataTest: testIds.paymentpage_phonePay
      },
      {
        category: 'UPI',
        img: phonePay,
        paymentMethod: t.phonePay || 'PhonePe UPI',
        paymentMethodNet: t.phonePay || 'PhonePe UPI',
        disabled: false,
        dataTest: testIds.paymentpage_phonePay
      }
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

      const monthlyInstallment = Math.floor(principal / months)

      const monthlyInterestRate = annualInterestRate / 12 / 100
      const emiWithoutInterest =
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
          (Math.pow(1 + monthlyInterestRate, months) - 1) || 0

      const totalInterest = (principal * annualInterestRate * months) / (12 * 100) || 0
      const monthlyInterestShare = totalInterest / months || 0

      const emi = Math.floor(emiWithoutInterest + monthlyInterestShare)
      const totalCost = emi * months
      const interestAmount = Number((principal * annualInterestRate) / 100) || 0
      return { emi, interestAmount, annualInterestRate, totalCost }
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
            <Accordion allowToggle>
              <RadioGroup
                onChange={setSelectedPlan}
                value={selectedPlan}
                className="radio-group-emi"
              >
                {emiPlans.map(plan => (
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
                                {plan.providerShortDescription}
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
                            const priceTotal = priceValue * quantity
                            const principal = priceTotal || totalPrice || priceTotal + totalPrice

                            const monthlyInstallment = Math.floor(principal / months)

                            const monthlyInterestRate = annualInterestRate / 12 / 100
                            const emiWithoutInterest =
                              (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                                (Math.pow(1 + monthlyInterestRate, months) - 1) || 0

                            const totalInterest = (principal * annualInterestRate * months) / (12 * 100) || 0
                            const monthlyInterestShare = totalInterest / months || 0

                            const emi = Math.floor(emiWithoutInterest + monthlyInterestShare)
                            const totalCost = emi * months
                            const interestAmount = Number((principal * annualInterestRate) / 100) || 0
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
                                    ₹ {emi} x {item.name}m
                                  </Box>
                                  <Box
                                    fontSize="10px"
                                    fontWeight="500"
                                    color="#626060"
                                  >
                                    ₹ {interestAmount} ({annualInterestRate}%)
                                  </Box>
                                  <Box
                                    fontSize="10px"
                                    fontWeight="500"
                                    color="#626060"
                                  >
                                    ₹ {totalCost.toFixed(2)}
                                  </Box>
                                </Flex>
                                <Divider />
                              </React.Fragment>
                            )
                          })}
                        </Box>
                      </AccordionPanel>
                    )}
                  </AccordionItem>
                ))}
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
                  text={'Your documents have been successfully verified, and your loan request is approved!'}
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
            <BottomModal
              isOpen={openModal}
              onClose={() => setOpenModal(false)}
            >
              <Box pt="20px">
                <Flex
                  justifyContent={'space-between'}
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
                    onClick={handleSyncWallet}
                  />
                </Flex>
                <Divider
                  mb="24px"
                  mt="4px"
                />
              </Box>
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Full Name"
              />
              <Input
                paddingInlineStart={'unset'}
                _focusVisible={{
                  borderColor: 'unset'
                }}
                border={'unset'}
                placeholder=""
              />
              <Divider
                borderColor={'#3A3A3A'}
                opacity="1"
                mb="20px"
              />
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Date of Birth"
              />
              <Input
                paddingInlineStart={'unset'}
                _focusVisible={{
                  borderColor: 'unset'
                }}
                border={'unset'}
                placeholder=""
              />
              <Divider
                borderColor={'#3A3A3A'}
                opacity="1"
                mb="20px"
              />
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Pan Card"
              />
              <Input
                paddingInlineStart={'unset'}
                _focusVisible={{
                  borderColor: 'unset'
                }}
                border={'unset'}
                placeholder=""
                value={PANNumber}
              />
              <Divider
                borderColor={'#3A3A3A'}
                opacity="1"
                mb="20px"
              />
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Aadhaar"
              />
              <Input
                paddingInlineStart={'unset'}
                _focusVisible={{
                  borderColor: 'unset'
                }}
                border={'unset'}
                placeholder=""
                value={aadharNumber}
              />
              <Divider
                borderColor={'#3A3A3A'}
                opacity="1"
                mb="20px"
              />
              <Typography
                fontWeight="400"
                fontSize="15px"
                text="Mobile Number"
              />
              <Input
                paddingInlineStart={'unset'}
                _focusVisible={{
                  borderColor: 'unset'
                }}
                border={'unset'}
                placeholder=""
              />
              <Divider
                borderColor={'#3A3A3A'}
                opacity="1"
                mb="20px"
              />
              <BecknButton
                text="Submit"
                handleClick={handleOnSubmit}
              />
            </BottomModal>
          </Box>
        )
      )}
    </Box>
  )
}

export default PaymentMode
