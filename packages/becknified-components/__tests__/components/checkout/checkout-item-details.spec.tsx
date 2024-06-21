import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, useBreakpoint } from '@chakra-ui/react'
import { ItemDetailProps } from '../../../src/components/checkout/checkout.types'
import ItemDetails from '../../../src/components/checkout/checkout-item-details'

// Mock `useBreakpoint`
jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpoint: jest.fn()
}))

// Mock data
const mockProps: ItemDetailProps = {
  title: 'Test Item',
  quantity: 2,
  description: 'This is a test item',
  image: 'test-image-url',
  price: 100,
  currency: 'USD'
}

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderCheckoutItemComponent = (props: ItemDetailProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <ItemDetails {...props} />
    </ChakraProvider>
  )
}

describe('ItemDetails Component', () => {
  it('renders item details correctly', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg') // Simulate large screen breakpoint
    renderCheckoutItemComponent({ ...mockProps })

    expect(screen.getByText('Test Item')).toBeInTheDocument()
    expect(screen.getByText('X 2')).toBeInTheDocument()
    expect(screen.getByText('This is a test item')).toBeInTheDocument()
    expect(screen.getByAltText('Test Item')).toBeInTheDocument()
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })

  it('does not render image on small screens', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('sm') // Simulate small screen breakpoint
    renderCheckoutItemComponent({ ...mockProps })

    expect(screen.queryByAltText('Test Item')).not.toBeInTheDocument()
  })

  it('renders image on large screens', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg') // Simulate large screen breakpoint
    renderCheckoutItemComponent({ ...mockProps })

    expect(screen.getByAltText('Test Item')).toBeInTheDocument()
  })

  it('renders quantity correctly', () => {
    renderCheckoutItemComponent({ ...mockProps })
    expect(screen.getByText('X 2')).toBeInTheDocument()
  })

  it('renders price correctly', () => {
    renderCheckoutItemComponent({ ...mockProps })
    expect(screen.getByText('$100.00')).toBeInTheDocument()
  })
})
