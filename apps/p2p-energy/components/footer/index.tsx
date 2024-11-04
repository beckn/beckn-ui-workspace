import React from 'react'
import { Image, Flex, Box } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

interface PoweredByProps {
  logoSrc: string
  altText?: string
  prefixText: string
  postfixText: string
}

const Footer: React.FC<PoweredByProps> = ({ logoSrc, altText = 'logo', prefixText, postfixText }) => {
  return (
    <>
      <Flex
        justifyContent="center"
        alignItems="center"
        width="100%"
        left={0}
        marginTop="2rem"
        // position="fixed"
        // bottom="26px"
        data-test={testIds.homepage_footer}
      >
        <Typography
          style={{ paddingRight: '4px' }}
          fontSize="12px"
          fontWeight="400"
          color="#212121"
          text={prefixText}
          dataTest={testIds.footer_prefix_text}
        />
        <Image
          src={logoSrc}
          alt={altText}
          width={39}
          height={13}
          data-test={testIds.footer_image}
        />
        <Typography
          style={{ paddingLeft: '4px' }}
          fontSize="12px"
          fontWeight="400"
          color="#212121"
          text={postfixText}
          dataTest={testIds.footer_postfix_text}
        />
      </Flex>
      <Flex
        justifyContent="center"
        alignItems="center"
        width="100%"
        left={0}
      >
        <Typography
          fontSize="8px"
          fontWeight="400"
          color="#212121"
          text="CC-BY-NC-SA 4.0"
          dataTest={testIds.footer_bottomfix_text}
        />
      </Flex>
    </>
  )
}

export default Footer
