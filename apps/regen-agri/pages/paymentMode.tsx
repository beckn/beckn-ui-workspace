import React, { useEffect, useState } from 'react'
import {
    Box,
    Flex,
    Text,
    Image,
    Card,
    CardBody,
    FormControl,
    FormLabel,
    Input,
    HStack,
    Select,
} from '@chakra-ui/react'
import Router from 'next/router'
import { useDispatch } from 'react-redux'
import Button from '../components/button/Button'
import CardWithCheckBox, { PaymentMethodsInfo } from '../components/card/Card'
import { useLanguage } from '../hooks/useLanguage'
import { cartActions } from '../store/cart-slice'
import styles from '../components/card/Card.module.css'
import BottomModalScan from '../components/BottomModal/BottomModalScan'
import { FaCreditCard } from 'react-icons/fa'
import { BsThreeDots } from 'react-icons/bs'

import { dbCountry } from '../mock/dbCountry.js'

const PaymentMode = () => {
    const [checked, setChecked] = useState(false)
    const [selectedCard, setSelectedCard] = useState(null)
    const [transcationOpenModal, setTransacationOpenModal] = useState(false)
    const handleTranscationModalClose = () => {
        setTransacationOpenModal(false)
    }

    const { t } = useLanguage()
    const [filterMethods, setFilterMethods] = useState<PaymentMethodsInfo[]>([
        {
            id: 'direct_pay',
            isDisabled: false,
            paymentMethod: t.directPay,
        },
        {
            id: 'pay_at_store',
            isDisabled: false,
            paymentMethod: t.payAtStore,
        },
    ])
    const paymentTypeMapper = {
        direct_pay: 'PRE_FULFILLMENT',
        pay_at_store: 'POST_FULFILLMENT',
    }
    const [initResult, setInitResult] = useState<any>(null)
    const [paymentLink, setPaymentLink] = useState('')
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
        string | null
    >(null)

    const dispatch = useDispatch()
    const handleTransactionOpenModal = () => {
        setTransacationOpenModal(!transcationOpenModal)
    }

    useEffect(() => {
        if (localStorage && localStorage.getItem('initResult')) {
            const parsedInitResult = JSON.parse(
                localStorage.getItem('initResult') as string
            )
            const paymentLink =
                parsedInitResult[0].message.catalogs.responses[0].message.order
                    .payment.uri
            if (!paymentLink) {
                setFilterMethods(
                    filterMethods.filter((_, index) => index === 1)
                )
            }
            setPaymentLink(paymentLink)
            setInitResult(parsedInitResult)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!initResult) {
        return <></>
    }
    const handleChange = (id: any) => {
        setSelectedCard(id)
    }

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
                                            <Box pl={'20px'}>
                                                **** **** **** 1234
                                            </Box>
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
                                            <Box pl={'20px'}>
                                                **** **** **** 1234
                                            </Box>
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
                    buttonText={t.confirmOrder}
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
                        border={'2px solid #E0E0E0'}
                        borderRadius={'10px'}
                    >
                        <FaCreditCard />
                        <Text>Card</Text>
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
                            <Text color={'#DFDFDF'}>EPS</Text>
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
                            <Text color={'#DFDFDF'}>Giropay</Text>
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
                <FormControl m={'0px 26px'}>
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
                                type="email"
                                w={'155px'}
                                p={'20px'}
                                placeholder="MM / YY"
                                border={'2px solid #E0E0E0'}
                                borderRadius={'10px'}
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
                            />
                        </Box>
                    </HStack>
                    <HStack mt={'10px'}>
                        <Box>
                            <FormLabel>Country</FormLabel>
                            <Select
                                placeholder="Select Country"
                                w={'155px'}
                            >
                                {dbCountry.map((country) => (
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
                            }}
                            onClick={() => {
                                Router.push('/orderConfirmation')
                            }}
                        >
                            pay $1502
                        </button>
                    </Box>
                </FormControl>
            </BottomModalScan>
        </>
    )
}

export default PaymentMode
