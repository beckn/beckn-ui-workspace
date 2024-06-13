import React from 'react'
import { render } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import ProductPrice, { ProductPriceProps } from '../../../src/components/cart/product-price'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderProductPriceComponent = (props: ProductPriceProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <ProductPrice {...props} />
    </ChakraProvider>
  )
}

describe('ProductPrice Component', () => {
  const baseProps: ProductPriceProps = {
    price: 100,
    symbol: '€',
    isLargeSize: false,
    isInSlider: false,
    isRtl: false,
    variant: 'secondary'
  }

  it('renders with primary color when variant is primary', () => {
    const props: ProductPriceProps = { ...baseProps, variant: 'primary' }
    const { getByTestId } = renderProductPriceComponent({ ...props })

    const box = getByTestId('test-product-price')
    expect(box).toHaveStyle(`color: ${theme.colors.primary[100]}`)
  })

  it('renders with secondary color when variant is secondary', () => {
    const props: ProductPriceProps = { ...baseProps, variant: 'secondary' }
    const { getByTestId } = renderProductPriceComponent({ ...props })

    const box = getByTestId('test-product-price')
    expect(box).toHaveStyle(`color: ${theme.colors.secondary[100]}`)
  })

  it('renders with justified content when in slider and RTL', () => {
    const props = { ...baseProps, isInSlider: true, isRtl: true }
    const { getByTestId } = renderProductPriceComponent({ ...props })

    const boxContainer = getByTestId('test-product-price-container')
    expect(boxContainer).toHaveStyle('justify-content: flex-start')
  })
})
