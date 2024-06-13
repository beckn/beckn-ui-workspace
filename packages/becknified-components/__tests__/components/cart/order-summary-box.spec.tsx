import React from 'react'
import { render } from '@testing-library/react'
import OrderSummaryBox from '../../../src/components/cart/order-summary-box'
import { ChakraProvider } from '@chakra-ui/react'
import { OrderSummaryProps } from '../../../src/components/cart/cart.types'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

// Mock data
const mockProps: OrderSummaryProps = {
  totalAmount: {
    price: 100,
    currencyType: 'USD'
  },
  totalQuantity: {
    text: '10 items'
  },
  pageCTA: {
    text: 'Place Order',
    handleClick: jest.fn()
  },
  orderSummaryText: 'Mock Order Summary',
  totalQuantityText: 'Mock Total Quantity',
  totalAmountText: 'Mock Total Amount'
}

const renderOrderSummaryBoxComponent = (props: OrderSummaryProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <OrderSummaryBox {...props} />
    </ChakraProvider>
  )
}

describe('OrderSummaryBox Component', () => {
  it('renders order summary text correctly', () => {
    const { getByText } = renderOrderSummaryBoxComponent({ ...mockProps })
    expect(getByText('Mock Order Summary')).toBeInTheDocument()
  })

  it('renders total quantity correctly', () => {
    const { getByText } = renderOrderSummaryBoxComponent({ ...mockProps })
    expect(getByText('10 items')).toBeInTheDocument()
  })

  it('renders total amount correctly', () => {
    const { getByText } = renderOrderSummaryBoxComponent({ ...mockProps })

    expect(getByText('$100.00')).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', () => {
    const { getByText } = renderOrderSummaryBoxComponent({ ...mockProps })
    const button = getByText('Place Order')
    button.click()
    expect(mockProps.pageCTA.handleClick).toHaveBeenCalledTimes(1)
  })
})
