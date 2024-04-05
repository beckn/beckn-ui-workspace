import React from 'react'
import { ConfirmationPageProps } from './confirmation-page.types'
import { Image, Box, Flex, VStack } from '@chakra-ui/react'
import { Button, Loader, Typography } from '@beckn-ui/molecules'
import useResponsive from '../../hooks/useResponsive'

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ schema, className }) => {
  const {
    iconSrc,
    content,
    contentMessage,
    buttons,
    successOrderMessage,
    gratefulMessage,
    orderIdMessage,
    trackOrderMessage
  } = schema
  const { isMobile } = useResponsive()

  return (
    <Flex
      height={'100%'}
      mt={{ base: '2rem', md: '5rem' }}
      flexDir={{ base: 'column', md: 'row', lg: 'row', xl: 'row', '2xl': 'row' }}
      alignItems={{ base: 'center', md: 'flex-start' }}
      justifyContent={'center'}
      gap={{ base: '0.5rem', md: '3rem' }}
      className={`${className}-confirm-page-container`}
    >
      <Box>
        <Image
          className={`${className}-confirm-image`}
          src={iconSrc}
        />
      </Box>

      <Box
        m="1rem 0"
        display="flex"
        flexDir="column"
        justifyContent={'center'}
        alignItems={'center'}
        maxW={{ base: '100%', md: '80%' }}
        textAlign={{ base: 'center', md: 'left' }}
      >
        <Box
          display="flex"
          flexDir="column"
          gap="1rem"
        >
          <Typography
            text={successOrderMessage}
            variant="subTitleSemibold"
          />
          <Typography
            fontSize={{ base: '1rem', md: '2rem' }}
            variant="subTitleSemibold"
            text={gratefulMessage}
          />
          <Typography
            style={{ fontSize: '1rem' }}
            text={orderIdMessage}
          />

          {!isMobile && (
            <Typography
              style={{ fontSize: '1rem' }}
              text={trackOrderMessage}
            />
          )}
        </Box>

        <Box
          width="100%"
          mt="4rem"
        >
          {buttons.length ? (
            <Box
              className={`${className}-confirm-buttons-container`}
              width={'100%'}
              display={{ base: 'block', lg: 'flex' }}
              gap="1rem"
            >
              {buttons.map((button, idx) => {
                return (
                  <Button
                    key={idx}
                    {...button}
                  />
                )
              })}
            </Box>
          ) : null}
        </Box>
      </Box>
    </Flex>
  )
}

export default ConfirmationPage
