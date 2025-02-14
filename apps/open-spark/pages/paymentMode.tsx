import React, { useEffect, useState } from 'react'
import Router, { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { CheckoutRootState, discoveryActions, PaymentMethodSelectionProps } from '@beckn-ui/common'
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

const PaymentMode = (props: PaymentMethodSelectionProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [emiPlans, setEmiPlans] = useState<any[]>([])
  const initResponse = useSelector((state: CheckoutRootState) => state.checkout.initResponse)
  const price = initResponse[0]?.message.order.quote.price || 0
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [checkedState, setCheckedState] = useState<string | null>(null)
  const formData = useSelector((state: any) => state.emiForm)
  const emiPlansData = useSelector((state: any) => state.discoveryEmiPlan)
  const { transactionId, products } = useSelector((state: any) => state.discoveryEmiPlan)
  const [selectedEmiDetails, setSelectedEmiDetails] = useState<any>(null)

  const { t } = useLanguage()
  const router = useRouter()
  const dispatch = useDispatch()
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
        disabled: true,
        dataTest: testIds.paymentpage_visa
      },
      {
        category: 'Credit & Debit Cards',
        img: masterCard,
        paymentMethod: t.cardNumber,
        paymentMethodNet: t.cardNumber,
        disabled: true,
        dataTest: testIds.paymentpage_masterCard
      },

      {
        category: 'UPI',
        img: gPay,
        paymentMethod: t.gPay || 'Google Pay',
        paymentMethodNet: t.gPay || 'Google Pay',
        disabled: true,
        dataTest: testIds.paymentpage_phonePay
      },
      {
        category: 'UPI',
        img: phonePay,
        paymentMethod: t.phonePay || 'PhonePe UPI',
        paymentMethodNet: t.phonePay || 'PhonePe UPI',
        disabled: true,
        dataTest: testIds.paymentpage_phonePay
      },
      {
        category: 'Other',
        img: NetBanking,
        paymentMethod: t.netBanking,
        paymentMethodNet: t.netBanking,
        disabled: true,
        dataTest: testIds.paymentpage_NetBanking
      },
      {
        category: 'Other',
        img: CashOnDelivery,
        paymentMethod: t.cashOnDelivery,
        paymentMethodNet: t.netBanking,
        disabled: true,
        dataTest: testIds.paymentpage_CashOnDelivery
      }
    ]
  } = props

  const handleChange = (id: string) => {
    setCheckedState(id === checkedState ? null : id)
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
    const emiDetails = selectedPlan.item.map((item: any) => {
      const months = parseInt(item.name.match(/\d+/)?.[0] || '1')
      const annualInterestRate = parseFloat(item.price.value)
      const principal = parseFloat(price.value)
      const monthlyInstallment = Math.floor(principal / months)
      const monthlyInterestRate = annualInterestRate / 12 / 100
      const emi =
        (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
        (Math.pow(1 + monthlyInterestRate, months) - 1)
      const totalCost = emi * months
      const interestAmount = (principal * annualInterestRate) / 100

      return { monthlyInstallment, interestAmount, annualInterestRate, totalCost }
    })

    dispatch(setEmiDetails({ emiDetails }))

    // Ensure `transactionId` is defined
    if (!transactionId) {
      console.error('Transaction ID is missing!')
      return
    }

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

  return (
    <>
      <PaymentDetailsCard
        checkedState={checkedState!}
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
                            const months = parseInt(item.name.match(/\d+/)?.[0] || '1')
                            const annualInterestRate = parseFloat(item.price.value)
                            const principal = parseFloat(price.value)
                            const monthlyInstallment = Math.floor(principal / months)

                            const monthlyInterestRate = annualInterestRate / 12 / 100
                            const emi =
                              (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months)) /
                              (Math.pow(1 + monthlyInterestRate, months) - 1)
                            const totalCost = emi * months

                            const interestAmount = (principal * annualInterestRate) / 100
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
                                    ₹ {monthlyInstallment} x {item.name}m
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
        handleClick={() => setOpenModal(true)}
        disabled={(!checkedState && !selectedPlan) || disableButton}
      />

      {isSubmitting || showSuccess ? (
        <BottomModal
          onClose={() => {}}
          isOpen={isSubmitting || showSuccess}
        >
          <Box
            display={'grid'}
            height={'40vh'}
            alignContent={'center'}
          >
            {showSuccess ? (
              <Flex
                justifyContent={'center'}
                alignItems="center"
                flexDirection={'column'}
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
                  text={'Your documents have been successfully verified, and Kazam has approved your loan request!'}
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
        !showSuccess && ( // Ensure modal doesn't show after success
          <AddNewItemModal
            isLoading={false}
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
            schema={{
              header: 'Add New Credential',
              inputs: [
                {
                  type: 'select',
                  name: 'country',
                  options: [{ label: 'India', value: 'India' }],
                  value: formData.country,
                  handleChange: handleInputChange('country'),
                  label: 'Select Country',
                  error: ' '
                },
                {
                  type: 'text',
                  name: 'id-number',
                  value: formData.idNumber,
                  handleChange: handleInputChange('idNumber'),
                  label: 'Aadhar Number',
                  error: ''
                }
              ],
              buttons: [
                {
                  text: 'Submit',
                  handleClick: handleOnSubmit,
                  disabled: false,
                  variant: 'solid',
                  colorScheme: 'primary'
                }
              ]
            }}
            renderFileUpload={true}
            handleOnFileselectionChange={() => {}}
          />
        )
      )}
    </>
  )
}

export default PaymentMode
