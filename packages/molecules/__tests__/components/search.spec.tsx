import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Search from '../../src/components/search/search'
import { SearchProps } from '../../src/components/search/search.types'

const renderSearchComponent = (props: SearchProps) => {
  return render(<Search {...props} />)
}

describe('Search component', () => {
  test('renders the input correctly', () => {
    renderSearchComponent({ handleOnChange: jest.fn(), handlePressEnter: jest.fn(), handleOnSearchClick: jest.fn() })
    expect(screen.getByPlaceholderText('Search for courses')).toBeInTheDocument()
  })

  test('calls handleOnChange when the input value changes', () => {
    const handleOnChange = jest.fn()
    renderSearchComponent({ handleOnChange, handlePressEnter: jest.fn(), handleOnSearchClick: jest.fn() })
    fireEvent.change(screen.getByPlaceholderText('Search for courses'), { target: { value: 'test' } })
    expect(handleOnChange).toHaveBeenCalledWith('test')
  })

  test('calls handlePressEnter when Enter key is pressed', () => {
    const handlePressEnter = jest.fn()
    renderSearchComponent({ handleOnChange: jest.fn(), handlePressEnter, handleOnSearchClick: jest.fn() })
    fireEvent.keyDown(screen.getByPlaceholderText('Search for courses'), { key: 'Enter', code: 'Enter' })
    expect(handlePressEnter).toHaveBeenCalled()
  })

  test('calls handleOnSearchClick when search icon is clicked', () => {
    const handleOnSearchClick = jest.fn()
    renderSearchComponent({ handleOnChange: jest.fn(), handlePressEnter: jest.fn(), handleOnSearchClick })
    waitFor(
      () => {
        fireEvent.click(screen.getByRole('search-button'))
        expect(handleOnSearchClick).toHaveBeenCalled()
      },
      { timeout: 1000 }
    )
  })

  test('applies the correct classes to input and button', () => {
    renderSearchComponent({ handleOnChange: jest.fn(), handlePressEnter: jest.fn(), handleOnSearchClick: jest.fn() })
    expect(screen.getByPlaceholderText('Search for courses')).toBeInTheDocument()
    waitFor(
      () => {
        expect(screen.getByRole('search-button')).toHaveClass('search_button')
      },
      { timeout: 1000 }
    )
  })

  test('renders the FaSearch icon inside the button', () => {
    renderSearchComponent({ handleOnChange: jest.fn(), handlePressEnter: jest.fn(), handleOnSearchClick: jest.fn() })
    expect(screen.getByRole('search-button').querySelector('svg')).toBeInTheDocument()
  })
})
