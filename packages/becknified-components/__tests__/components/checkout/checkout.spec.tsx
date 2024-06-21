import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CheckoutProps } from '../../../src/components/checkout/checkout.types'
import { FormField } from '@beckn-ui/molecules'
import Checkout from '../../../src/components/checkout/checkout'
import { faker } from '@faker-js/faker'
import { ChakraProvider } from '@chakra-ui/react'

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpoint: jest.fn()
}))

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

// Mock data
const mockProps: CheckoutProps<FormField[]> = {
  schema: {
    items: {
      title: 'Items Title',
      data: [
        {
          title: 'Item 1',
          description: 'Description 1',
          quantity: 1,
          price: 10,
          currency: 'USD',
          image: 'image1.png'
        }
      ]
    },
    loader: {
      size: 'md',
      color: 'blue'
    },
    shipping: {
      shippingForm: {
        values: {
          address: '123 Main St',
          email: faker.internet.email(),
          mobileNumber: faker.phone.number(),
          name: faker.person.fullName()
        },
        onSubmit: () => {},
        submitButton: {}
      },
      shippingDetails: {
        location: '',
        name: faker.person.fullName(),
        number: faker.phone.number(),
        title: faker.string.alpha(10)
      },
      isChecked: true
    },
    billing: {
      shippingForm: {
        values: {
          address: '123 Main St',
          email: faker.internet.email(),
          mobileNumber: faker.phone.number(),
          name: faker.person.fullName()
        },
        onSubmit: () => {},
        submitButton: {}
      },
      shippingDetails: {
        location: '',
        name: faker.person.fullName(),
        number: faker.phone.number(),
        title: faker.string.alpha(10)
      },
      isChecked: true
    },
    payment: {
      title: 'Payment Details',
      paymentDetails: {
        paymentBreakDown: {},
        totalText: '',
        totalValueWithCurrency: { currency: 'INR', value: '100' }
      }
    },
    pageCTA: {
      text: 'Place Order',
      handleClick: jest.fn()
    }
  },
  isLoading: false,
  hasInitResult: true
}

const renderCheckoutComponent = (props: CheckoutProps<FormField[]>) => {
  return render(
    <ChakraProvider theme={theme}>
      <Checkout {...props} />
    </ChakraProvider>
  )
}

describe('Checkout Component', () => {
  it('renders loading state correctly', () => {
    const { container } = renderCheckoutComponent({ ...mockProps, isLoading: true })

    expect(container).toBeInTheDocument()
  })

  it('renders items correctly', () => {
    renderCheckoutComponent({ ...mockProps })
    expect(screen.getByText('Items Title')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Description 1')).toBeInTheDocument()
    expect(screen.getByText('$10.00')).toBeInTheDocument()
  })

  it('renders payment details when hasInitResult is true', () => {
    renderCheckoutComponent({ ...mockProps })
    expect(screen.getByText('Payment Details')).toBeInTheDocument()
    expect(screen.getByText('₹100.00')).toBeInTheDocument()
  })

  it('disables the button when hasInitResult is false', () => {
    renderCheckoutComponent({ ...mockProps, hasInitResult: false })
    const button = screen.getByRole('button', { name: 'Place Order' })
    expect(button).toBeDisabled()
  })

  it('calls onClick when the button is clicked', () => {
    renderCheckoutComponent({ ...mockProps })
    const button = screen.getByRole('button', { name: 'Place Order' })
    fireEvent.click(button)
    expect(mockProps.schema.pageCTA.handleClick).toHaveBeenCalled()
  })

  it('applies correct styles for large screens', () => {
    renderCheckoutComponent({ ...mockProps })
    const buttonContainer = screen.getByRole('button', { name: 'Place Order' }).parentElement
    expect(buttonContainer).toHaveStyle('width: 40%')
  })

  it('applies correct styles for small screens', () => {
    window.innerWidth = 500
    window.dispatchEvent(new Event('resize'))
    renderCheckoutComponent({ ...mockProps })

    const buttonContainer = screen.getByRole('button', { name: 'Place Order' }).parentElement
    expect(buttonContainer).toHaveStyle('width: 40%')
  })
})
