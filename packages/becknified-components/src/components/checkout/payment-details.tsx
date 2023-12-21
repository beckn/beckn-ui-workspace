import React from 'react'
import { Box, Divider, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PaymentDetailsProps } from './checkout.types'

const PaymentDetails: React.FC<PaymentDetailsProps> = props => {
  return (
    <Box>
      {Object.entries(props.paymentBreakDown).map(([property, value]) => (
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          pb={'15px'}
        >
          <Typography
            text={property}
            fontSize={'15px'}
          />
          <Typography
            text={value}
            fontSize={'15px'}
          />
        </Flex>
      ))}

      <Divider mb={'15px'} />
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        fontWeight={'600'}
      >
        <Typography
          variant="titleSemibold"
          text={props.totalText}
          fontSize={'15px'}
        />
        <div className="flex">
          <Typography
            variant="titleSemibold"
            text={props.totalValueWithSymbol}
            fontSize={'15px'}
          />
        </div>
      </Flex>
    </Box>
  )
}

export default PaymentDetails
