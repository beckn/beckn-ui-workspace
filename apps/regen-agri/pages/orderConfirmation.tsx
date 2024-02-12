import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { Box, Image, Stack, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'
import useRequest from '../hooks/useRequest'
import {
    getInitMetaDataPerBpp,
    getPayloadForConfirmRequest,
} from '../utilities/confirm-utils'
import { TransactionIdRootState } from '../lib/types/cart'
import LoaderWithMessage from '../components/loader/LoaderWithMessage'
import Button from '../components/button/Button'

const OrderConfirmation = () => {
    const [paymentType, setPaymentType] = useState('')
    const { t } = useLanguage()
    const confirmRequest = useRequest()
    const router = useRouter()
    const initResponse = useSelector(
        (state: any) => state.initResponse.initResponse
    )

    const transactionId = useSelector(
        (state: { transactionId: TransactionIdRootState }) =>
            state.transactionId
    )

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    useEffect(() => {
        setPaymentType(router?.query?.paymentType as string)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady])

    useEffect(() => {
        if (initResponse && paymentType.trim().length) {
            const initMetaDataPerBpp = getInitMetaDataPerBpp(initResponse)

            const payLoadForConfirmRequest = getPayloadForConfirmRequest(
                initMetaDataPerBpp,
                transactionId,
                paymentType
            )
            confirmRequest.fetchData(
                `${apiUrl}/client/v2/confirm`,
                'POST',
                payLoadForConfirmRequest
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentType])

    useEffect(() => {
        if (
            !initResponse &&
            localStorage &&
            localStorage.getItem('initResult') &&
            paymentType.trim().length
        ) {
            const parsedInitResult = JSON.parse(
                localStorage.getItem('initResult') as string
            )
            const initMetaDataPerBpp = getInitMetaDataPerBpp(parsedInitResult)

            const payLoadForConfirmRequest = getPayloadForConfirmRequest(
                initMetaDataPerBpp,
                transactionId,
                paymentType
            )
            confirmRequest.fetchData(
                `${apiUrl}/client/v2/confirm`,
                'POST',
                payLoadForConfirmRequest
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentType, initResponse])

    const handleOrderDetailsPage = () => {
        if (confirmRequest.data) {
            localStorage.setItem(
                'confirmData',
                JSON.stringify(confirmRequest.data)
            )
            router.push('/orderDetails')
        }
    }

    if (confirmRequest.loading) {
        return (
            <LoaderWithMessage
                loadingText={t.confirmingOrderLoaderText}
                loadingSubText={t.confirmingOrderLoaderSubText}
            />
        )
    }

    if (
        confirmRequest.error ||
        (confirmRequest.data &&
            (confirmRequest.data[0].message.responses.length === 0 ||
                confirmRequest.data[0].message.responses?.[0]?.error))
    ) {
        toast.error('Something went wrong', {
            position: 'top-center',
        })

        return <></>
    }

    return (
        <Box position={'relative'}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
                src={orderConfirmmark}
                margin={'41px auto'}
            />
            <Text
                fontSize={'17px'}
                fontWeight={'600'}
                textAlign={'center'}
            >
                {t.orderPlaced}
            </Text>
            <Stack>
                <Text
                    textAlign={'center'}
                    marginTop={'8px'}
                    marginBottom={'15px'}
                    fontSize={'15px'}
                >
                    {t.confirmMessage1} <br />
                    {t.confirmMessage2}
                </Text>
            </Stack>
            <Stack>
                <Box mt={'20px'}>
                    <Button
                        buttonText={'View Order Details'}
                        isDisabled={false}
                        type={'solid'}
                        handleOnClick={handleOrderDetailsPage}
                    />
                    <Button
                        buttonText={'Go Back Home'}
                        isDisabled={false}
                        type={'outline'}
                        handleOnClick={() => router.push('/homePage')}
                    />
                </Box>
            </Stack>
        </Box>
    )
}

export default OrderConfirmation
