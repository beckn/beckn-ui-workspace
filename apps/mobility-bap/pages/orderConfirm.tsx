import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import orderConfirmmark from '../public/images/orderConfirm.svg'
import { useLanguage } from '../hooks/useLanguage'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
// import { InitResponseModel } from '../types/init.types'
// import { getPayloadForConfirm, getPayloadForOrderHistoryPost } from '@utils/confirm-utils'
// import axios from 'axios'
// import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
// import { ConfirmResponseModel } from '../types/confirm.types'
// import LoaderWithMessage from '@components/loader/LoaderWithMessage'

const OrderConfirm = () => {
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
      'Content-Type': 'application/json'
    }
  }

  //   useEffect(() => {
  //     if (localStorage && localStorage.getItem('initResult')) {
  //       const parsedInitResult: InitResponseModel[] = JSON.parse(localStorage.getItem('initResult') as string)
  //       const payLoad = getPayloadForConfirm(parsedInitResult)
  //       setIsLoading(true)
  //       axios
  //         .post(`${apiUrl}/confirm`, payLoad)
  //         .then(res => {
  //           const responseData: ConfirmResponseModel[] = res.data.data
  //           setConfirmData(responseData)
  //           localStorage.setItem('confirmResponse', JSON.stringify(responseData))

  //           setIsLoading(false)
  //         })
  //         .catch(err => {
  //           setIsLoading(false)
  //           console.error(err)
  //         })
  //     }
  //   }, [])

  //   useEffect(() => {
  //     if (confirmData.length > 0) {
  //       const ordersPayload = getPayloadForOrderHistoryPost(confirmData)
  //       axios
  //         .post(`${strapiUrl}/orders`, ordersPayload, axiosConfig)
  //         .then(res => {
  //           return res
  //         })
  //         .catch(err => console.error(err))
  //     }
  //   }, [confirmData])

  //   if (isLoading) {
  //     return (
  //       <Box
  //         display={'grid'}
  //         height={'calc(100vh - 300px)'}
  //         alignContent={'center'}
  //       >
  //         <LoaderWithMessage
  //           loadingText={t.pleaseWait}
  //           loadingSubText={t.confirmLoaderSubtext}
  //         />
  //       </Box>
  //     )
  //   }

  return (
    <ConfirmationPage
      schema={{
        iconSrc: '/images/orderConfirm.svg',
        content: t.rideCancle,
        contentMessage: t.yourRide,
        buttons: [
          {
            text: 'Go Back Home',
            handleClick: () => {
              router.push('/orderDetails')
            },
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary'
          },
          {
            text: 'Book Another Ride',
            handleClick: () => {
              router.push('/homePage')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          }
        ]
      }}
    />
  )
}

export default OrderConfirm
