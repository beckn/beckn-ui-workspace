import React, { useEffect } from 'react'
import { Router, useRouter } from 'next/router'
import { Box, Button, Image, Stack, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'
import useRequest from '../hooks/useRequest'
import { getInitMetaDataPerBpp, getPayloadForConfirmRequest } from '../utilities/confirm-utils'
import Loader from '../components/loader/Loader'
import { TransactionIdRootState } from '../lib/types/cart'
import { ConfirmationPage } from '@beckn-ui/becknified-components'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const confirmRequest = useRequest()
  const router = useRouter()
  const initResponse = useSelector((state: any) => state.initResponse.initResponse)

  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (initResponse) {
      const initMetaDataPerBpp = getInitMetaDataPerBpp(initResponse)

      const payLoadForConfirmRequest = getPayloadForConfirmRequest(
        initMetaDataPerBpp,
        transactionId,
        localStorage.getItem('userPhone') as string
      )
      confirmRequest.fetchData(`${apiUrl}/client/v2/confirm`, 'POST', payLoadForConfirmRequest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!initResponse && localStorage && localStorage.getItem('initResult')) {
      const parsedInitResult = JSON.parse(localStorage.getItem('initResult') as string)
      const initMetaDataPerBpp = getInitMetaDataPerBpp(parsedInitResult)

      const payLoadForConfirmRequest = getPayloadForConfirmRequest(
        initMetaDataPerBpp,
        transactionId,
        localStorage.getItem('userPhone') as string
      )
      confirmRequest.fetchData(`${apiUrl}/client/v2/confirm`, 'POST', payLoadForConfirmRequest)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (confirmRequest.data) {
      localStorage.setItem('confirmData', JSON.stringify(confirmRequest.data))
      const timeout = setTimeout(() => {
        router.push('/orderDetails')
      }, 3000)

      // Clean up the timeout on component unmount
      return () => {
        clearTimeout(timeout)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmRequest.data])

  if (confirmRequest.loading) {
    return <Loader loadingText={t.confirmingOrderLoader} />
  }

  return (
    <ConfirmationPage
      schema={{
        iconSrc: orderConfirmmark,
        content: t.orderPlaced,
        contentMessage: t.orderSuccesfully,
        buttons: [
          {
            text: 'View Details',
            handleClick: () => {
              router.push('/orderHistory')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: 'Go Back Home',
            handleClick: () => {
              router.push('/homePage')
            },
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary'
          }
        ]
      }}
    />
  )
}

export default OrderConfirmation
