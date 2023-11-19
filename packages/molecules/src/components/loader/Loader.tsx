import React from 'react'
import { Spinner, Text, Box } from '@chakra-ui/react'
import { LoaderPropsModel } from './loader.types'

const Loader: React.ForwardRefRenderFunction<HTMLDivElement, LoaderPropsModel> = (props, ref) => {
  const { className = '', thickness = '4px', emptyColor = 'gray.200', color = '#A71B4A', size = 'xl', children } = props

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      className={`${className}_loader`}
    >
      <Spinner
        className={className}
        thickness={thickness}
        emptyColor={emptyColor}
        color={color}
        size={size}
        label={'loading'}
      />

      {children}
    </Box>
  )
}

export default React.memo(React.forwardRef(Loader))
