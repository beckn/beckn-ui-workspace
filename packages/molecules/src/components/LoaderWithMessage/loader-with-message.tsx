import { Loader } from '@beckn-ui/molecules'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { LoaderWithMessagePropsModel } from './loader-with-message.types'

const LoaderWithMessage: React.FC<LoaderWithMessagePropsModel> = props => {
  const { loadingText = '', loadingSubText = '', dataTest } = props
  return (
    <Loader dataTest={dataTest}>
      <Box
        mt={'13px'}
        display={'flex'}
        flexDir={'column'}
        alignItems={'center'}
      >
        <Text
          fontWeight={600}
          fontSize={'17px'}
        >
          {loadingText}
        </Text>
        <Text
          textAlign={'center'}
          fontWeight={400}
          fontSize={'15px'}
        >
          {loadingSubText}
        </Text>
      </Box>
    </Loader>
  )
}

export default React.memo(LoaderWithMessage)
