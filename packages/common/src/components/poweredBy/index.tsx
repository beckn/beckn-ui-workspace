import React from 'react'
import { Image, Flex } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { PoweredByProps } from './poweredBy.types'
import { testIds } from '@shared/dataTestIds'

const PoweredBy: React.FC<PoweredByProps> = ({ logoSrc, altText = 'logo', poweredByText }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="100%"
      left={0}
      position="fixed"
      bottom="0px"
      padding={'10px'}
      bg={'white'}
      data-test={testIds.homepage_footer}
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
