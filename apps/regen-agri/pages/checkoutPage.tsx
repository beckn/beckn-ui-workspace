import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Flex, Text, Stack, Checkbox } from '@chakra-ui/react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import ItemDetails from '../components/detailsCard/ItemDetails'
import ButtonComp from '../components/button/Button'
import { useLanguage } from '../hooks/useLanguage'
import ShippingOrBillingDetails from '../components/detailsCard/ShippingOrBillingDetails'
import PaymentDetails from '../components/detailsCard/PaymentDetails'
import AddShippingButton from '../components/detailsCard/AddShippingButton'
import {
    CartItemForRequest,
    CartRetailItem,
    DataPerBpp,
    ICartRootState,
    TransactionIdRootState,
} from '../lib/types/cart'
import { getCartItemsPerBpp } from '../utilities/cart-utils'
import useRequest from '../hooks/useRequest'
import { responseDataActions } from '../store/responseData-slice'
import {
    areShippingAndBillingDetailsSame,
    getPayloadForInitRequest,
} from '../utilities/checkout-utils'
import AddBillingButton from '../components/detailsCard/AddBillingButton'
import { useRouter } from 'next/router'
import { formatCurrency } from '../utilities/currencyFormat'
import LoaderWithMessage from '../components/loader/LoaderWithMessage'
import { toast } from 'react-toastify'

export type ShippingFormData = {
    name: string
    mobileNumber: string
    email: string
    address: string
    city: string
    country: string
    state: string
    zipCode: string
}

const CheckoutPage = () => {
    const [formData, setFormData] = useState<ShippingFormData>({
        name: '',
        mobileNumber: '',
        email: '',
        address: '',
        zipCode: '',
        city: '',
        country: '',
        state: '',
    })
    const [isShippingFormFilled, setIsShippingFormFilled] = useState(false)
    const [isBillingFormFilled, setIsBillingFormFilled] = useState(false)
    const [
        isBillingAddressSameAsShippingAddress,
        setIsBillingAddressSameAsShippingAddress,
    ] = useState(true)
    const [billingFormData, setBillingFormData] =
        useState<ShippingFormData>(formData)
    const [quoteResponse, setQuoteResponse] = useState<any>(null)
    const [
        isBillingAddressCheckboxChecked,
        setIsBillingAddressCheckboxChecked,
    ] = useState(true)
    const [isFormSubmitted, setIsFormSubmitted] = useState({
        shippingForm: false,
        billingForm: false,
    })

    const router = useRouter()
    const initRequest = useRequest()
    const dispatch = useDispatch()
    const { t, locale } = useLanguage()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const cartItems = useSelector((state: ICartRootState) => state.cart.items)
    const transactionId = useSelector(
        (state: { transactionId: TransactionIdRootState }) =>
            state.transactionId
    )

    const fetchInit = (
        cartItems: CartRetailItem[],
        transactionId: TransactionIdRootState,
        formData: ShippingFormData,
        billingFormData: ShippingFormData,
        apiUrl: string
    ) => {
        const cartItemsPerBppPerProvider: DataPerBpp = getCartItemsPerBpp(
            cartItems as CartItemForRequest[]
        )

        const payLoadForInitRequest = getPayloadForInitRequest(
            cartItemsPerBppPerProvider,
            transactionId,
            formData,
            billingFormData
        )

        return initRequest.fetchData(
            `${apiUrl}/client/v2/initialize_order`,
            'POST',
            payLoadForInitRequest
        )
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('shippingAdress')) {
                setFormData(
                    JSON.parse(localStorage.getItem('shippingAdress') as string)
                )
                setIsFormSubmitted((prevState) => {
                    return { ...prevState, shippingForm: true }
                })
                setIsShippingFormFilled(true)
            }
            if (localStorage.getItem('billingAddress')) {
                setBillingFormData(
                    JSON.parse(localStorage.getItem('billingAddress') as string)
                )
                setIsFormSubmitted((prevState) => {
                    return { ...prevState, billingForm: true }
                })
                setIsBillingFormFilled(true)
            }

            if (
                localStorage.getItem('shippingAdress') &&
                localStorage.getItem('billingAddress')
            ) {
                const shippingFormDataFromStorage = JSON.parse(
                    localStorage.getItem('shippingAdress') as string
                )
                const billingFormDataFromStorage = JSON.parse(
                    localStorage.getItem('billingAddress') as string
                )
                fetchInit(
                    cartItems,
                    transactionId,
                    shippingFormDataFromStorage,
                    billingFormDataFromStorage,
                    apiUrl as string
                )
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (initRequest.data) {
            if (typeof window !== 'undefined') {
                localStorage.setItem(
                    'initResult',
                    JSON.stringify(initRequest.data)
                )
            }

            dispatch(responseDataActions.addInitResponse(initRequest.data))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initRequest.data])

    useEffect(() => {
        const shippingAddressComplete = Object.values(formData).every(
            (value) => value.length > 0
        )
        if (shippingAddressComplete && typeof window !== 'undefined') {
            localStorage.setItem('shippingAdress', JSON.stringify(formData))
        }
    }, [formData])

    useEffect(() => {
        const isBillingAddressComplete = Object.values(billingFormData).every(
            (value) => value.length > 0
        )

        if (isBillingAddressComplete && typeof window !== 'undefined') {
            localStorage.setItem(
                'billingAddress',
                JSON.stringify(billingFormData)
            )
        }
        setIsBillingAddressSameAsShippingAddress(
            areShippingAndBillingDetailsSame(
                isBillingAddressComplete,
                formData,
                billingFormData
            )
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [billingFormData])

    useEffect(() => {
        if (localStorage && localStorage.getItem('quoteResponse')) {
            const stringifiedQuoteResponse =
                localStorage.getItem('quoteResponse')
            setQuoteResponse(JSON.parse(stringifiedQuoteResponse as string))
        }
    }, [])

    useEffect(() => {
        if (isBillingAddressCheckboxChecked) {
            setBillingFormData(formData)
        }

        if (Object.keys(formData).every((key) => formData[key].trim().length)) {
            setIsShippingFormFilled(true)
            setIsBillingFormFilled(true)
        }
    }, [isBillingAddressCheckboxChecked, formData])

    const formSubmitHandlerForShippingForm = () => {
        setIsShippingFormFilled(true)
        setIsFormSubmitted((prevState) => {
            return { ...prevState, shippingForm: true }
        })
        return
    }

    const formSubmitHandlerForBillingForm = () => {
        setIsBillingFormFilled(true)
        setIsFormSubmitted((prevState) => {
            return { ...prevState, billingForm: true }
        })
        return
    }

    if (initRequest.loading) {
        return (
            <LoaderWithMessage
                loadingText={t.initializingOrderLoaderText}
                loadingSubText={t.initializingOrderLoaderSubText}
            />
        )
    }

    const isInitResultPresent = () => {
        if (typeof window !== 'undefined') {
            if (localStorage.getItem('initResult')) {
                return true
            }
        }

        return !!initRequest.data
    }

    if (
        initRequest.error ||
        (initRequest.data &&
            (initRequest.data[0].message.catalogs.responses.length === 0 ||
                initRequest.data[0].message.catalogs.responses?.[0]?.error))
    ) {
        toast.error('Something went wrong', {
            position: 'top-center',
        })

        return <></>
    }

    return (
        <>
            <Box>
                <Box pb={'10px'}>
                    <Text fontSize={'17px'}>{t.items}</Text>
                </Box>
                <DetailsCard>
                    {cartItems.map((item) => {
                        return (
                            <>
                                <ItemDetails
                                    title={item.descriptor.name}
                                    description={item.descriptor.short_desc}
                                    quantity={item.quantity}
                                    price={formatCurrency(
                                        parseFloat(item.price.value),
                                        item.price.currency
                                    )}
                                />
                            </>
                        )
                    })}
                </DetailsCard>
            </Box>
            {!isFormSubmitted.shippingForm ? (
                <Box>
                    <Flex
                        pb={'10px'}
                        mt={'20px'}
                        justifyContent={'space-between'}
                    >
                        <Text fontSize={'17px'}>{t.shipping}</Text>
                    </Flex>
                    <DetailsCard>
                        <AddShippingButton
                            imgFlag={!isFormSubmitted.shippingForm}
                            formData={formData}
                            setFormData={setFormData}
                            addShippingdetailsBtnText={
                                t.addShippingdetailsBtnText
                            }
                            formSubmitHandler={formSubmitHandlerForShippingForm}
                        />
                    </DetailsCard>
                </Box>
            ) : (
                <Box>
                    <Flex
                        pb={'10px'}
                        mt={'20px'}
                        justifyContent={'space-between'}
                    >
                        <Text fontSize={'17px'}>{t.shipping}</Text>
                        <AddShippingButton
                            imgFlag={!isShippingFormFilled}
                            formData={formData}
                            setFormData={setFormData}
                            addShippingdetailsBtnText={t.changeText}
                            formSubmitHandler={formSubmitHandlerForShippingForm}
                        />
                    </Flex>

                    <ShippingOrBillingDetails
                        accordionHeader={t.shipping}
                        name={formData.name}
                        location={formData.address}
                        number={formData.mobileNumber}
                    />
                </Box>
            )}
            {/* end shipping detals */}
            {/* start payment method */}
            {isBillingAddressSameAsShippingAddress ? (
                <Box>
                    <Flex
                        pb={'20px'}
                        mt={'20px'}
                        justifyContent={'space-between'}
                    >
                        <Text fontSize={'17px'}>{t.billing}</Text>
                        <AddBillingButton
                            billingFormData={billingFormData}
                            setBillingFormData={setBillingFormData}
                            addBillingdetailsBtnText={
                                !isBillingAddressCheckboxChecked
                                    ? t.changeText
                                    : ''
                            }
                            billingFormSubmitHandler={
                                formSubmitHandlerForBillingForm
                            }
                        />
                        {/* TODO :- Will enable this button after demo */}
                        {/* <Text
            fontSize={"15px"}
            color={"rgba(var(--color-primary))"}
            cursor={"pointer"}
          >
            {t.changeText}
          </Text> */}
                    </Flex>
                    <DetailsCard>
                        <Stack
                            spacing={5}
                            direction="row"
                        >
                            <Checkbox
                                colorScheme={'red'}
                                pr={'12px'}
                                fontSize={'17px'}
                                defaultChecked
                                onChange={() =>
                                    setIsBillingAddressCheckboxChecked(
                                        (prevValue) => !prevValue
                                    )
                                }
                            >
                                {t.orderDetailsCheckboxText}
                            </Checkbox>
                        </Stack>
                    </DetailsCard>
                </Box>
            ) : (
                <Box>
                    <Flex
                        pb={'20px'}
                        mt={'20px'}
                        justifyContent={'space-between'}
                    >
                        <Text fontSize={'17px'}>{t.billing}</Text>
                        <AddBillingButton
                            billingFormData={billingFormData}
                            setBillingFormData={setBillingFormData}
                            addBillingdetailsBtnText={t.changeText}
                            billingFormSubmitHandler={
                                formSubmitHandlerForBillingForm
                            }
                        />
                    </Flex>

                    <ShippingOrBillingDetails
                        accordionHeader={t.billing}
                        name={billingFormData.name}
                        location={billingFormData.address}
                        number={billingFormData.mobileNumber}
                    />
                </Box>
            )}

            {/* end payment method */}
            {/* start payment details */}
            {quoteResponse?.length > 0 && (
                <Box>
                    <Flex
                        pb={'10px'}
                        mt={'20px'}
                        justifyContent={'space-between'}
                    >
                        <Text fontSize={'17px'}>{t.paymentText}</Text>
                    </Flex>
                    <DetailsCard>
                        <PaymentDetails
                            qoute={
                                initRequest.data
                                    ? initRequest.data[0].message.catalogs
                                          .responses[0].message.order.quote
                                    : quoteResponse[0].message.catalogs.order
                                          .quote
                            }
                        />
                    </DetailsCard>
                </Box>
            )}

            {/* end payment details */}

            <ButtonComp
                buttonText={t.calcAmount}
                handleOnClick={() => {
                    fetchInit(
                        cartItems,
                        transactionId,
                        formData,
                        billingFormData,
                        apiUrl as string
                    )
                }}
                isDisabled={!(isShippingFormFilled && isBillingFormFilled)}
                type={'outline'}
            />

            <ButtonComp
                buttonText={t.proceedToCheckout}
                handleOnClick={() => router.push('/paymentMode')}
                isDisabled={!isInitResultPresent()}
                type={'solid'}
            />
        </>
    )
}
export default CheckoutPage
