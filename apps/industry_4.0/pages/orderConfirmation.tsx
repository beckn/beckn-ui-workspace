import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { InitResponseModel } from '../types/init.types'
import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@utils/confirm-utils'
import axios from 'axios'
import { Box, Text } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { ConfirmResponseModel } from '../types/confirm.types'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { Loader } from '@beckn-ui/molecules/src/components'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [confirmData, setConfirmData] = useState<ConfirmResponseModel[]>([])

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const bearerToken = Cookies.get('authToken')
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      'Content-Type': 'application/json' // You can set the content type as needed
    }
  }

  useEffect(() => {
    if (localStorage && localStorage.getItem('initResult')) {
      const parsedInitResult: InitResponseModel[] = JSON.parse(localStorage.getItem('initResult') as string)
      const payLoad = getPayloadForConfirm(parsedInitResult)
      setIsLoading(true)
      axios
        .post(`${apiUrl}/confirm`, payLoad)
        .then(res => {
          const responseData: ConfirmResponseModel[] = res.data.data
          setConfirmData(responseData)
          localStorage.setItem('confirmResponse', JSON.stringify(responseData))

          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          console.error(err)
        })
    }
  }, [])

  useEffect(() => {
    if (confirmData.length > 0) {
      const ordersPayload = getPayloadForOrderHistoryPost(confirmData)
      axios
        .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
        .then(res => {
          return res
        })
        .catch(err => console.error(err))
    }
  }, [confirmData])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <Loader>
          <Box
            mt={'13px'}
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
          >
            <Text
              as={Typography}
              fontWeight={600}
              fontSize={'15px'}
              text={t.pleaseWait}
            />

            <Text
              as={Typography}
              text={t.confirmLoaderSubtext}
              textAlign={'center'}
              alignSelf={'center'}
              fontWeight={400}
              fontSize={'15px'}
            />
          </Box>
        </Loader>
      </Box>
    )
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
              router.push('/orderDetails')
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
