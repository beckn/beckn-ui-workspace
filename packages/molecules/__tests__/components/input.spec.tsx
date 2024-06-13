import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { ThemeProvider, CSSReset, extendTheme, ChakraProvider } from '@chakra-ui/react'
import { InputProps } from '../../src/components/input/input.types'
import Input from '../../src/components/input'

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

describe('Input Component', () => {
  const defaultProps: InputProps = {
    type: 'text',
    name: 'test-input',
    value: '',
    handleChange: jest.fn(),
    label: 'Test Label',
    className: 'test-class',
    placeholder: 'Enter text',
    error: ''
  }

  it('renders input correctly', () => {
    renderInputComponent({ ...defaultProps })

    const inputElement = screen.getByTestId('test-chakra-input')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('name', 'test-input')
    expect(inputElement).toHaveAttribute('type', 'text')
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text')
  })

  it('renders label correctly', () => {
    renderInputComponent({ ...defaultProps })

    const labelElement = screen.getByText('Test Label')
    expect(labelElement).toBeInTheDocument()
  })

  it('renders error message correctly', () => {
    const errorProps: InputProps = { ...defaultProps, error: 'Test Error' }
    renderInputComponent({ ...errorProps })

    const errorElement = screen.getByText('Test Error')
    expect(errorElement).toBeInTheDocument()
  })

  it('handles focus and blur events', () => {
    renderInputComponent({ ...defaultProps })

    const inputElement = screen.getByTestId('test-chakra-input')
    fireEvent.focus(inputElement)

    const labelElement = screen.getByText('Test Label')
    expect(labelElement).toHaveStyle(`color: ${theme.colors.primary[100]}`)

    fireEvent.blur(inputElement)
    expect(labelElement).toHaveStyle(`color: ${theme.colors.textPrimary}`)
  })

  it('calls handleChange on input change', () => {
    renderInputComponent({ ...defaultProps })

    const inputElement = screen.getByTestId('test-chakra-input')
    fireEvent.change(inputElement, { target: { value: 'new value' } })

    expect(defaultProps.handleChange).toHaveBeenCalledTimes(1)
  })
})
