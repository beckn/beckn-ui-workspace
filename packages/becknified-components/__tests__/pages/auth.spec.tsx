import React from 'react'
import { render, screen } from '@testing-library/react'
import Auth from '../../src/pages/auth'
import { AuthProps } from '../../src/lib/types'

jest.mock('@beckn-ui/molecules', () => ({
  Button: jest.fn(({ children, text }) => <button>{text}</button>),
  Input: jest.fn(({ placeholder }) => <input placeholder={placeholder} />),
  Loader: jest.fn(() => <div>Loading...</div>)
}))

jest.mock('../../src/pages/auth/authDivider.tsx', () => jest.fn(() => <div>Divider</div>))

const renderAuthComponent = (props: AuthProps) => {
  return render(<Auth {...props} />)
}

describe('Auth Component', () => {
  const defaultProps: AuthProps = {
    schema: {
      logo: { src: 'logo.png', alt: 'logo alt text' },
      inputs: [
        { name: 'input_1', type: 'text', value: '', placeholder: 'input 1', handleChange: () => {} },
        { name: 'input_2', type: 'text', value: '', placeholder: 'input 2', handleChange: () => {} }
      ],
      buttons: [
        { text: 'button_1', handleClick: () => {}, disabled: false, variant: 'solid', colorScheme: 'primary' },
        { text: 'button_2', handleClick: () => {}, disabled: false, variant: 'solid', colorScheme: 'primary' }
      ],
      socialButtons: [{ text: 'social button 1' }, { text: 'social button 2' }],
      loader: {}
    },
    isLoading: false
  }

  it('should show loader when isLoading is true', () => {
    renderAuthComponent({ ...defaultProps, isLoading: true })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render logo when logo is provided', () => {
    render(<Auth {...defaultProps} />)
    expect(screen.getByAltText('logo alt text')).toBeInTheDocument()
  })

  it('should render input fields', () => {
    render(<Auth {...defaultProps} />)
    expect(screen.getByPlaceholderText('input 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('input 2')).toBeInTheDocument()
  })

  it('should render buttons', () => {
    render(<Auth {...defaultProps} />)

    expect(screen.getByText('button_1')).toBeInTheDocument()
    expect(screen.getByText('button_2')).toBeInTheDocument()
  })

  it('should render social buttons and divider when social buttons are provided', () => {
    render(<Auth {...defaultProps} />)

    expect(screen.getByText('Divider')).toBeInTheDocument()
    expect(screen.getByText('social button 1')).toBeInTheDocument()
    expect(screen.getByText('social button 2')).toBeInTheDocument()
  })

  it('should not render social buttons and divider when social buttons are not provided', () => {
    const propsWithoutSocialButtons = {
      ...defaultProps,
      schema: {
        ...defaultProps.schema,
        socialButtons: []
      }
    }
    render(<Auth {...propsWithoutSocialButtons} />)
    expect(screen.queryByText('Divider')).not.toBeInTheDocument()
    expect(screen.queryByText('social button 1')).not.toBeInTheDocument()
    expect(screen.queryByText('social button 2')).not.toBeInTheDocument()
  })
})
