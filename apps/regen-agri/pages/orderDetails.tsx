import {
    Box,
    CardBody,
    Divider,
    Flex,
    Stack,
    Text,
    Image,
    StackDivider,
    Card,
    useDisclosure,
    Link,
    Textarea,
} from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import Accordion from '../components/accordion/Accordion'
import CallphoneIcon from '../public/images/CallphoneIcon.svg'
import locationIcon from '../public/images/locationIcon.svg'
import nameIcon from '../public/images/nameIcon.svg'
import { useLanguage } from '../hooks/useLanguage'
import { ResponseModel } from '../lib/types/responseModel'
import {
    getConfirmMetaDataForBpp,
    formatTimestamp,
    getPayloadForStatusRequest,
    getPayloadForTrackRequest,
    getPayloadForCancelRequest,
} from '../utilities/confirm-utils'
import {
    getDataPerBpp,
    getPayloadForOrderHistoryPost,
} from '../utilities/orderDetails-utils'
import TrackIcon from '../public/images/TrackIcon.svg'
import ViewMoreOrderModal from '../components/orderDetails/ViewMoreOrderModal'
import useRequest from '../hooks/useRequest'
import {
    orderCardStatusMap,
    RenderOrderStatusList,
} from '../components/orderDetails/RenderOrderStatusTree'
import Router, { useRouter } from 'next/router'
import { StatusResponseModel } from '../lib/types/order-details.types'
import PaymentDetails from '../components/detailsCard/PaymentDetails'
import { QuoteModel } from '../components/detailsCard/PaymentDetails.types'
import Button from '../components/button/Button'
import BottomModal from '../components/BottomModal'
import LoaderWithMessage from '../components/loader/LoaderWithMessage'
import styles from '../components/card/Card.module.css'
import CancelOrder from '../components/orderDetails/cancelOrder/cancel-order'

const OrderDetails = () => {
    const [allOrderDelivered, setAllOrderDelivered] = useState(false)
    const [confirmData, setConfirmData] = useState<ResponseModel[]>([])
    const [statusResponse, setStatusResponse] = useState<StatusResponseModel[]>(
        []
    )
    const [cancelOrderModalOpen, setCancelOrderModalOpen] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    const statusRequest = useRequest()
    const trackRequest = useRequest()
    const router = useRouter()
    const { orderId } = router.query
    const cancelRequest = useRequest()
    const { t } = useLanguage()

    const paymentMethods = {
        'PRE-FULFILLMENT': t.directPay,
        POST_FULFILLMENT: t.payAtStore,
    }

    interface CancellationType {
        id: string
        cancellationTypeText: string
        checked?: boolean
    }

    const [cancellationType, setCancellationType] = useState<
        CancellationType[]
    >([
        {
            id: '1',
            cancellationTypeText: 'Merchant is taking too long',
            checked: false,
        },
        {
            id: '2',
            cancellationTypeText: 'Ordered by mistake',
            checked: false,
        },
        {
            id: '3',
            cancellationTypeText: 'I’ve changed my mind',
            checked: false,
        },
        {
            id: '4',
            cancellationTypeText: 'Other :',
            checked: false,
        },
    ])

    const paymentStatus = {
        'NOT-PAID': t.paymentPending,
        PAID: t.paid,
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

    const bearerToken = Cookies.get('authToken')
    const axiosConfig = {
        headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json', // You can set the content type as needed
        },
    }

    useEffect(() => {
        if (
            orderId &&
            localStorage &&
            localStorage.getItem('orderHistoryArray')
        ) {
            const parsedOrderHistoryArray = JSON.parse(
                localStorage.getItem('orderHistoryArray') as string
            )

            const relatedOrder = parsedOrderHistoryArray.find(
                (parsedOrder: any) => parsedOrder.parentOrderId === orderId
            )

            const transactionId = localStorage.getItem(
                'transactionId'
            ) as string

            setConfirmData(relatedOrder.orders)

            const confirmOrderMetaDataPerBpp = getConfirmMetaDataForBpp(
                relatedOrder.orders
            )
            const payloadForStatusRequest = getPayloadForStatusRequest(
                confirmOrderMetaDataPerBpp,
                transactionId
            )
            const payloadForTrackRequest = getPayloadForTrackRequest(
                confirmOrderMetaDataPerBpp,
                transactionId
            )

            trackRequest.fetchData(
                `${apiUrl}/client/v2/track`,
                'POST',
                payloadForTrackRequest
            )

            statusRequest.fetchData(
                `${apiUrl}/client/v2/status`,
                'POST',
                payloadForStatusRequest
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (localStorage && localStorage.getItem('selectedOrderFromHistory')) {
            const parsedOrderFromHistory = JSON.parse(
                localStorage.getItem('selectedOrderFromHistory') as string
            )
            const { bppId, bppUri, orderId, transaction_id } =
                parsedOrderFromHistory
            const payLoadForStatusRequest = {
                statusRequestDto: [
                    {
                        context: {
                            transaction_id: transaction_id,
                            bpp_id: bppId,
                            bpp_uri: bppUri,
                            domain: 'retail',
                        },

                        message: {
                            order_id: orderId,
                        },
                    },
                ],
            }

            statusRequest.fetchData(
                `${apiUrl}/client/v2/status`,
                'POST',
                payLoadForStatusRequest
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (localStorage && localStorage.getItem('confirmData')) {
            const stringifiedConfirmData = localStorage.getItem('confirmData')
            if (stringifiedConfirmData) {
                const parsedConfirmedData = JSON.parse(stringifiedConfirmData)
                setConfirmData(parsedConfirmedData)

                const confirmOrderMetaDataPerBpp =
                    getConfirmMetaDataForBpp(parsedConfirmedData)
                const transactionId = localStorage.getItem(
                    'transactionId'
                ) as string
                const payloadForStatusRequest = getPayloadForStatusRequest(
                    confirmOrderMetaDataPerBpp,
                    transactionId
                )
                const payloadForTrackRequest = getPayloadForTrackRequest(
                    confirmOrderMetaDataPerBpp,
                    transactionId
                )

                trackRequest.fetchData(
                    `${apiUrl}/client/v2/track`,
                    'POST',
                    payloadForTrackRequest
                )

                statusRequest.fetchData(
                    `${apiUrl}/client/v2/status`,
                    'POST',
                    payloadForStatusRequest
                )
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (statusRequest.data) {
            localStorage.setItem(
                'statusResponse',
                JSON.stringify(statusRequest.data)
            )
            setStatusResponse(statusRequest.data as StatusResponseModel[])
            if (
                statusRequest.data.every(
                    (res) => res.message.order.state === 'DELIVERED'
                )
            ) {
                setAllOrderDelivered(true)
            }
            const ordersPayload = getPayloadForOrderHistoryPost(
                statusRequest.data as StatusResponseModel[]
            )
            axios
                .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
                .then((res) => {
                    return res
                })
                .catch((err) => console.error(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusRequest.data])

    useEffect(() => {
        if (cancelRequest.data) {
            router.push('/orderCancellation')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cancelRequest.data])

    if (statusRequest.loading) {
        return (
            <LoaderWithMessage
                loadingText={t.statusLoaderText}
                loadingSubText={t.stausLoaderSubText}
            />
        )
    }

    if (!statusResponse.length) {
        return <></>
    }

    const statusDataPerBpp = getDataPerBpp(statusResponse)

    const orderFromStatusResponse = statusResponse[0].message.order
    const paymentObject = orderFromStatusResponse.payment

    const paymentState = paymentObject.status
    const paymentLink = paymentObject.uri
    const paymentType = paymentObject.type

    const totalQuantityOfOrder = (res: any) => {
        let count = 0
        res.message.order.items.forEach((item: any) => {
            count += item.quantity.count
        })
        return count
    }

    const getExtractedName = (str: string) => {
        const parts = str
            .trim()
            .split('/')
            .filter((part) => part !== '')
        const extracted = parts[parts.length - 1]

        return extracted
    }

    const shippingDetails = {
        name: getExtractedName(orderFromStatusResponse.billing.name),
        address: `${orderFromStatusResponse.billing.address.door} ${orderFromStatusResponse.billing.address.state}`,
        phone: orderFromStatusResponse.billing.phone,
    }

    const cancelOrderModalClose = () => {
        setCancelOrderModalOpen(false)
    }
    const handleCheckboxChange = (id: string) => {
        setCancellationType((prevTypes) =>
            prevTypes.map((type) => ({
                ...type,
                checked: type.id === id ? !type.checked : false,
            }))
        )
    }

    const handleCancelButton = () => {
        const cancelPayload = getPayloadForCancelRequest(statusResponse[0])
        return cancelRequest.fetchData(
            `${apiUrl}/client/v2/cancel`,
            'POST',
            cancelPayload
        )
    }

    return (
        <>
            {/* <AppHeader appHeaderText={t.selectPaymentMethod} /> */}
            {allOrderDelivered ? (
                <Card
                    mb={'20px'}
                    border={'1px solid rgba(94, 196, 1, 1)'}
                    className="border_radius_all"
                >
                    <CardBody padding={'15px 20px'}>
                        <Flex
                            alignItems={'center'}
                            pb={'3px'}
                        >
                            <Image
                                width={'12px'}
                                height={'13px'}
                                src={TrackIcon}
                                alt="track-icon"
                            />
                            <Text
                                pl={'8px'}
                                fontSize={'17px'}
                                fontWeight={'600'}
                            >
                                All orders delivered!
                            </Text>
                        </Flex>
                        <Flex
                            alignItems={'center'}
                            fontSize={'15px'}
                            pl={'20px'}
                        >
                            <Text>How did we do?</Text>
                            <Text
                                onClick={() => router.push('/feedback')}
                                pl={'10px'}
                                color={'rgba(var(--color-primary))'}
                            >
                                Rate Us
                            </Text>
                        </Flex>
                    </CardBody>
                </Card>
            ) : null}
            <Accordion
                accordionHeader={
                    <Box>
                        <Text>{t.orderSummary}</Text>
                    </Box>
                }
            >
                <CardBody
                    pt={'unset'}
                    fontSize={'15px'}
                >
                    <Flex
                        pt={'unset'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                    >
                        <Text>{t.orderPlacedAt}</Text>
                        <Text>
                            {formatTimestamp(
                                orderFromStatusResponse.created_at
                            )}
                        </Text>
                    </Flex>
                    {Object.keys(statusDataPerBpp).map((key) => (
                        <Box key={statusDataPerBpp[key].id}>
                            <Flex
                                pt={4}
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Text>{t.ordersFulfilled}</Text>
                                <Box>
                                    <Text
                                        as={'span'}
                                        pr={'2px'}
                                    >
                                        {
                                            statusResponse.filter(
                                                (res: any) =>
                                                    res.message.order.state ===
                                                    'DELIVERED'
                                            ).length
                                        }
                                    </Text>
                                    <Text as={'span'}>of</Text>
                                    <Text
                                        as={'span'}
                                        pl={'2px'}
                                    >
                                        {confirmData.length}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    ))}
                </CardBody>
            </Accordion>

            {statusResponse.map((res: any, index: number) => (
                <Accordion
                    key={index}
                    accordionHeader={
                        <Box>
                            <Flex
                                mb={'15px'}
                                fontSize={'17px'}
                                alignItems={'center'}
                            >
                                <Text pr={'8px'}>{t.orderId}:</Text>

                                <Text
                                    textOverflow={'ellipsis'}
                                    overflow={'hidden'}
                                    whiteSpace={'nowrap'}
                                >
                                    {res.message.order.displayId}
                                </Text>
                            </Flex>
                            <Flex
                                justifyContent={'space-between'}
                                alignItems={'center'}
                            >
                                <Flex maxWidth={'57vw'}>
                                    <Text
                                        textOverflow={'ellipsis'}
                                        overflow={'hidden'}
                                        whiteSpace={'nowrap'}
                                        fontSize={'12px'}
                                        fontWeight={'400'}
                                    >
                                        {
                                            res.message.order.items[0]
                                                .descriptor.name
                                        }
                                    </Text>
                                    {totalQuantityOfOrder(res) !== 1 && (
                                        <Text
                                            pl={'5px'}
                                            color={'rgba(var(--color-primary))'}
                                            fontSize={'12px'}
                                            fontWeight={'600'}
                                            onClick={onOpen}
                                        >
                                            +{totalQuantityOfOrder(res) - 1}
                                        </Text>
                                    )}
                                </Flex>

                                <Text
                                    fontSize={'15px'}
                                    fontWeight={'600'}
                                    color={
                                        res.message.order.state === 'INITIATED'
                                            ? 'rgba(var(--pending-status-color))'
                                            : 'rgba(var(--delivered-status-color))'
                                    }
                                >
                                    {
                                        t[
                                            `${
                                                orderCardStatusMap[
                                                    res.message.order.state
                                                ]
                                            }`
                                        ]
                                    }
                                </Text>
                            </Flex>
                        </Box>
                    }
                >
                    <ViewMoreOrderModal
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        items={res.message.order.items}
                        orderId={res.message.order.displayId}
                    />
                    <Divider mb={'20px'} />
                    <CardBody pt={'unset'}>
                        {RenderOrderStatusList(res)}
                    </CardBody>
                </Accordion>
            ))}

            <Accordion accordionHeader={t.shipping}>
                <CardBody
                    pt={'unset'}
                    pb={'15px'}
                >
                    <Box>
                        <Stack
                            divider={<StackDivider />}
                            spacing="4"
                        >
                            <Flex alignItems={'center'}>
                                <Image
                                    alt="name-icon"
                                    src={nameIcon}
                                    pr={'12px'}
                                />
                                <Text fontSize={'17px'}>
                                    {shippingDetails.name}
                                </Text>
                            </Flex>
                            <Flex alignItems={'center'}>
                                <Image
                                    alt="location-icon"
                                    src={locationIcon}
                                    pr={'12px'}
                                />
                                <Text fontSize={'15px'}>
                                    {shippingDetails.address}
                                </Text>
                            </Flex>
                            <Flex alignItems={'center'}>
                                <Image
                                    alt="call-icon"
                                    src={CallphoneIcon}
                                    pr={'12px'}
                                />
                                <Text fontSize={'15px'}>
                                    {shippingDetails.phone}
                                </Text>
                            </Flex>
                        </Stack>
                    </Box>
                </CardBody>
            </Accordion>
            <Accordion
                accordionHeader={
                    <Flex>
                        <Text>{t.paymentText}</Text>
                        {paymentState !== 'PAID' && (
                            <Image
                                pl="12px"
                                src="./images/error.svg"
                                alt="payment-pending-logo"
                            />
                        )}
                    </Flex>
                }
            >
                <CardBody
                    pt={'unset'}
                    pb={'unset'}
                >
                    <PaymentDetails
                        qoute={orderFromStatusResponse.quote as QuoteModel}
                    />
                </CardBody>
                <CardBody
                    pb={'unset'}
                    pt={'15px'}
                >
                    <Flex
                        fontSize={'15px'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        pb={'15px'}
                    >
                        <Flex
                            justifyContent={'space-between'}
                            alignItems="center"
                            width={'100%'}
                        >
                            <Text>{t.status}</Text>
                            <Box fontSize={'12px'}>
                                <Text
                                    as="span"
                                    pr="12px"
                                    color={'rgba(var(--color-primary))'}
                                >
                                    {paymentStatus[paymentState] ?? ''}
                                </Text>

                                {paymentState !== 'PAID' && (
                                    <Link
                                        onClick={() =>
                                            window.open(
                                                paymentLink,
                                                '_blank',
                                                'popup'
                                            )
                                        }
                                        color={'#4D930D'}
                                        textDecoration="underline"
                                    >
                                        {t.payHere}
                                    </Link>
                                )}
                            </Box>
                        </Flex>
                        {/* <Text>{orderState}</Text> */}
                    </Flex>
                    <Flex
                        fontSize={'15px'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        pb={'15px'}
                    >
                        <Text>{t.paymentMethod}</Text>
                        <Text>{paymentMethods[paymentType] ?? ''}</Text>
                    </Flex>
                </CardBody>
            </Accordion>
            <Button
                buttonText={t.goBackHome}
                isDisabled={false}
                type={'solid'}
                handleOnClick={() => {
                    Router.push('/homePage')
                }}
            />
            <Button
                buttonText={t.cancelOrder}
                isDisabled={false}
                type={'outline'}
                handleOnClick={() => setCancelOrderModalOpen(true)}
            />
            <Box className={styles.cancellationBtn}>
                <BottomModal
                    isOpen={cancelOrderModalOpen}
                    onClose={() => {}}
                >
                    {cancelRequest.loading ? (
                        <LoaderWithMessage
                            loadingText={t.supportLoaderText}
                            loadingSubText={t.cancelLoaderSubText}
                        />
                    ) : (
                        <CancelOrder
                            cancelOrderModalClose={cancelOrderModalClose}
                            cancellationType={cancellationType}
                            handleCancelButtonClick={handleCancelButton}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    )}
                </BottomModal>
            </Box>
        </>
    )
}

export default OrderDetails
