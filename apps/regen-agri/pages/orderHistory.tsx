import { Box, Text } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import DetailsCard from '../components/detailsCard/DetailsCard'
import LoaderWithMessage from '../components/loader/LoaderWithMessage'
import { orderHistoryData } from '../components/orderHistory/order-history.types'
import OrderHistoryDetails from '../components/orderHistory/OrderHistoryDetails'
import { useLanguage } from '../hooks/useLanguage'
import { formatTimestamp } from '../utilities/confirm-utils'
import EmptyPage from '../components/emptypage/EmptyPage'

const orderStatusMap = {
    INITIATED: 'pending',
    ACKNOWLEDGED: 'Confirmed',
    PACKED: 'Packed',
    SHIPPED: 'outForDelivery',
    DELIVERED: 'completed',
}

const OrderHistory = () => {
    const [orderHistoryList, setOrderHistoryList] = useState<
        orderHistoryData[]
    >([])
    const [isLoading, setIsLoading] = useState(true)
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    const [error, setError] = useState('')

    const { t } = useLanguage()

    const bearerToken = Cookies.get('authToken')
    const router = useRouter()

    useEffect(() => {
        let myHeaders = new Headers()
        myHeaders.append('Authorization', `Bearer ${bearerToken}`)

        let requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
        }
        fetch(`${strapiUrl}/orders?filters[category]=6`, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                console.log('resluttt', result)
                if (result.error) {
                    return setError(result.error.message)
                }
                const data: orderHistoryData[] = result.data
                setOrderHistoryList(data.reverse())
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
            })
            .finally(() => setIsLoading(false))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (isLoading) {
        return (
            <LoaderWithMessage
                loadingText={t.supportLoaderText}
                loadingSubText={t.cancelLoaderSubText}
            />
        )
    }

    if (!orderHistoryList.length) {
        return <EmptyPage />
    }

    if (error) {
        toast.error('Something went wrong', {
            position: 'top-center',
        })
    }

    return (
        <>
            {orderHistoryList.map((orderHistory) => {
                const { attributes, id } = orderHistory

                const {
                    createdAt,
                    bpp_id,
                    bpp_uri,
                    order_id,
                    items,
                    payments,
                    delivery_status,
                    transaction_id,
                } = attributes

                return (
                    <Box
                        onClick={() => {
                            const orderObjectForStatusCall = {
                                bppId: bpp_id,
                                bppUri: bpp_uri,
                                orderId: order_id,
                                transaction_id: transaction_id,
                            }
                            localStorage.setItem(
                                'selectedOrderFromHistory',
                                JSON.stringify(orderObjectForStatusCall)
                            )
                            router.push('/orderDetails')
                        }}
                        key={id}
                        pt={'20px'}
                    >
                        <DetailsCard>
                            <OrderHistoryDetails
                                createdAt={formatTimestamp(createdAt)}
                                orderId={order_id}
                                quantity={items.length}
                                totalAmountWithCurrency={payments.params}
                                orderState={delivery_status}
                            />
                        </DetailsCard>
                    </Box>
                )
            })}
        </>
    )
}

export default OrderHistory
