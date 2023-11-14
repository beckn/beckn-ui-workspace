import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Button from '../../src/components/button' // Assuming Button component is in a separate file

// A mock function for the handleClick prop
const mockHandleClick = jest.fn()

describe('Button Component', () => {
  it('renders the button with the provided className and children', () => {
    const { getByText, container } = render(
      <Button
        handleClick={mockHandleClick}
        className="custom-class"
      >
        Click me
      </Button>
    )

    // Check if the button has the correct text content
    expect(getByText('Click me')).toBeInTheDocument()

    // Check if the button has the specified className
    expect(container.querySelector('.custom-class')).toBeInTheDocument()
  })

  it('calls the handleClick function when clicked', () => {
    const { getByText } = render(<Button handleClick={mockHandleClick}>Click me</Button>)

    // Simulate a button click
    fireEvent.click(getByText('Click me'))

    // Check if the handleClick function was called
    expect(mockHandleClick).toHaveBeenCalled()
  })
})
