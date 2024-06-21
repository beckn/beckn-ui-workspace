import React from 'react'
import { render, screen } from '@testing-library/react'
import DetailsCard from '../../../src/components/checkout/details-card'

describe('DetailsCard Component', () => {
  it('renders children correctly', () => {
    render(
      <DetailsCard>
        <div>Test Child</div>
      </DetailsCard>
    )
    expect(screen.getByText('Test Child')).toBeInTheDocument()
  })

  it('applies correct styles when isDisabled is true', () => {
    render(
      <DetailsCard isDisabled={true}>
        <div>Test Child</div>
      </DetailsCard>
    )
    const card = screen.getByText('Test Child').closest('.chakra-card')
    expect(card).toHaveStyle('opacity: 0.5')
    expect(card).toHaveStyle('pointer-events: none')
  })

  it('applies correct styles when isDisabled is false', () => {
    render(
      <DetailsCard isDisabled={false}>
        <div>Test Child</div>
      </DetailsCard>
    )
    const card = screen.getByText('Test Child').closest('.chakra-card')
    expect(card).not.toHaveStyle('opacity: 0.5')
    expect(card).not.toHaveStyle('pointer-events: none')
  })

  it('applies default styles when isDisabled is not provided', () => {
    render(
      <DetailsCard>
        <div>Test Child</div>
      </DetailsCard>
    )
    const card = screen.getByText('Test Child').closest('.chakra-card')
    expect(card).not.toHaveStyle('opacity: 0.5')
    expect(card).not.toHaveStyle('pointer-events: none')
  })
})
