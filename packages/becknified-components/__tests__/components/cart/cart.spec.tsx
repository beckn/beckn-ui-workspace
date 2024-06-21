import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartProps } from '../../../src/components/cart/cart.types'
import Cart from '../../../src/components/cart'

jest.mock('@beckn-ui/molecules', () => ({
  Loader: () => <div data-testid="loader">Loading...</div>,
  Typography: jest.fn(({ text, ...props }) => <p {...props}>{text}</p>)
}))

jest.mock('../../../src/components/cart/cart-list', () => jest.fn(() => <div data-testid="cart-list" />))
jest.mock('../../../src/components/cart/order-summary-box', () =>
  jest.fn(() => <div data-testid="order-summary-box" />)
)
jest.mock('@beckn-ui/molecules/src/components/button/Button', () =>
  jest.fn(({ children, handleClick, ...props }) => (
    <button
      {...props}
      onClick={handleClick}
    >
      {children}
    </button>
  ))
)

const renderCartComponent = (props: CartProps) => {
  return render(<Cart {...props} />)
}

describe('Cart Component', () => {
  const defaultProps: CartProps = {
    schema: {
      loader: {},
      cartItems: [],
      orderSummary: { totalAmount: { price: 10 }, pageCTA: {}, totalQuantity: { text: '' } },
      emptyCard: {
        image: 'empty-card.png',
        heading: 'No items in the cart',
        subHeading: 'Please add some items to your cart',
        buttonText: 'Shop Now',
        buttonHanler: jest.fn()
      }
    },
    isLoading: false,
    emptyText: 'Empty cart',
    className: 'test-class'
  }

  it('should render Loader when loading', () => {
    renderCartComponent({ ...defaultProps, isLoading: true })

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('should display empty cart text when cart is empty and no emptyCard provided', () => {
    renderCartComponent({ ...defaultProps, schema: { ...defaultProps.schema, emptyCard: undefined } })

    expect(screen.getByText('Empty cart')).toBeInTheDocument()
  })

  it('should display empty card when cart is empty and emptyCard provided', () => {
    renderCartComponent({ ...defaultProps })

    expect(screen.getByAltText('empty-card')).toBeInTheDocument()
    expect(screen.getByText('No items in the cart')).toBeInTheDocument()
    expect(screen.getByText('Please add some items to your cart')).toBeInTheDocument()
    expect(screen.getByText('Shop Now')).toBeInTheDocument()
  })

  it('should call button handler on clicking the button in empty card', () => {
    renderCartComponent({ ...defaultProps })

    fireEvent.click(screen.getByText('Shop Now'))
    expect(defaultProps.schema.emptyCard?.buttonHanler).toHaveBeenCalled()
  })

  it('should render CartList and OrderSummaryBox when cart has items', () => {
    const propsWithItems: CartProps = {
      ...defaultProps,
      schema: {
        ...defaultProps.schema,
        cartItems: [
          {
            id: '1',
            name: 'Item 1',
            handleDecrement: () => {},
            handleIncrement: () => {},
            image: '',
            price: 100,
            quantity: 10,
            symbol: 'INR'
          }
        ]
      }
    }
    renderCartComponent({ ...propsWithItems })

    expect(screen.getByTestId('cart-list')).toBeInTheDocument()
    expect(screen.getByTestId('order-summary-box')).toBeInTheDocument()
  })
})
