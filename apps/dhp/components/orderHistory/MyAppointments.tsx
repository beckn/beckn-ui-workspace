import { Box, Card, CardBody, Divider, Flex, Text, Image } from '@chakra-ui/react'
import React from 'react'
import { useLanguage } from '../../hooks/useLanguage'

interface MyAppointmentsProps {
  labName: string
  address: string
  time: string
  OrderId: string
  MyAppointmentsStatus: string
  handleHistoryOrderDetails: () => void
}

const MyAppointments: React.FC<MyAppointmentsProps> = props => {
  const { t } = useLanguage()
  return (
    <Box>
      <Card
        className="border_radius_all"
        mb={'20px'}
        boxShadow={'0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'}
        onClick={props.handleHistoryOrderDetails}
      >
        <CardBody padding={'15px 20px'} fontSize="12px">
          <Text fontWeight={'600'} pb={'10px'}>
            {props.labName}
          </Text>
          <Text pb={'5px'}>{props.address}</Text>
          <Text pb={'5px'}>{props.time}</Text>

          <Text pr={'10px'}>
            {t.orderId}: {props.OrderId}
          </Text>

          <Flex alignItems={'center'} justifyContent="space-between" pt={'5px'}>
            <Text fontWeight={'600'} color={'rgba(var(--color-primary))'}>
              {t.currencySymbol} 1000
            </Text>
            <Flex alignItems={'center'}>
              {props.MyAppointmentsStatus === 'Upcoming' ? (
                <Image src="/images/inProgress.svg" alt="" pr="10px" />
              ) : (
                <Image src="/images/approvedIcon.svg" alt="" pr="10px" />
              )}
              <Text>{props.MyAppointmentsStatus}</Text>
            </Flex>
          </Flex>
        </CardBody>
      </Card>
    </Box>
  )
}

export default MyAppointments
