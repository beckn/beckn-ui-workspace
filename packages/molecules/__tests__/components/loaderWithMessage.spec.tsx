import React from 'react'
import { render, screen } from '@testing-library/react'
import { LoaderWithMessagePropsModel } from '../../src/components/types'
import LoaderWithMessage from '../../src/components/LoaderWithMessage/loader-with-message'
import { ChakraProvider } from '@chakra-ui/react'

const theme = {
  colors: { primary: { '100': '#3182ce' } }
}

const renderLoaderComponent = (props: LoaderWithMessagePropsModel) => {
  return render(
    <ChakraProvider theme={theme}>
      <LoaderWithMessage {...props} />
    </ChakraProvider>
  )
}

describe('LoaderWithMessage component', () => {
  test('renders loading text and subtext correctly', () => {
    const loadingText = 'Loading'
    const loadingSubText = 'Please wait...'

    renderLoaderComponent({ loadingText: loadingText, loadingSubText: loadingSubText })

    const loadingTextElement = screen.getByText(loadingText)
    const loadingSubTextElement = screen.getByText(loadingSubText)

    expect(loadingTextElement).toBeInTheDocument()
    expect(loadingSubTextElement).toBeInTheDocument()
  })

  test('renders loading text when subtext not provided', () => {
    renderLoaderComponent({ loadingText: 'Loading', loadingSubText: '' })

    const loadingTextElement = screen.getByText('Loading')

    expect(loadingTextElement).toBeInTheDocument()
  })
})
