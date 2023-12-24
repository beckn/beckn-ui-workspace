import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { InitResponseModel } from '../types/init.types'
import { getPayloadForConfirm } from '@utils/confirm-utils'
import axios from 'axios'
import { Loader } from '@beckn-ui/molecules'

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
          setIsLoading(false)
        })
        .catch(err => {
          setIsLoading(false)
          console.error(err)
        })
    }
  }, [])

  if (isLoading) {
    return <Loader />
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
