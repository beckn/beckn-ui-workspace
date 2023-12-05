import React from 'react'
import { ConfirmationPageProps } from './confirmation-page.types'
import { Image, Box, Flex, VStack } from '@chakra-ui/react'
import { Button } from '@beckn-ui/molecules'

const ConfirmationPage: React.FC<ConfirmationPageProps> = props => {
  const { iconSrc, content, buttons, className = '' } = props
  return (
    <Flex
      height={'100%'}
      flexDir={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      className={`${className}-confirm-page-container`}
    >
      <Box>
        <Image
          className={`${className}-confirm-image`}
          src={iconSrc}
        />
      </Box>
      <Box mt={'20px'}>{content}</Box>
      {buttons.length ? (
        <VStack
          className={`${className}-confirm-buttons-container`}
          mt={'21px'}
          width={'100%'}
        >
          {buttons.map((button, idx) => {
            return (
              <Button
                key={idx}
                {...button}
              />
            )
          })}
        </VStack>
      ) : null}
    </Flex>
  )
}

export default ConfirmationPage
