import React from 'react'
import { Spinner, Text } from '@chakra-ui/react'
import { LoaderPropsModel } from './Loader.types'

const Loader: React.ForwardRefRenderFunction<HTMLDivElement, LoaderPropsModel> = (props, ref) => {
  const {
    loadingText,
    subLoadingText,
    stylesForLoadingText,
    stylesForSubLoadingText,
    className = '',
    thickness = '4px',
    emptyColor = 'gray.200',
    color = '#A71B4A',
    size = 'xl',
    children,
    ...restProps
  } = props

  return (
    <div
      style={restProps.style}
      ref={ref}
      className={`flex flex-col justify-center items-center h-[60vh] ${className}_loader`}
    >
      <Spinner
        className={`${className}_spinner`}
        thickness={thickness}
        emptyColor={emptyColor}
        color={color}
        size={size}
        {...restProps}
      />
      {loadingText && (
        <Text
          className={`${className}_loading_text`}
          style={stylesForLoadingText}
          marginTop={'21px'}
          textAlign="center"
        >
          {loadingText}
        </Text>
      )}
      {subLoadingText && (
        <Text className={`${className}_sub_loading_text`} style={stylesForSubLoadingText} textAlign="center">
          {subLoadingText}
        </Text>
      )}
      {children}
    </div>
  )
}

export default React.memo(React.forwardRef(Loader))
