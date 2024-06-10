import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TypographyProps } from '../../src/components/types'
import { Typography } from '../../src/components'

const renderTypographyComponent = (props: TypographyProps) => {
  return render(<Typography {...props} />)
}

describe('Typography component', () => {
  test('renders the text correctly', () => {
    renderTypographyComponent({ text: 'Hello World' })
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })

  test('applies the className correctly', () => {
    renderTypographyComponent({ text: 'Hello World', className: 'test-class' })
    expect(screen.getByText('Hello World')).toHaveClass('test-class')
  })

  test('applies the color correctly', () => {
    renderTypographyComponent({ text: 'Hello World', color: 'blue.500' })
    const element = screen.getByText('Hello World')
    expect(element).toHaveStyle('color: blue.500')
  })

  test('applies the fontFamily correctly', () => {
    renderTypographyComponent({ text: 'Hello World', fontFamily: 'Arial' })
    const element = screen.getByText('Hello World')
    expect(element).toHaveStyle('font-family: Arial')
  })

  test('applies the fontSize correctly', () => {
    renderTypographyComponent({ text: 'Hello World', fontSize: '20px' })
    const element = screen.getByText('Hello World')
    expect(element).toHaveStyle('font-size: 20px')
  })

  test('applies the fontWeight correctly', () => {
    renderTypographyComponent({ text: 'Hello World', fontWeight: 'bold' })
    const element = screen.getByText('Hello World')
    expect(element).toHaveStyle('font-weight: bold')
  })

  test('applies the fontStyle correctly', () => {
    renderTypographyComponent({ text: 'Hello World', fontStyle: 'italic' })
    const element = screen.getByText('Hello World')
    expect(element).toHaveStyle('font-style: italic')
  })

  test('applies the style correctly', () => {
    const style = { margin: '10px' }
    renderTypographyComponent({ text: 'Hello World', style })
    const element = screen.getByText('Hello World')
    expect(element).toHaveStyle('margin: 10px')
  })

  test('calls the onClick handler when clicked', () => {
    const handleClick = jest.fn()
    renderTypographyComponent({ text: 'Hello World', onClick: handleClick })
    fireEvent.click(screen.getByText('Hello World'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
