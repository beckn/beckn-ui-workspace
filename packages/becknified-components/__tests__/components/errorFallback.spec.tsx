import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorFallbackProps } from '../../src/components/errorFallback/errorFallback.types'
import ErrorFallback from '../../src/components/errorFallback/errorFallback'

jest.mock('../../assets/logo.svg', () => 'logo.svg')

const mockSchema: ErrorFallbackProps = {
  schema: {
    logo: { src: 'logo.svg', alt: 'Logo Alt' },
    errorDetails: { type: 'Error Type', description: 'Error Description' },
    buttons: { text: 'Retry', handleClick: jest.fn() },
    contactSupportProps: { text: 'Contact Support', handleClick: jest.fn() }
  }
}

describe('ErrorFallback', () => {
  it('should render the logo if logo is provided', () => {
    const renderer = render(<ErrorFallback schema={mockSchema.schema} />)
    const logo = renderer.getByAltText('Logo Alt')
    expect(logo).toBeInTheDocument()
  })

  it('should render the error type and description', () => {
    render(<ErrorFallback schema={mockSchema.schema} />)
    const errorType = screen.getByText('Error Type')
    const errorDescription = screen.getByText('Error Description')
    expect(errorType).toBeInTheDocument()
    expect(errorDescription).toBeInTheDocument()
  })

  it('should render the button with provided text', () => {
    render(<ErrorFallback schema={mockSchema.schema} />)
    const button = screen.getByText('Retry')
    expect(button).toBeInTheDocument()
  })

  it('should call button onClick when clicked', () => {
    render(<ErrorFallback schema={mockSchema.schema} />)
    const button = screen.getByText('Retry')
    fireEvent.click(button)
    expect(mockSchema.schema.buttons.handleClick).toHaveBeenCalled()
  })

  it('should render the contact support text', () => {
    render(<ErrorFallback schema={mockSchema.schema} />)
    const contactSupport = screen.getByText('Contact Support')
    expect(contactSupport).toBeInTheDocument()
  })

  it('should call contactSupportProps.handleClick when contact support is clicked', () => {
    render(<ErrorFallback schema={mockSchema.schema} />)
    const contactSupport = screen.getByText('Contact Support')
    fireEvent.click(contactSupport)
    expect(mockSchema.schema.contactSupportProps?.handleClick).toHaveBeenCalled()
  })

  it('should not render the logo if logo is not provided', () => {
    const schemaWithoutLogo = { ...mockSchema.schema, logo: undefined }
    render(<ErrorFallback schema={schemaWithoutLogo} />)
    const logo = screen.queryByAltText('Logo Alt')
    expect(logo).not.toBeInTheDocument()
  })
})
