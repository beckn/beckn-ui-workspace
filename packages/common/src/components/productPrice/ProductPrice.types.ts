import React from 'react'

export interface ProductPriceProps {
  price: number
  isLargeSize?: boolean
  isInSlider?: boolean
  style?: React.CSSProperties
  toFixed?: number
  currencySymbol?: string
  color?: string
  className?: string
}
