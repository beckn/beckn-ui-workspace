import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { CurrencyType, ProductPriceProps } from '../../src/components/product-price/ProductPrice.types'
import ProductPrice from '../../src/components/product-price'

const renderWithTheme = (ui: React.ReactElement) => {
  const theme = extendTheme({
    colors: {
      primary: { 100: '#0000ff' },
      secondary: { 100: '#ff0000' }
    }
  })
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)
}

describe('ProductPrice Component', () => {
  const baseProps: ProductPriceProps = {
    price: 1234.56,
    currencyType: 'USD' as CurrencyType
  }

  it('renders correctly with default props', () => {
    renderWithTheme(<ProductPrice {...baseProps} />)
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('applies primary color scheme', () => {
    renderWithTheme(
      <ProductPrice
        {...baseProps}
        colorScheme="primary"
      />
    )
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('applies secondary color scheme', () => {
    renderWithTheme(
      <ProductPrice
        {...baseProps}
        colorScheme="secondary"
      />
    )
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('applies custom color', () => {
    renderWithTheme(
      <ProductPrice
        {...baseProps}
        color="green"
      />
    )
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    renderWithTheme(
      <ProductPrice
        {...baseProps}
        className="custom-class"
      />
    )
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })

  it('applies custom fontStyle', () => {
    const fontStyle = { fontWeight: 'bold' }
    renderWithTheme(
      <ProductPrice
        {...baseProps}
        fontStyle={fontStyle}
      />
    )
    expect(screen.getByText('$1,234.56')).toBeInTheDocument()
  })
})
