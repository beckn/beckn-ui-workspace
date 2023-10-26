import React from 'react'
import { Box, Divider, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'

export interface PaymentDetailsProps {
  subtotalText: string
  subtotalValue: number | string
  CGSTText: string
  SGSTText: string
  CGSTValue: number | string
  SGSTValue: number | string
  totalText: string
  totalValue: number | string
}

const PaymentDetails: React.FC<PaymentDetailsProps> = props => {
  const { t, locale } = useLanguage()
  return (
    <Box>
      <Flex justifyContent={'space-between'} alignItems={'center'} pb={'15px'} fontSize={'15px'}>
        <Text>{props.subtotalText}</Text>
        <Text>{props.subtotalValue}</Text>
      </Flex>
      <Flex justifyContent={'space-between'} alignItems={'center'} pb={'15px'} fontSize={'15px'}>
        <Text>{props.CGSTText}</Text>
        <Text>{props.CGSTValue}</Text>
      </Flex>
      <Flex justifyContent={'space-between'} alignItems={'center'} pb={'15px'} fontSize={'15px'}>
        <Text>{props.SGSTText}</Text>
        <Text>{props.SGSTValue}</Text>
      </Flex>
      <Divider mb={'15px'} />
      <Flex justifyContent={'space-between'} alignItems={'center'} fontSize={'15px'} fontWeight={'600'}>
        <Text>{props.totalText}</Text>
        <div className="flex">
          <Text>{`${t('currencySymbol')} ${props.totalValue}`}</Text>
        </div>
      </Flex>
    </Box>
  )
}

export default PaymentDetails
