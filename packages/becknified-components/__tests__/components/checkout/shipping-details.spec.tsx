import React from 'react'
import { render, screen } from '@testing-library/react'
import ShippingDetails from '../../../src/components/checkout/shipping-details'
import { ChakraProvider } from '@chakra-ui/react'
import { ShippingDetailsProps } from '../../../src/components/checkout/checkout.types'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderShippingDetailsComponent = (props: ShippingDetailsProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <ShippingDetails {...props} />
    </ChakraProvider>
  )
}

// Mock data
const mockProps: ShippingDetailsProps = {
  title: 'Shipping Information',
  name: 'John Doe',
  location: '123 Main St, Springfield',
  number: 1234567890
}

describe('ShippingDetails Component', () => {
  it('renders the accordion header correctly', () => {
    renderShippingDetailsComponent({ ...mockProps })
    expect(screen.getByText('Shipping Information')).toBeInTheDocument()
  })

  it('renders the name correctly', () => {
    renderShippingDetailsComponent({ ...mockProps })
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders the location correctly', () => {
    renderShippingDetailsComponent({ ...mockProps })
    expect(screen.getByText('123 Main St, Springfield')).toBeInTheDocument()
  })

  it('renders the phone number correctly', () => {
    renderShippingDetailsComponent({ ...mockProps })
    expect(screen.getByText('1234567890')).toBeInTheDocument()
  })

  it('renders name icon', () => {
    renderShippingDetailsComponent({ ...mockProps })
    const nameIconImage = screen.getByAltText('nameIcon')
    expect(nameIconImage).toBeInTheDocument()
  })

  it('renders location icon', () => {
    renderShippingDetailsComponent({ ...mockProps })
    const locationIconImage = screen.getByAltText('locationIcon')
    expect(locationIconImage).toBeInTheDocument()
  })

  it('renders call phone icon', () => {
    renderShippingDetailsComponent({ ...mockProps })

    const callPhoneIconImage = screen.getByAltText('CallphoneIcon')
    expect(callPhoneIconImage).toBeInTheDocument()
  })
})
