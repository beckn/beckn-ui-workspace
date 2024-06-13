import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartItemProps } from '../../../src/components/cart/cart.types'
import CartItem from '../../../src/components/cart/cart-item'
import { ChakraProvider } from '@chakra-ui/react'

jest.mock('../../../src/components/product-price', () => ({
  __esModule: true,
  default: ({ price, currencyType }: { price: number; currencyType: string }) => (
    <div>
      {currencyType}
      {price}
    </div>
  )
}))

const theme = {
  colors: { primary: { '100': '#3182ce' } }
}

const renderCartItemComponent = (props: CartItemProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <CartItem {...props} />
    </ChakraProvider>
  )
}

describe('CartItem', () => {
  const defaultProps: CartItemProps = {
    id: '1',
    quantity: 2,
    name: 'Test Product',
    image: 'test-image.jpg',
    price: 100,
    symbol: 'INR',
    handleDecrement: jest.fn(),
    handleIncrement: jest.fn(),
    className: 'test-class',
    totalAmountText: 'Total Amount:'
  }

  it('should render the CartItem component with initial props', () => {
    renderCartItemComponent({ ...defaultProps })

    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /test product/i })).toHaveAttribute('src', 'test-image.jpg')
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
    expect(screen.getByText('Total Amount:')).toBeInTheDocument()
    expect(screen.getByText('INR200')).toBeInTheDocument()
  })

  it('should increment the counter', () => {
    renderCartItemComponent({ ...defaultProps })

    const incrementButton = screen.getByTestId('test-increment')
    fireEvent.click(incrementButton!)

    expect(defaultProps.handleIncrement).toHaveBeenCalledWith('1')
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
  })

  it('should decrement the counter', () => {
    renderCartItemComponent({ ...defaultProps })

    const decrementButton = screen.getByTestId('test-decrement')
    fireEvent.click(decrementButton)

    expect(defaultProps.handleDecrement).toHaveBeenCalledWith('1')
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
  })

  it('should change the input value', () => {
    const renderer = renderCartItemComponent({ ...defaultProps })

    const input = renderer.baseElement.querySelector('input[type="number"]')
    fireEvent.change(input!, { target: { value: '5' } })

    expect(input).toHaveValue(5)
  })

  it('should change icon to trash when counter is 1', () => {
    renderCartItemComponent({ ...defaultProps, quantity: 1 })

    const trashButton = screen.getByTestId('test-delete')
    fireEvent.click(trashButton)
    expect(defaultProps.handleDecrement).toHaveBeenCalledWith('1')
    expect(screen.getByDisplayValue('0')).toBeInTheDocument()
  })
})
