import React from 'react'
import { Box, Flex, Image } from '@chakra-ui/react'

// Custom
import { Button, Typography } from '@beckn-ui/molecules'
import Styles from './errorFallback.module.css'
import { ErrorFallbackProps } from './errorFallback.types'

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ schema }) => {
  const { logo, errorDetails, buttons, contactSupportProps } = schema
  return (
    <Box
      className={Styles.main_container}
      display="flex"
    >
      {logo && logo.src && (
        <Box width={'100%'}>
          <Flex className={Styles.logo_container}>
            <Image
              className={Styles.logo_skillup}
              src={logo.src}
              alt={logo.alt}
              pt="15px"
            />
          </Flex>
        </Box>
      )}
      <Box textAlign={'center'}>
        <Typography
          text={errorDetails.type}
          fontWeight="bold"
          fontSize="24px"
          className={Styles.network_fallback_text}
        />
        <Box fontSize="14px">{errorDetails.description}</Box>
      </Box>
      <Box
        width={'100%'}
        mt="80px"
      >
        <Button
          className={Styles.error_btn}
          key={buttons.text}
          {...buttons}
        />
      </Box>
      <Box
        onClick={contactSupportProps?.handleClick}
        cursor="pointer"
        fontSize={'14px'}
      >
        {contactSupportProps?.text}
      </Box>
    </Box>
  )
}

export default ErrorFallback
