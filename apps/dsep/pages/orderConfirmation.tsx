import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Box } from '@chakra-ui/react'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { LoaderWithMessage } from '@beckn-ui/molecules'

import { useLanguage } from '../hooks/useLanguage'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import useRequest from '../hooks/useRequest'
import { getPayloadForConfirmRequest } from '../utilities/confirm-utils'

import { InitResponseModel } from '../lib/types/init.types'

import { ConfirmResponseModel } from '../lib/types/confirm.types'

const OrderConfirmation = () => {
  const { t } = useLanguage()
  const confirmRequest = useRequest()
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

  // TODO :- To enable this code for strapi order history call when the issue is fixed in the confirm response
  // useEffect(() => {
  //   if (confirmResponse) {
  //     const bearerToken = Cookies.get('authToken')
  //     const context = confirmResponse.data[0].context
  //     const order = confirmResponse.data[0].message

  //     const orderPayLoad = {
  //       context: context,
  //       message: {
  //         order: {
  //           id: order.orderId,
  //           provider: {
  //             id: order.provider.id,
  //             descriptor: order.provider.name
  //           },
  //           items: [
  //             {
  //               id: order.items[0].id,
  //               descriptor: order.items[0].descriptor,
  //               price: {
  //                 value: order.items[0].price.value,
  //                 currency: order.items[0].price.currency
  //               },
  //               tags: order.items[0].tags
  //             }
  //           ],
  //           fulfillments: [order.fulfillment],
  //           billing: {
  //             name: order.billing.name,
  //             address: order.billing.address.door,
  //             email: order.billing.email,
  //             phone: order.billing.phone
  //           },
  //           quote: {
  //             price: order.quote.price,
  //             breakup: order.quote.breakup
  //           },
  //           payments: [
  //             {
  //               type: order.payment.type,
  //               status: order.payment.status,
  //               params: {
  //                 amount: order.payment.params.amount,
  //                 currency: order.payment.params.currency
  //               }
  //             }
  //           ]
  //         }
  //       },
  //       category: {
  //         set: [1]
  //       }
  //     }

  //     const axiosConfig = {
  //       headers: {
  //         Authorization: `Bearer ${bearerToken}`,
  //         'Content-Type': 'application/json' // You can set the content type as needed
  //       }
  //     }
  //     axios
  //       .post(`${strapiUrl}/orders`, orderPayLoad, axiosConfig)
  //       .then(res => {})
  //       .catch(err => console.error(err))
  //   }
  // }, [confirmRequest.data])

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

  if (isError) {
    return <></>
  }

  return (
    <ConfirmationPage
      schema={{
        iconSrc: orderConfirmmark,
        content: t.orderPlaced,
        contentMessage: t.confirmMessageSubtext,
        buttons: [
          {
            text: t.viewOrderDetails,
            handleClick: () => {
              router.push('/orderDetails')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: t.myLearnings,
            handleClick: () => {
              router.push('/myLearningOrderHistor')
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
