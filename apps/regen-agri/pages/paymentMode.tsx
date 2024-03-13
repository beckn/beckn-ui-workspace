import React, { useEffect, useState } from 'react'
import { Box, Flex, Text, Image, Card, CardBody, FormControl, FormLabel, Input, HStack, Select } from '@chakra-ui/react'

import Router from 'next/router'
import { useDispatch } from 'react-redux'

import Button from '../components/button/Button'
import BottomModalScan from '../components/BottomModal/BottomModalScan'
import styles from '../components/card/Card.module.css'
import CardWithCheckBox, { PaymentMethodsInfo } from '../components/card/Card'

import { useLanguage } from '../hooks/useLanguage'
import { validateCardPaymentForm } from '../utilities/cardPaymentForm-utils'
import { formatCurrency } from '../utilities/currencyFormat'

import { BsThreeDots } from 'react-icons/bs'
import { dbCountry } from '../mock/dbCountry.js'

export interface PaymentFormData {
  cardNumber: string
  expiryDate: string
  cvv: string
  country: string
  postalCode: string
}

const PaymentMode = () => {
  const { t } = useLanguage()

  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    country: '',
    postalCode: ''
  })

  const [selectedCard, setSelectedCard] = useState(null)
  const [transcationOpenModal, setTransacationOpenModal] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')
  const [filterMethods, setFilterMethods] = useState<PaymentMethodsInfo[]>([
    {
      id: 'stripe',
      isDisabled: false,
      paymentMethod: t.payAtStore
    }
  ])
  const paymentTypeMapper = {
    stripe: 'POST_FULFILLMENT'
  }

  const [initResult, setInitResult] = useState<any>(null)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  useEffect(() => {
    if (localStorage && localStorage.getItem('initResult')) {
      const parsedInitResult = JSON.parse(localStorage.getItem('initResult') as string)
      const paymentLink = parsedInitResult[0].message.catalogs.responses[0].message.order.payment.uri
      //   if (!paymentLink) {
      //     setFilterMethods(filterMethods.filter((_, index) => index === 1))
      //   }
      setPaymentLink(paymentLink)
      setInitResult(parsedInitResult)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTranscationModalClose = () => {
    setTransacationOpenModal(false)
  }
  // cardPaymentForm onChange handler

  //TODO :- to check the validations of payment modes
  const handleCardInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    // if (name === 'cardNumber' && !/^\d*$/.test(value)) {
    //   return
    // }
    // if (name === 'expiryDate' && !/^\d*$/.test(value)) {
    //   return
    // }
    if (name === 'cvv' && !/^\d*$/.test(value)) {
      return
    }

    setFormData((prevFormData: PaymentFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }
  // cardPaymentForm onSubmit handler
  const handleCardFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (validateCardPaymentForm(formData) && selectedPaymentMethod === 'stripe') {
      Router.push({
        pathname: '/orderConfirmation',
        query: {
          paymentType: (paymentTypeMapper as any)[selectedPaymentMethod as string]
        }
      })
    }
  }

  // enable/disable the payment button based on return value from validateForm fn.
  const isFormFilled = () => {
    return validateCardPaymentForm(formData)
  }

  const handleTransactionOpenModal = () => {
    setTransacationOpenModal(!transcationOpenModal)
  }

  if (!initResult) {
    return <></>
  }
  const handleChange = (id: any) => {
    setSelectedCard(id)
  }

  const initQuoteRes = initResult[0].message.catalogs.responses[0].message.order.quote.price
  const { currency, value } = initQuoteRes

  const formattedCurrency = formatCurrency(parseFloat(value), currency)

  return (
    <>
      <Box
        height={'72vh'}
        position={'relative'}
      >
        {/* <AppHeader appHeaderText={t.selectPaymentMethod} /> */}
        <Box>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            fontSize={'17px'}
            mb={'10px'}
          >
            <Text className="text-ellipsis">{t.cards}</Text>
            <Text
              color={'rgba(var(--color-primary))'}
              fontSize={'15px'}
            >
              {t.addCard}
            </Text>
          </Flex>
          <Card
            className="border_radius_all"
            mb={'20px'}
          >
            <CardBody
              padding={'15px 20px'}
              pb="26px"
            >
              <Flex
                className={styles.checkbox}
                mb="40px"
              >
                <input
                  type="checkbox"
                  id={'visa'}
                  onChange={() => handleChange('visa')}
                  checked={selectedCard === 'visa'}
                />
                <label htmlFor={'visa'}>
                  <Text
                    mt={'-3px'}
                    position={'absolute'}
                    width={'70vw'}
                    marginLeft="40px"
                  >
                    <Flex
                      alignItems={'center'}
                      mt="-6px"
                    >
                      <Image
                        alt="visa-img"
                        src={'./images/visa.svg'}
                      />
                      <Box pl={'20px'}>**** **** **** 1234</Box>
                    </Flex>
                  </Text>
                </label>
              </Flex>
              <Flex className={styles.checkbox}>
                <input
                  type="checkbox"
                  id={'master'}
                  onChange={() => handleChange('master')}
                  checked={selectedCard === 'master'}
                />
                <label htmlFor={'master'}>
                  <Text
                    mt={'-3px'}
                    position={'absolute'}
                    width={'70vw'}
                    marginLeft="40px"
                  >
                    <Flex
                      alignItems={'center'}
                      mt="-6px"
                    >
                      <Image
                        alt="card-img"
                        src={'./images/master.svg'}
                      />
                      <Box pl={'20px'}>**** **** **** 1234</Box>
                    </Flex>
                  </Text>
                </label>
              </Flex>
            </CardBody>
          </Card>
        </Box>
        <Text
          marginBottom={'8px'}
          fontSize={'17px'}
        >
          Other
        </Text>
        <CardWithCheckBox
          paymentMethods={filterMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />
      </Box>
      <Box
        position={'absolute'}
        bottom={'10px'}
        width={'90%'}
      >
        <Button
          buttonText={t.continueToPayment}
          type={'solid'}
          isDisabled={!selectedPaymentMethod}
          handleOnClick={handleTransactionOpenModal}
        />
      </Box>
      <BottomModalScan
        isOpen={transcationOpenModal}
        onClose={handleTranscationModalClose}
        modalHeader={'Stripe Payment Gateway'}
      >
        <Flex
          alignItems={'center'}
          m={'20px 26px'}
          columnGap={'25px'}
        >
          <Flex
            w={'71px'}
            h={'65px'}
            alignItems={'start'}
            justifyContent={'center'}
            flexDir={'column'}
            p={'10px'}
            border={'2px solid #0570DE'}
            borderRadius={'10px'}
          >
            <Image
              src="/images/card.svg"
              alt="eps icon"
            />
            <Text
              color={'#0570DE'}
              fontWeight={600}
              fontSize={'13px'}
            >
              Card
            </Text>
          </Flex>
          <Box
            w={'71px'}
            h={'65px'}
            border={'2px solid #E0E0E0'}
            borderRadius={'10px'}
          >
            <Flex
              w={'71px'}
              h={'65px'}
              alignItems={'start'}
              justifyContent={'center'}
              flexDir={'column'}
              p={'10px'}
            >
              <Image
                src="/images/EPS.svg"
                alt="eps icon"
              />
              <Text
                color={'#DFDFDF'}
                fontWeight={600}
                fontSize={'13px'}
              >
                EPS
              </Text>
            </Flex>
          </Box>
          <Box
            w={'71px'}
            h={'65px'}
            border={'2px solid #E0E0E0'}
            borderRadius={'10px'}
          >
            <Flex
              w={'71px'}
              h={'65px'}
              alignItems={'start'}
              justifyContent={'center'}
              flexDir={'column'}
              p={'10px'}
            >
              <Image
                src="/images/Giropay.svg"
                alt="eps icon"
              />
              <Text
                color={'#DFDFDF'}
                fontWeight={600}
                fontSize={'13px'}
              >
                Giropay
              </Text>
            </Flex>
          </Box>
          <Flex
            w={'40px'}
            h={'65px'}
            border={'2px solid #E0E0E0'}
            borderRadius={'10px'}
            justifyContent={'center'}
          >
            <BsThreeDots />
          </Flex>
        </Flex>
        <FormControl
          m={'0px 26px'}
          onSubmit={handleCardFormSubmit}
        >
          <FormLabel>Card number</FormLabel>
          <Flex
            alignItems={'center'}
            position={'relative'}
            w={'320px'}
          >
            <Input
              type="email"
              w={'100%'}
              p={'20px'}
              placeholder="1234 1234 1234 1234"
              border={'2px solid #E0E0E0'}
              borderRadius={'10px'}
              name="cardNumber"
              onChange={handleCardInputChange}
              value={formData.cardNumber}
              maxLength={16}
            />
            <Image
              src="/images/banks.svg"
              alt="bankCard icon"
              position={'absolute'}
              right={'8px'}
            />
          </Flex>
          <HStack mt={'10px'}>
            <Box>
              <FormLabel>Expiry</FormLabel>
              <Input
                type="text"
                w={'155px'}
                p={'20px'}
                placeholder="MM / YY"
                border={'2px solid #E0E0E0'}
                borderRadius={'10px'}
                name="expiryDate"
                onChange={handleCardInputChange}
                value={formData.expiryDate}
                maxLength={4}
              />
            </Box>
            <Box>
              <FormLabel>CVV</FormLabel>
              <Input
                type="email"
                w={'155px'}
                p={'20px'}
                placeholder="CVV"
                border={'2px solid #E0E0E0'}
                borderRadius={'10px'}
                name="cvv"
                onChange={handleCardInputChange}
                value={formData.cvv}
                maxLength={3}
              />
            </Box>
          </HStack>
          <HStack mt={'10px'}>
            <Box>
              <FormLabel>Country</FormLabel>
              <Select
                fontSize={'14px'}
                placeholder="Select Country"
                w={'155px'}
                name="country"
                onChange={handleCardInputChange}
                value={formData.country}
              >
                {dbCountry.map(country => (
                  <option
                    key={country.code}
                    value={country.code}
                  >
                    {country.name}
                  </option>
                ))}
              </Select>
            </Box>
            <Box>
              <FormLabel>Postal Code</FormLabel>
              <Input
                type="email"
                w={'155px'}
                p={'20px'}
                placeholder="90210"
                border={'2px solid #E0E0E0'}
                borderRadius={'10px'}
                name="postalCode"
                onChange={handleCardInputChange}
                value={formData.postalCode}
                // maxLength={6}
              />
            </Box>
          </HStack>
          <Box mt={'20px'}>
            <button
              style={{
                background: '#A71B4A',
                color: 'white',
                width: '315px',
                padding: '15px',
                borderRadius: '10px',
                opacity: isFormFilled() ? 1 : 0.5
              }}
              onClick={handleCardFormSubmit}
              disabled={!isFormFilled()}
            >
              Pay {formattedCurrency}
            </button>
          </Box>
        </FormControl>
      </BottomModalScan>
    </>
  )
}

export default PaymentMode
