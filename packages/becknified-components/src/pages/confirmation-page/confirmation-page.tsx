import React from 'react'
import { ConfirmationPageProps } from './confirmation-page.types'
import { Image, Box, Flex, VStack } from '@chakra-ui/react'
import { Button, Loader, Typography } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({ schema, className }) => {
  const { iconSrc, buttons, successOrderMessage, gratefulMessage, orderIdMessage, trackOrderMessage } = schema

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
          data-test={testIds.confirmPageImage}
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
            fontSize="1rem"
            dataTest={testIds.orderConfirmation_successOrderMessage}
          />
          <Typography
            fontSize="1rem"
            text={gratefulMessage}
            dataTest={testIds.orderConfirmation_gratefulMessage}
          />
          {orderIdMessage && (
            <Typography
              style={{ fontSize: '1rem' }}
              text={orderIdMessage}
              dataTest={testIds.orderConfirmation_orderIdMessage}
            />
          )}

          {trackOrderMessage && (
            <Typography
              style={{ fontSize: '1rem' }}
              text={trackOrderMessage}
              dataTest={testIds.orderConfirmation_trackOrderMessage}
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
                    dataTest={button.dataTest}
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
