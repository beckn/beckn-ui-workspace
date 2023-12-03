import React from 'react'
import { Spinner, Text, Box, useTheme } from '@chakra-ui/react'
import { LoaderProps } from './loader.types'

const Loader: React.ForwardRefRenderFunction<HTMLDivElement, LoaderProps> = (props, ref) => {
  const theme = useTheme()
  const defaultSpinnerColor = theme.colors.primary['100']
  const {
    className = '',
    thickness = '4px',
    emptyColor = 'gray.200',
    color = defaultSpinnerColor,
    size = 'xl',
    children,
    text
  } = props

  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      className={className}
    >
      <Spinner
        className={className}
        thickness={thickness}
        emptyColor={emptyColor}
        color={color}
        size={size}
        label={'loading'}
      />

      {text ? text : children}
    </Box>
  )
}

export default React.memo(React.forwardRef(Loader))
