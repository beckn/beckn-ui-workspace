import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Toast } from '../../src/components'

describe('Toast Component', () => {
  it('should render the toast component', async () => {
    const { container, getByText, getByTestId } = render(
      <ChakraProvider>
        <Toast
          onClose={jest.fn()}
          title="mock title"
          description="mock Description"
          status="success"
        />
      </ChakraProvider>
    )

    expect(container).toBeInTheDocument()
    expect(getByText('mock title')).toBeInTheDocument()
    expect(getByText('mock Description')).toBeInTheDocument()
    expect(getByTestId('close-button')).toBeInTheDocument()
    expect(getByTestId('toast-icon-success')).toBeInTheDocument()
  })

  it('should close when CloseButton is clicked', () => {
    const { getByTestId } = render(
      <ChakraProvider>
        <Toast
          onClose={jest.fn()}
          title="mock title"
          description="mock Description"
          status="success"
        />
      </ChakraProvider>
    )

    fireEvent.click(getByTestId('close-button'))
  })

  it('should display correct icon based on status', () => {
    const { getByTestId } = render(
      <ChakraProvider>
        <Toast
          onClose={jest.fn()}
          title="mock title"
          description="mock Description"
          status="success"
        />
      </ChakraProvider>
    )

    expect(getByTestId('toast-icon-success')).toBeInTheDocument()
  })

  it('should render without description', () => {
    const { getByTestId, queryByTestId } = render(
      <ChakraProvider>
        <Toast
          onClose={jest.fn()}
          title="mock title"
          status="success"
        />
      </ChakraProvider>
    )

    expect(getByTestId('main_container')).toBeInTheDocument()
    expect(getByTestId('toast-icon-success')).toBeInTheDocument()
    expect(queryByTestId('toast_description')).toBeNull()
  })
})
