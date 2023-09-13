import { SpinnerProps } from '@chakra-ui/react'

export interface LoaderPropsModel extends SpinnerProps {
  loadingText?: string
  subLoadingText?: string
  stylesForLoadingText?: React.CSSProperties
  stylesForSubLoadingText?: React.CSSProperties
  className?: string
  thickness?: string
  emptyColor?: string
  color?: string
  size?: string
}
