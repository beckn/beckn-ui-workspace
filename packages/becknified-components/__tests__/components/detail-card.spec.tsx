import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import DetailCard, { DetailsCardProps } from '../../src/components/detail-card/detail-card'

const renderDetailCardComponent = (props: DetailsCardProps) => {
  return render(<DetailCard {...props} />)
}

describe('DetailCard Component', () => {
  const defaultProps: DetailsCardProps = {
    children: <>Test Content</>,
    className: 'test-class',
    isDisabled: false
  }

  it('renders the component with default props', () => {
    renderDetailCardComponent({ ...defaultProps })

    expect(screen.getByText('Test Content')).toBeInTheDocument()

    const cardBody = screen.getByText('Test Content').closest('.card_body')
    expect(cardBody).toHaveClass('test-class card_body')
  })

  it('applies the correct styles and attributes when isDisabled is true', () => {
    const renderer = renderDetailCardComponent({ ...defaultProps, isDisabled: true })

    const card = renderer.baseElement.querySelector('.card_container')
    expect(card).toHaveStyle('opacity: 0.5')
    expect(card).toHaveStyle('pointer-events: none')
  })

  it('applies the correct styles and attributes when isDisabled is false', () => {
    const renderer = renderDetailCardComponent({ ...defaultProps, isDisabled: false })

    const card = renderer.baseElement.querySelector('.card_container')
    expect(card).toHaveStyle('opacity: unset')
    expect(card).toHaveStyle('pointer-events: auto')
  })

  it('renders the component without className', () => {
    const renderer = renderDetailCardComponent({ ...defaultProps, className: undefined })

    expect(screen.getByText('Test Content')).toBeInTheDocument()

    const card = renderer.baseElement.querySelector('.card_container')
    expect(card).toHaveClass('card_container')

    const cardBody = screen.getByText('Test Content').closest('.card_body')
    expect(cardBody).toHaveClass('card_body')
  })
})
