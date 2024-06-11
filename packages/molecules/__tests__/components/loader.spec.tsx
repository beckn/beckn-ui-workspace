import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { LoaderProps } from '../../src/components/types'
import Loader from '../../src/components/loader/Loader'
import { ChakraProvider } from '@chakra-ui/react'

const theme = {
  colors: { primary: { '100': '#3182ce' } }
}

const renderLoaderComponent = (props: LoaderProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <Loader {...props} />
    </ChakraProvider>
  )
}

describe('Loader component', () => {
  test('renders spinner with default settings', () => {
    renderLoaderComponent({})

    waitFor(
      () => {
        const spinnerElement = screen.findByText('loading')
        expect(spinnerElement).toBeInTheDocument()
      },
      { timeout: 2000 }
    )
  })

  test('renders spinner with custom color and size', () => {
    const customColor = 'red'
    const customSize = 'md'

    renderLoaderComponent({ color: customColor, size: customSize })

    waitFor(
      () => {
        const spinnerElement = screen.findByTestId('loader')
        expect(spinnerElement).toBeInTheDocument()
        expect(spinnerElement).toHaveAttribute('color', customColor)
        expect(spinnerElement).toHaveAttribute('size', customSize)
      },
      { timeout: 2000 }
    )
  })

  test('renders text when provided', () => {
    const customText = 'Loading...'

    renderLoaderComponent({ text: customText })

    const textElement = screen.getByText(customText)
    expect(textElement).toBeInTheDocument()
  })

  test('renders children when provided', () => {
    const customChildren = <div>Custom Children</div>

    renderLoaderComponent({ children: customChildren })

    const childrenElement = screen.getByText('Custom Children')
    expect(childrenElement).toBeInTheDocument()
  })
})
