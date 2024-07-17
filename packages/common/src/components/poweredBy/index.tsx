import React from 'react'
import { Image, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PoweredByProps } from './poweredBy.types'

const PoweredBy: React.FC<PoweredByProps> = ({ logoSrc, altText = 'logo', poweredByText }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="calc(100% - 40px)"
      position="fixed"
      bottom="15px"
      data-test="footer"
    >
      <Typography
        style={{ paddingRight: '8px' }}
        fontSize="12px"
        color="#000000"
        text={poweredByText}
      />
      <Image
        src={logoSrc}
        alt={altText}
        width={39}
        height={13}
      />
    </Flex>
  )
}

export default PoweredBy
