import React from 'react'
import { Box, Divider, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PaymentDetailsProps } from './checkout.types'

const PaymentDetails: React.FC<PaymentDetailsProps> = props => {
  return (
    <Box>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        pb={'15px'}
        fontSize={'15px'}
      >
        <Typography text={props.subtotalText} />
        <Typography text={props.subtotalValue.toString()} />
      </Flex>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        pb={'15px'}
        fontSize={'15px'}
      >
        <Typography text={props.deliveryChargesText} />
        <Typography text={props.deliveryChargesValue.toString()} />
      </Flex>
      <Divider mb={'15px'} />
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        fontSize={'15px'}
        fontWeight={'600'}
      >
        <Typography text={props.totalText} />
        <div className="flex">
          <Typography text={props.totalValueWithSymbol} />
        </div>
      </Flex>
    </Box>
  )
}

export default PaymentDetails
