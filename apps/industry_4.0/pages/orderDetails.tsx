import { OrderStatusProgress } from '@beckn-ui/becknified-components'
import { Accordion, Typography } from '@beckn-ui/molecules'
import { Box, CardBody, Divider, Flex, Stack, Text, Image, StackDivider, Card, useDisclosure } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import React, { useEffect, useState } from 'react'

const orderStatusMap = {
  INTIATED: 'Order Received from DNL Embossing',
  PROGRESS: 'In Progress',
  COMPLETE: 'Order Complete',
  PICKUP: 'Ready for Pick-up',
  ORDERPICKED: 'Order Picked up by DHL Logistics'
}

const OrderDetails = () => {
  const [status, setStatus] = useState('Completed')
  const { t, locale } = useLanguage()
  return (
    <>
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
      <Box pt="20px">
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
      </Box>
    </>
  )
}

export default OrderDetails
