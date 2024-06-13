import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { SearchProps } from '../../src/components/search/search.types'
import Search from '../../src/components/search'

describe('Search Component', () => {
  const baseProps: SearchProps = {
    handleOnChange: jest.fn(),
    handlePressEnter: jest.fn(),
    handleOnSearchClick: jest.fn()
  }

  it('renders correctly with default props', () => {
    render(<Search {...baseProps} />)

    const input = screen.getByPlaceholderText('Search for courses')
    expect(input).toBeInTheDocument()

    const searchIcon = screen.getByTestId('test-button-search')
    expect(searchIcon).toBeInTheDocument()
  })

  it('calls handleOnChange when input value changes', () => {
    render(<Search {...baseProps} />)

    const input = screen.getByPlaceholderText('Search for courses')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(baseProps.handleOnChange).toHaveBeenCalledTimes(1)
    expect(baseProps.handleOnChange).toHaveBeenCalledWith('test')
  })

  it('calls handlePressEnter when Enter key is pressed', () => {
    render(<Search {...baseProps} />)

    const input = screen.getByPlaceholderText('Search for courses')
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })

    expect(baseProps.handlePressEnter).toHaveBeenCalledTimes(1)
  })

  it('calls handleOnSearchClick when search button is clicked', () => {
    render(<Search {...baseProps} />)

    const searchButton = screen.getByTestId('test-button-search')
    fireEvent.click(searchButton)

    expect(baseProps.handleOnSearchClick).toHaveBeenCalledTimes(1)
  })
})
