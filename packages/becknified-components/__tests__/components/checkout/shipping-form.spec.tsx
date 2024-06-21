import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FormField } from '@beckn-ui/molecules'
import { ShippingFormProps } from '../../../src/components/checkout/checkout.types'
import { ChakraProvider } from '@chakra-ui/react'
import ShippingForm from '../../../src/components/checkout/shipping-form'

const mockProps: ShippingFormProps<FormField[]> = {
  formFieldConfig: undefined,
  onSubmit: jest.fn(),
  submitButton: {
    text: 'Submit',
    type: 'submit'
  },
  values: {
    name: 'Lisa',
    mobileNumber: '9811259151',
    email: 'lisa.k@gmail.com',
    address: '1202 b2, Bengaluru urban, Bengaluru, Karnataka',
    pinCode: '560078'
  },
  onChange: jest.fn()
}

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderShippingFormComponent = (props: ShippingFormProps<FormField[]>) => {
  return render(
    <ChakraProvider theme={theme}>
      <ShippingForm {...props} />
    </ChakraProvider>
  )
}

describe('ShippingForm Component', () => {
  it('renders the form fields correctly', () => {
    renderShippingFormComponent({ ...mockProps })

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Mobile Number')).toBeInTheDocument()
    expect(screen.getByText('Email ID')).toBeInTheDocument()
    expect(screen.getByText('Complete Address')).toBeInTheDocument()
    expect(screen.getByText('Zip Code')).toBeInTheDocument()
  })

  it('validates required fields', () => {
    const renderer = renderShippingFormComponent({ ...mockProps })

    const nameInput = renderer.baseElement.querySelector("input[name='name']")
    const mobileInput = renderer.baseElement.querySelector("input[name='mobileNumber']")
    const emailInput = renderer.baseElement.querySelector("input[name='email']")
    const addressInput = renderer.baseElement.querySelector("input[name='address']")
    const zipcodeInput = renderer.baseElement.querySelector("input[name='pinCode']")

    fireEvent.change(nameInput!, { target: { value: '' } })
    fireEvent.change(mobileInput!, { target: { value: '' } })
    fireEvent.change(emailInput!, { target: { value: '' } })
    fireEvent.change(addressInput!, { target: { value: '' } })
    fireEvent.change(zipcodeInput!, { target: { value: '' } })

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Mobile number is required')).toBeInTheDocument()
    expect(screen.getByText('Email ID is required')).toBeInTheDocument()
    expect(screen.getByText('Address is required')).toBeInTheDocument()
    expect(screen.getByText('Zip Code is required')).toBeInTheDocument()
  })

  it('validates mobile number format', async () => {
    const renderer = renderShippingFormComponent({ ...mockProps })

    const mobileInput = renderer.baseElement.querySelector("input[name='mobileNumber']")
    fireEvent.change(mobileInput!, { target: { value: '123' } })

    expect(screen.getByText('Invalid mobile number')).toBeInTheDocument()
  })

  it('validates email format', async () => {
    const renderer = renderShippingFormComponent({ ...mockProps })

    const emailInput = renderer.baseElement.querySelector("input[name='email']")
    fireEvent.change(emailInput!, { target: { value: 'invalid-email' } })

    expect(screen.getByText('Invalid email format')).toBeInTheDocument()
  })

  it('validates zip code format', async () => {
    const renderer = renderShippingFormComponent({ ...mockProps })

    const zipcodeInput = renderer.baseElement.querySelector("input[name='pinCode']")
    fireEvent.change(zipcodeInput!, { target: { value: '1234' } })

    expect(screen.getByText('Invalid Zip Code')).toBeInTheDocument()
  })

  it('calls onSubmit with form data when form is valid', async () => {
    const renderer = renderShippingFormComponent({ ...mockProps })

    const nameInput = renderer.baseElement.querySelector("input[name='name']")
    const mobileInput = renderer.baseElement.querySelector("input[name='mobileNumber']")
    const emailInput = renderer.baseElement.querySelector("input[name='email']")
    const addressInput = renderer.baseElement.querySelector("input[name='address']")
    const zipcodeInput = renderer.baseElement.querySelector("input[name='pinCode']")

    fireEvent.change(nameInput!, { target: { value: 'John Doe' } })
    fireEvent.change(mobileInput!, { target: { value: '1234567890' } })
    fireEvent.change(emailInput!, { target: { value: 'john.doe@example.com' } })
    fireEvent.change(addressInput!, { target: { value: '123 Main St' } })
    fireEvent.change(zipcodeInput!, { target: { value: '12345' } })

    const submitButton = screen.getByText('Submit')
    fireEvent.click(submitButton)

    expect(mockProps.onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      mobileNumber: '1234567890',
      email: 'john.doe@example.com',
      address: '123 Main St',
      pinCode: '12345'
    })
  })
})
