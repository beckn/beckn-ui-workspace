// input.spec.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Input from '../../src/components/input/input'
import { InputProps } from '../../src/components/input/input.types'

const theme = extendTheme({
  colors: {
    primary: {
      100: '#ff0000'
    },
    textPrimary: '#000000'
  }
})

const renderInputComponent = (props: InputProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <Input {...props} />
    </ChakraProvider>
  )
}

describe('Input component', () => {
  test('renders the input with the correct placeholder', () => {
    renderInputComponent({ placeholder: 'Enter text', handleChange: () => {}, name: '', type: 'text', value: '' })
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  test('handles focus and blur events', () => {
    renderInputComponent({ placeholder: 'Enter text', handleChange: () => {}, name: '', type: 'text', value: '' })
    waitFor(
      () => {
        const inputElement = screen.getByPlaceholderText('Enter text')

        fireEvent.focus(inputElement)
        expect(inputElement).toHaveStyle(`border-color: ${theme.colors.primary[100]}`)

        fireEvent.blur(inputElement)
        expect(inputElement).not.toHaveStyle(`border-color: ${theme.colors.primary[100]}`)
      },
      { timeout: 2000 }
    )
  })

  test('displays the label correctly', () => {
    renderInputComponent({
      label: 'Label Text',
      placeholder: 'Enter text',
      handleChange: () => {},
      name: '',
      type: 'text',
      value: ''
    })
    const inputElement = screen.getByPlaceholderText('Enter text')
    const labelElement = screen.getByText('Label Text')

    fireEvent.focus(inputElement)
    expect(labelElement).toHaveStyle(`color: ${theme.colors.primary[100]}`)

    fireEvent.blur(inputElement)
    expect(labelElement).toHaveStyle(`color: ${theme.colors.textPrimary}`)
  })

  test('displays the error message', () => {
    renderInputComponent({
      placeholder: 'Enter text',
      handleChange: () => {},
      name: '',
      type: 'text',
      value: '',
      error: 'Error message'
    })
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })

  test('calls handleChange on input change', () => {
    const handleChange = jest.fn()
    renderInputComponent({
      placeholder: 'Enter text',
      handleChange: handleChange,
      name: '',
      type: 'text',
      value: '',
      error: 'Error message'
    })
    fireEvent.change(screen.getByPlaceholderText('Enter text'), { target: { value: 'new value' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
