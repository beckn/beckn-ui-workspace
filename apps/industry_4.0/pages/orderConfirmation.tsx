import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { InitResponseModel } from '../types/init.types'
import { getPayloadForConfirm } from '@utils/confirm-utils'
import axios from 'axios'
import { Loader, Typography } from '@beckn-ui/molecules'
import { Box, Text } from '@chakra-ui/react'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('initResult')) {
      const parsedInitResult: InitResponseModel[] = JSON.parse(localStorage.getItem('initResult') as string)
      const payLoad = getPayloadForConfirm(parsedInitResult)
      setIsLoading(true)
      axios
        .post(`${apiUrl}/confirm`, payLoad)
        .then(res => {
          localStorage.setItem('confirmResponse', JSON.stringify(res.data.data))
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          console.error(err)
        })
    }
  }, [])

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
