import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { useLanguage } from '../hooks/useLanguage'
import useRequest from '../hooks/useRequest'
import { getInitMetaDataPerBpp, getPayloadForConfirmRequest } from '../utilities/confirm-utils'
import Loader from '../components/loader/Loader'
import { TransactionIdRootState } from '../lib/types/cart'
import Button from '../components/button/Button'
import ConfirmOrder from '../components/confirmOrder/ConfirmOrder'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const confirmRequest = useRequest()
  const router = useRouter()
  const initResponse = useSelector((state: any) => state.initResponse.initResponse)
  const transactionId = useSelector((state: { transactionId: TransactionIdRootState }) => state.transactionId)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

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
      const bearerToken = Cookies.get('authToken')
      const context = confirmRequest.data[0].message.responses[0].context
      const order = confirmRequest.data[0].message.responses[0].message.order

      const orderPayLoad = {
        context: context,
        message: {
          order: {
            id: order.id,
            provider: {
              id: order.provider.id,
              descriptor: order.provider.descriptor
            },
            items: [
              {
                id: order.items[0].id,
                descriptor: order.items[0].descriptor,
                price: {
                  value: order.items[0].price.value,
                  currency: order.items[0].price.currency
                },
                tags: order.items[0].tags
              }
            ],
            fulfillments: [order.fulfillment],
            billing: {
              name: order.billing.name,
              address: order.billing.address.door,
              email: order.billing.email,
              phone: order.billing.phone
            },
            quote: {
              price: order.quote.price,
              breakup: order.quote.breakup
            },
            payments: [
              {
                type: order.payment.type,
                status: order.payment.status,
                params: {
                  amount: order.payment.params.amount,
                  currency: order.payment.params.currency
                }
              }
            ]
          }
        },
        category: {
          set: [1]
        }
      }

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json' // You can set the content type as needed
        }
      }
      axios
        .post(`${strapiUrl}/orders`, orderPayLoad, axiosConfig)
        .then(res => {})
        .catch(err => console.error(err))
    }
  }, [confirmRequest.data])

  if (confirmRequest.loading) {
    return <Loader loadingText={t.categoryLoadPrimary} subLoadingText={t.confirmingOrderLoader} />
  }
  const handleViewCource = () => {
    if (confirmRequest.data) {
      localStorage.setItem('confirmData', JSON.stringify(confirmRequest.data))
      router.push('/orderDetails')
    }
  }

  const learningHistoryHandler = (): void => {
    router.push('/myLearningOrderHistory')
  }

  return (
    <Box>
      <ConfirmOrder
        confirmationText={
          <>
            <Text fontSize={'17px'} fontWeight={'600'} textAlign={'center'}>
              {t.orderPlaced}
            </Text>
            <Stack>
              <Text textAlign={'center'} marginTop={'8px'} marginBottom={'40px'} fontSize={'15px'} fontWeight="400">
                {t.confirmMessage1} <br />
                {t.confirmMessage2}
              </Text>
            </Stack>
          </>
        }
      />
      <VStack>
        <Button
          buttonText={t.viewOrderDetails}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={false}
          handleOnClick={handleViewCource}
        />
        <Button
          buttonText={t.myLearnings}
          background={'transparent'}
          color={'rgba(var(--color-primary))'}
          isDisabled={false}
          handleOnClick={learningHistoryHandler}
        />
      </VStack>
    </Box>
  )
}

export default OrderConfirmation
