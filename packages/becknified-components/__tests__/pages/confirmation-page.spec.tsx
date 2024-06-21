import React from 'react'
import { render, screen } from '@testing-library/react'
import ConfirmationPage from '../../src/pages/confirmation-page'
import { ConfirmationPageProps } from '../../src/pages/types'

// Mock the custom hooks and components
jest.mock('@beckn-ui/molecules', () => ({
  Button: jest.fn(({ children, text }) => <button>{text}</button>),
  Typography: jest.fn(({ text }) => <p>{text}</p>),
  Loader: jest.fn(() => <div>Loading...</div>)
}))

const renderConfirmationPageComponent = (props: ConfirmationPageProps) => {
  render(<ConfirmationPage {...props} />)
}

describe('ConfirmationPage Component', () => {
  const defaultProps = {
    schema: {
      iconSrc: 'test-icon.png',
      successOrderMessage: 'Order placed successfully!',
      gratefulMessage: 'Thank you for your order!',
      orderIdMessage: 'Order ID: 123456',
      trackOrderMessage: 'Track your order here.',
      buttons: [{ text: 'Go to Orders' }, { text: 'Continue Shopping' }]
    },
    className: 'test-class'
  }

  it('should render the icon image', () => {
    renderConfirmationPageComponent({ ...defaultProps })
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test-icon.png')
  })

  it('should render the success order message', () => {
    renderConfirmationPageComponent({ ...defaultProps })
    expect(screen.getByText('Order placed successfully!')).toBeInTheDocument()
  })

  it('should render the grateful message', () => {
    renderConfirmationPageComponent({ ...defaultProps })
    expect(screen.getByText('Thank you for your order!')).toBeInTheDocument()
  })

  it('should render the order ID message if provided', () => {
    renderConfirmationPageComponent({ ...defaultProps })
    expect(screen.getByText('Order ID: 123456')).toBeInTheDocument()
  })

  it('should render the track order message if provided', () => {
    renderConfirmationPageComponent({ ...defaultProps })
    expect(screen.getByText('Track your order here.')).toBeInTheDocument()
  })

  it('should render the buttons', () => {
    renderConfirmationPageComponent({ ...defaultProps })

    expect(screen.getByText('Go to Orders')).toBeInTheDocument()
    expect(screen.getByText('Continue Shopping')).toBeInTheDocument()
  })

  it('should not render order ID message if not provided', () => {
    const propsWithoutOrderId = {
      ...defaultProps,
      schema: {
        ...defaultProps.schema,
        orderIdMessage: ''
      }
    }
    renderConfirmationPageComponent({ ...propsWithoutOrderId })
    expect(screen.queryByText('Order ID: 123456')).not.toBeInTheDocument()
  })

  it('should not render track order message if not provided', () => {
    const propsWithoutTrackOrder = {
      ...defaultProps,
      schema: {
        ...defaultProps.schema,
        trackOrderMessage: ''
      }
    }
    renderConfirmationPageComponent({ ...propsWithoutTrackOrder })
    expect(screen.queryByText('Track your order here.')).not.toBeInTheDocument()
  })

  it('should not render buttons if none are provided', () => {
    const propsWithoutButtons = {
      ...defaultProps,
      schema: {
        ...defaultProps.schema,
        buttons: []
      }
    }
    renderConfirmationPageComponent({ ...propsWithoutButtons })
    expect(screen.queryByText('Go to Orders')).not.toBeInTheDocument()
    expect(screen.queryByText('Continue Shopping')).not.toBeInTheDocument()
  })
})
