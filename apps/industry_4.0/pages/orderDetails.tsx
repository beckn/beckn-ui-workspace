import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import { Accordion, Loader, Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Text, useRadio } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { formatTimestamp, getPayloadForOrderStatus } from '@utils/confirm-utils'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { ConfirmResponseModel } from '../types/confirm.types'
import { StatusResponseModel } from '../types/status.types'

const orderStatusMap = {
  IN_ASSEMBLY_LINE: 'In Assembly Line',
  ITEM_DISPATCHED: 'Item Dispatched',
  DELIVERED: 'Delivered'
}

const OrderDetails = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [statusData, setStatusData] = useState<StatusResponseModel[]>([])
  const [apiCalled, setApiCalled] = useState(false)
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    const fetchData = () => {
      if (localStorage && localStorage.getItem('selectedOrder')) {
        const selectedOrderData = JSON.parse(localStorage.getItem('selectedOrder') as string)
        const { bppId, bppUri, orderId } = selectedOrderData
        const statusPayload = {
          data: [
            {
              context: {
                transaction_id: '',
                bpp_id: bppId,
                bpp_uri: bppUri,
                domain: 'supply-chain-services:assembly'
              },
              message: {
                order_id: orderId
              }
            }
          ]
        }
        setIsLoading(true)

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            const resData = res.data.data
            setStatusData(resData)
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setIsLoading(false)
            setApiCalled(true)
          })
      }
      if (localStorage && localStorage.getItem('confirmResponse')) {
        const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
        const statusPayload = getPayloadForOrderStatus(parsedConfirmData)
        setIsLoading(true)

        return axios
          .post(`${apiUrl}/status`, statusPayload)
          .then(res => {
            const resData = res.data.data
            setStatusData(resData)
            localStorage.setItem('statusResponse', JSON.stringify(resData))
          })
          .catch(err => {
            console.error('Error fetching order status:', err)
          })
          .finally(() => {
            setIsLoading(false)
            setApiCalled(true)
          })
      }
    }

    fetchData()

    const intervalId = setInterval(fetchData, 30000)

    return () => clearInterval(intervalId)
  }, [apiUrl])

  if (isLoading && !apiCalled) {
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
              text={t.statusLoaderSubText}
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
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Box
        pb="15px"
        pt={'20px'}
      >
        <Typography
          variant="subTitleRegular"
          text={t.progressSummary}
          fontSize="17px"
        />
      </Box>
      <Box>
        <Accordion
          accordionHeader={
            <>
              {t.assembly}
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                pt={'10px'}
              >
                <Typography
                  variant="subTitleRegular"
                  text={'RTAL Assembly Line'}
                  fontSize="12px"
                />
                <Typography
                  variant="subTitleRegular"
                  text={
                    statusData[0].message.order.fulfillments[0].state.descriptor.code === 'DELIVERED' ? t.completed : ''
                  }
                  fontSize="15px"
                  className={
                    statusData[0].message.order.fulfillments[0].state.descriptor.code === 'DELIVERED'
                      ? 'order_status_text_completed'
                      : ''
                  }
                />
              </Flex>
            </>
          }
          children={
            <>
              <Divider />
              <Box className="order_status_progress">
                <OrderStatusProgress
                  orderStatusMap={orderStatusMap}
                  orderState={statusData[0].message.order.fulfillments[0].state.descriptor.code}
                  statusTime={formatTimestamp(statusData[0].message.order.fulfillments[0].state.updated_at)}
                />
              </Box>
            </>
          }
        />
      </Box>
    </Box>
  )
}

export default OrderDetails
