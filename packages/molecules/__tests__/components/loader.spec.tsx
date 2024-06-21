import React from 'react'
import { render, screen } from '@testing-library/react'
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

describe('Loader Component', () => {
  const defaultProps = {
    className: 'test-class',
    thickness: '4px',
    emptyColor: 'gray.200',
    color: theme.colors.primary['100'],
    size: 'xl',
    text: 'Loading...'
  }

  it('renders spinner with default props', () => {
    renderLoaderComponent({ ...defaultProps })

    const spinner = screen.getByText('loading')
    expect(spinner).toBeInTheDocument()
  })

  it('renders children correctly', () => {
    renderLoaderComponent({ ...defaultProps, text: '', children: <div>Custom Child</div> })

    const customChild = screen.getByText('Custom Child')
    expect(customChild).toBeInTheDocument()
  })

  it('renders text correctly', () => {
    renderLoaderComponent({ ...defaultProps })

    const textElement = screen.getByText('Loading...')
    expect(textElement).toBeInTheDocument()
  })
})
