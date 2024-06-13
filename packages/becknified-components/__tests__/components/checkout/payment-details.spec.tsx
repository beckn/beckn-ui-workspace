import React from 'react'
import { render, screen } from '@testing-library/react'
import { PaymentDetailsProps } from '../../../src/components/checkout/checkout.types'
import PaymentDetails from '../../../src/components/checkout/payment-details'
import { ChakraProvider } from '@chakra-ui/react'

// Mock data
const mockProps: PaymentDetailsProps = {
  title: 'Payment Summary',
  hasBoxShadow: true,
  paymentBreakDown: {
    Subtotal: { value: 100, currency: 'USD' },
    Tax: { value: 10, currency: 'USD' },
    Shipping: { value: 5, currency: 'USD' }
  },
  totalText: 'Total',
  totalValueWithCurrency: { value: '115', currency: 'USD' }
}

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderPaymentDetailsComponent = (props: PaymentDetailsProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <PaymentDetails {...props} />
    </ChakraProvider>
  )
}

describe('PaymentDetails Component', () => {
  it('renders the title correctly', () => {
    renderPaymentDetailsComponent({ ...mockProps })
    expect(screen.getByText('Payment Summary')).toBeInTheDocument()
  })

  it('renders payment breakdown correctly', () => {
    renderPaymentDetailsComponent({ ...mockProps })

    expect(screen.getByText('Subtotal')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
    expect(screen.getByText('Tax')).toBeInTheDocument()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('$5.00')).toBeInTheDocument()
  })

  it('renders total value correctly', () => {
    renderPaymentDetailsComponent({ ...mockProps })

    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('$115.00')).toBeInTheDocument()
  })

  it('renders without box shadow when hasBoxShadow is false', () => {
    renderPaymentDetailsComponent({ ...mockProps, hasBoxShadow: false })
    const box = screen.getByText('Subtotal').closest('div')
    expect(box).not.toHaveStyle(
      'box-shadow: 0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)'
    )
  })
})
