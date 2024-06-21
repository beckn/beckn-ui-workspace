import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormField } from '@beckn-ui/molecules'
import { ShippingSectionProps } from '../../../src/components/checkout/checkout.types'
import ShippingSection from '../../../src/components/checkout/shipping-section'
import { ChakraProvider } from '@chakra-ui/react'

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpoint: jest.fn()
}))

const mockProps: ShippingSectionProps<FormField[]> = {
  shippingForm: {
    formFieldConfig: [
      {
        name: 'name',
        label: 'Name',
        type: 'text',
        validate: (value: string) => (!value.trim() ? 'Name is required' : undefined)
      }
    ],
    onSubmit: jest.fn(),
    submitButton: {
      text: 'Submit',
      type: 'submit'
    },
    values: {
      name: '',
      email: '',
      mobileNumber: ''
    },
    onChange: jest.fn()
  },
  sectionSubtitle: 'Add Shipping Details',
  sectionTitle: 'Shipping',
  formTitle: 'Add Shipping Details',
  triggerFormTitle: 'change',
  sameAsTitle: 'Same as Shipping Details',
  showDetails: false,
  isBilling: false,
  shippingDetails: {
    name: 'John Doe',
    location: '123 Main St',
    number: '1234567890',
    title: 'Shipping Details'
  },
  addButtonImage: '/path/to/addShippingBtn.svg',
  isChecked: true,
  isDisabled: false,
  onCheckChange: jest.fn(),
  color: 'black'
}

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderShippingSectionComponent = (props: ShippingSectionProps<FormField[]>) => {
  return render(
    <ChakraProvider theme={theme}>
      <ShippingSection {...props} />
    </ChakraProvider>
  )
}

describe('ShippingSection Component', () => {
  it('renders the component with initial props', () => {
    renderShippingSectionComponent({ ...mockProps })

    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('Add Shipping Details')).toBeInTheDocument()
  })

  it('displays the change text when showDetails is true and isBilling is false', () => {
    renderShippingSectionComponent({ ...mockProps, showDetails: true })

    expect(screen.getByText('change')).toBeInTheDocument()
  })

  it('displays the checkbox when isBilling is true and isChecked is true', () => {
    renderShippingSectionComponent({ ...mockProps, isBilling: true, isChecked: true })

    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByLabelText('Same as Shipping Details')).toBeInTheDocument()
  })

  it('displays the form modal when add button is clicked', () => {
    renderShippingSectionComponent({ ...mockProps })

    const addButton = screen.getByText('Add Shipping Details')
    fireEvent.click(addButton)

    expect(screen.getAllByText('Add Shipping Details').at(0)).toBeInTheDocument()
  })

  it('calls onCheckChange when checkbox is clicked', () => {
    renderShippingSectionComponent({ ...mockProps, isBilling: true, isChecked: true })

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    expect(mockProps.onCheckChange).toHaveBeenCalled()
  })

  it('renders ShippingDetails component when showDetails is true', () => {
    renderShippingSectionComponent({ ...mockProps, showDetails: true })

    expect(screen.getByText('Shipping Details')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
  })
})
