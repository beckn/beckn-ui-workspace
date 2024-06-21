import React from 'react'
import { render } from '@testing-library/react'
import CartList from '../../../src/components/cart/cart-list'
import { CartItemProps, CartListProps } from '../../../src/components/cart/cart.types'
import { ChakraProvider } from '@chakra-ui/react'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

// Mock data
const mockCartItems: CartItemProps[] = [
  {
    id: '1',
    name: 'Item 1',
    price: 10,
    quantity: 2,
    handleDecrement: () => {},
    handleIncrement: () => {},
    image: '',
    symbol: 'INR'
  },
  {
    id: '2',
    name: 'Item 2',
    price: 15,
    quantity: 1,
    handleDecrement: () => {},
    handleIncrement: () => {},
    image: '',
    symbol: 'INR'
  }
]

const renderCartListComponent = (props: CartListProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <CartList {...props} />
    </ChakraProvider>
  )
}

describe('CartList Component', () => {
  it('renders with empty cartItems', () => {
    const { container } = renderCartListComponent({ cartItems: [] })

    expect(container.firstChild).toHaveTextContent('')
  })

  it('renders cartItems correctly', () => {
    const renderer = renderCartListComponent({ cartItems: mockCartItems })

    const cartItemElements = renderer.baseElement.querySelectorAll('.cart-item')
    expect(cartItemElements.length).toBe(mockCartItems.length)
  })
})
