import { Spinner, Text, VStack } from '@chakra-ui/react'
import React from 'react'

interface LoaderPropsModel {
  loadingText?: string
  subLoadingText?: string
  stylesForLoadingText?: React.CSSProperties
}

const Loader: React.FC<LoaderPropsModel> = props => {
  return (
    <VStack
      justify="center"
      align="center"
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="#0560FA"
        size="xl"
      />
      {props.loadingText && (
        <Text
          style={props.stylesForLoadingText}
          marginTop={'21px'}
          textAlign="center"
        >
          {props.loadingText}
        </Text>
      )}
      {props.subLoadingText && <Text textAlign="center">{props.subLoadingText}</Text>}
    </VStack>
  )
}

export default React.memo(Loader)
