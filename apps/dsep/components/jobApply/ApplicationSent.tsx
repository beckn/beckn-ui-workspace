import { Stack, Box, Image, Text } from '@chakra-ui/react'
import React, { FC } from 'react'
import orderConfirmmark from '../../public/images/orderConfirmmark.svg'

interface ApplicationSentProps {
  confirmationText: JSX.Element
}
const ApplicationSent: React.FC<ApplicationSentProps> = props => {
  return (
    <Box>
      <Image src={orderConfirmmark} margin={'20px auto'} />
      <Box fontSize={'17px'} fontWeight={'600'} textAlign={'center'}>
        {props.confirmationText}
      </Box>
    </Box>
  )
}

export default ApplicationSent
