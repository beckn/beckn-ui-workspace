// form.spec.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Form from '../../src/components/form/form'
import { FormField, FormProps } from '../../src/components/form/form.types'
import { InputTypeEnum } from '../../src/components/types'

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

const fields: FormField[] = [
  {
    name: 'email',
    type: InputTypeEnum.Email,
    label: 'Email',
    validate: (value: any) => (!value ? 'Email is required' : undefined)
  }
]

describe('Form component', () => {
  test('renders the form fields correctly', () => {
    renderFormComponent({
      onSubmit: jest.fn(),
      onFieldChange: jest.fn(),
      fields,
      submitButton: {
        type: 'submit',
        disabled: false,
        children: 'Submit'
      }
    })
    waitFor(
      () => {
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  test('displays validation error on submit', () => {
    renderFormComponent({
      onSubmit: jest.fn(),
      onFieldChange: jest.fn(),
      fields,
      submitButton: {
        type: 'submit',
        disabled: false,
        children: 'Submit'
      }
    })

    waitFor(
      () => {
        fireEvent.click(screen.getByText('Submit'))
        expect(screen.getByText('Email is required')).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  test('calls onSubmit with form data when valid', () => {
    const handleSubmit = jest.fn()
    renderFormComponent({
      onSubmit: handleSubmit,
      onFieldChange: jest.fn(),
      fields,
      submitButton: {
        type: 'submit',
        disabled: false,
        children: 'Submit'
      },
      values: { email: 'test@example.com' }
    })
    fireEvent.click(screen.getByText('Submit'))
    expect(handleSubmit).toHaveBeenCalledWith({ email: 'test@example.com' })
  })

  test('updates formData and calls onChange on field change', () => {
    const handleChange = jest.fn()
    renderFormComponent({
      onSubmit: jest.fn(),
      onFieldChange: jest.fn(),
      fields,
      submitButton: {
        type: 'submit',
        disabled: false,
        children: 'Submit'
      },
      values: { email: '' },
      onChange: handleChange
    })

    waitFor(
      () => {
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } })
        expect(handleChange).toHaveBeenCalledWith({ email: 'test@example.com' })
      },
      { timeout: 2000 }
    )
  })

  test('disables submit button when there are validation errors', () => {
    renderFormComponent({
      onSubmit: jest.fn(),
      onFieldChange: jest.fn(),
      fields,
      submitButton: {
        type: 'submit',
        disabled: false,
        children: 'Submit'
      }
    })

    waitFor(
      () => {
        fireEvent.click(screen.getByText('Submit'))
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled()
      },
      { timeout: 2000 }
    )
  })
})
