import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import { ThemeProvider, CSSReset, ChakraProvider, extendTheme } from '@chakra-ui/react'
import { FormField, FormProps } from '../../src/components/form/form.types'
import { InputTypeEnum } from '../../src/components/input/input.types'
import Form from '../../src/components/form'

const theme = extendTheme({
  colors: {
    primary: {
      100: '#ff0000'
    },
    textPrimary: '#000000'
  }
})

const renderFormComponent = <T extends FormField[]>(props: FormProps<T>) => {
  return render(
    <ChakraProvider theme={theme}>
      <Form {...props} />
    </ChakraProvider>
  )
}

const formFields: FormField[] = [
  {
    name: 'name',
    type: InputTypeEnum.Text,
    label: 'Name',
    className: 'name-input',
    validate: (value: string) => (value ? undefined : 'Name is required')
  },
  {
    name: 'email',
    type: InputTypeEnum.Email,
    label: 'Email',
    className: 'email-input',
    validate: (value: string) => (value.includes('@') ? undefined : 'Email is invalid')
  }
]

const mockOnSubmit = jest.fn()
const mockOnChange = jest.fn()

const formProps: FormProps<FormField[]> = {
  onSubmit: mockOnSubmit,
  onFieldChange: jest.fn(),
  fields: formFields,
  submitButton: { type: 'submit', children: 'Submit' },
  values: { name: '', email: '' },
  onChange: mockOnChange
}

describe('Form Component', () => {
  it('renders form fields correctly', () => {
    renderFormComponent({ ...formProps })

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('displays validation errors for invalid inputs', async () => {
    const renderer = renderFormComponent({ ...formProps })

    const nameInput = renderer.baseElement.querySelector("input[name='name']")
    const emailInput = renderer.baseElement.querySelector("input[name='email']")

    fireEvent.change(nameInput!, { target: { value: 'name_demo' } })
    fireEvent.change(nameInput!, { target: { value: '' } })
    fireEvent.change(emailInput!, { target: { value: 'invalid-email' } })

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is invalid')).toBeInTheDocument()
  })

  it('calls onSubmit with valid form data', async () => {
    const renderer = renderFormComponent({ ...formProps })

    const nameInput = renderer.baseElement.querySelector("input[name='name']")
    const emailInput = renderer.baseElement.querySelector("input[name='email']")

    fireEvent.change(nameInput!, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput!, { target: { value: 'john.doe@example.com' } })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'John Doe', email: 'john.doe@example.com' })
  })

  it('calls onChange with updated form data on input change', async () => {
    const renderer = renderFormComponent({ ...formProps })

    const nameInput = renderer.baseElement.querySelector("input[name='name']")
    fireEvent.change(nameInput!, { target: { value: 'John Doe' } })

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({ name: 'John Doe', email: '' })
    })
  })
})
