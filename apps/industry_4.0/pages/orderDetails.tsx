import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import { Accordion, Loader, Typography } from '@beckn-ui/molecules'
import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { getPayloadForOrderStatus } from '@utils/confirm-utils'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ConfirmResponseModel } from '../types/confirm.types'
import { StatusResponseModel } from '../types/status.types'

const orderStatusMap = {
  INTIATED: 'Order Received from DNL Embossing',
  PROGRESS: 'In Progress',
  COMPLETE: 'Order Complete',
  PICKUP: 'Ready for Pick-up',
  ORDERPICKED: 'Order Picked up by DHL Logistics'
}

const OrderDetails = () => {
  const [status, setStatus] = useState('Completed')
  const [isLoading, setIsLoading] = useState(true)
  const [statusData, setStatusData] = useState<StatusResponseModel[]>([])
  const { t } = useLanguage()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (localStorage && localStorage.getItem('confirmResponse')) {
      const parsedConfirmData: ConfirmResponseModel[] = JSON.parse(localStorage.getItem('confirmResponse') as string)
      const statusPayload = getPayloadForOrderStatus(parsedConfirmData)
      setIsLoading(true)
      axios
        .post(`${apiUrl}/status`, statusPayload)
        .then(res => {
          const resData = res.data.data
          setStatusData(resData)
          localStorage.setItem('statusResponse', JSON.stringify(resData))
          setIsLoading(false)
        })
        .catch(err => {
          console.error(err)
          setIsLoading(false)
        })
    }
  }, [])

  if (isLoading) {
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
                  text={t.completed}
                  fontSize="15px"
                  className={status === 'Completed' ? 'order_status_text_completed' : ''}
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
                  orderState={'INTIATED'}
                  statusTime={'21th June'}
                />
              </Box>
            </>
          }
        />
      </Box>
      {/* TODO :- this is not in scope right now */}
      {/* <Box pt="20px">
        <Accordion
          className="order_progress_accordian"
          accordionHeader={
            <>
              {t.shipping}
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                pt={'10px'}
              >
                <Typography
                  variant="subTitleRegular"
                  text={'DNL Embossing'}
                  fontSize="12px"
                />
                <Typography
                  variant="subTitleRegular"
                  text={t.pending}
                  fontSize="15px"
                  className={status === 'Pending' ? 'order_status_text_pending' : ''}
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
                  orderState={'INTIATED'}
                  statusTime={'21th June'}
                />
              </Box>
            </>
          }
        />
      </Box> */}
    </Box>
  )
}

export default OrderDetails
