import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import { Box } from '@chakra-ui/react'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { LoaderWithMessage } from '@beckn-ui/molecules'
import { useLanguage } from '../hooks/useLanguage'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { getPayloadForConfirmRequest, getPostOrderPayload } from '../utilities/confirm-utils'
import { InitResponseModel } from '../lib/types/init.types'
import { ConfirmResponseModel } from '../lib/types/confirm.types'
import axios from '../services/axios'
import { testIds } from '@shared/dataTestIds'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [confirmResponse, setConfirmResponse] = useState<ConfirmResponseModel | null>(null)
  const [isError, setIsError] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('initResult')) {
      const parsedInitResult: InitResponseModel = JSON.parse(localStorage.getItem('initResult') as string)
      const payLoad = getPayloadForConfirmRequest(parsedInitResult)
      setIsLoading(true)
      axios
        .post(`${apiUrl}/confirm`, payLoad)
        .then(res => {
          const data = res.data
          setConfirmResponse(data)
          localStorage.setItem('confirmResponse', JSON.stringify(data))

          setIsLoading(false)
        })
        .catch(err => {
          setIsError(true)
          setIsLoading(false)
          console.error(err)
        })
    }
  }, [])

  useEffect(() => {
    if (confirmResponse) {
      const bearerToken = Cookies.get('authToken')
      const orderPayload = getPostOrderPayload(confirmResponse)

      const axiosConfig = {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      }
      axios
        .post(`${strapiUrl}/orders`, orderPayload, axiosConfig)
        .then(res => {})
        .catch(err => console.error(err))
    }
  }, [confirmResponse])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.confirmingOrderLoader}
        />
      </Box>
    )
  }

  return (
    <Box mt={'72px'}>
      <ConfirmationPage
        schema={{
          iconSrc: orderConfirmmark,
          successOrderMessage: '',
          gratefulMessage: t.orderPlaced,
          orderIdMessage: t.confirmMessageSubtext,
          buttons: [
            {
              text: t.viewOrderDetails,
              handleClick: () => {
                router.push('/orderDetails')
              },
              disabled: false,
              variant: 'solid',
              colorScheme: 'primary',
              dataTest: testIds.orderConfirmation_viewOrderButton
            },
            {
              text: t.myLearnings,
              handleClick: () => {
                router.push('/myLearningOrderHistory')
              },
              disabled: false,
              variant: 'outline',
              colorScheme: 'primary',
              dataTest: testIds.orderConfirmation_myLearning
            }
          ]
        }}
      />
    </Box>
  )
}

export default OrderConfirmation
