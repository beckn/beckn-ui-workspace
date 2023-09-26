import { Stack, Box, Image, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import orderConfirmmark from '../../public/images/orderConfirmmark.svg'

interface ConfirmOrderProps {
  confirmationText: JSX.Element
}

const ConfirmOrder: FC<ConfirmOrderProps> = props => {
  return (
    <Box>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image src={orderConfirmmark} margin={'20px auto'} />
      <Box fontSize={'17px'} fontWeight={'600'} textAlign={'center'}>
        {props.confirmationText}
      </Box>
    </Box>
  )
}

export default ConfirmOrder
