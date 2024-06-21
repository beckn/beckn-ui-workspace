import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCtaProps } from '../../src/components/product-Cta/product-cta.types'
import ProductCta from '../../src/components/product-Cta'
import { ChakraProvider } from '@chakra-ui/react'

// Mocking the useResponsive hook
jest.mock('../../src/hooks/useResponsive', () => ({
  __esModule: true,
  default: () => ({
    isMobile: false
  })
}))

// Mocking ProductPrice component
jest.mock('../../src/components/product-price', () => ({
  __esModule: true,
  default: ({ price, currencyType }: { price: number; currencyType: string }) => (
    <div>{`Price: ${currencyType}${price}`}</div>
  )
}))

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderProductCTAComponent = (props: ProductCtaProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <ProductCta {...props} />
    </ChakraProvider>
  )
}

describe('ProductCta', () => {
  const defaultProps: ProductCtaProps = {
    currency: 'INR',
    totalPrice: '100',
    handleDecrement: jest.fn(),
    handleIncrement: jest.fn(),
    counter: 1,
    cta: { text: 'Add to Cart', handleClick: jest.fn() },
    counterTitle: 'Quantity',
    noCounter: false
  }

  it('should render the ProductCta component correctly', () => {
    renderProductCTAComponent({ ...defaultProps })

    expect(screen.getByText('Price: INR100')).toBeInTheDocument()
    expect(screen.getByText('Quantity')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('should call handleIncrement when + is clicked', () => {
    renderProductCTAComponent({ ...defaultProps })

    const incrementButton = screen.getByText('+')
    fireEvent.click(incrementButton)

    expect(defaultProps.handleIncrement).toHaveBeenCalledTimes(1)
  })

  it('should call handleDecrement when - is clicked', () => {
    renderProductCTAComponent({ ...defaultProps })

    const decrementButton = screen.getByText('-')
    fireEvent.click(decrementButton)

    expect(defaultProps.handleDecrement).toHaveBeenCalledTimes(1)
  })

  it('should render without counter when noCounter is true', () => {
    renderProductCTAComponent({ ...defaultProps, noCounter: true })

    expect(screen.queryByText('+')).not.toBeInTheDocument()
    expect(screen.queryByText('1')).not.toBeInTheDocument()
    expect(screen.queryByText('-')).not.toBeInTheDocument()
  })

  //   it('should display "Total" when isMobile is true', () => {
  //     // Mock the useResponsive hook to return isMobile true
  //     jest.mock('../../src/hooks/useResponsive', () => ({
  //       __esModule: true,
  //       default: () => ({
  //         isMobile: true
  //       })
  //     }))

  //     renderProductCTAComponent({ ...defaultProps })

  //     expect(screen.getByText('Total')).toBeInTheDocument()
  //   })
})
