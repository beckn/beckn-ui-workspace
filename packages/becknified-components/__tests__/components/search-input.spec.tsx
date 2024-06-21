import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { SearchInputPropsModel } from '../../src/components/search-input/search-input.types'
import SearchInput from '../../src/components/search-input'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)
}

describe('SearchInput Component', () => {
  const baseProps: SearchInputPropsModel = {
    onChangeHandler: jest.fn(),
    searchIcon: 'https://example.com/search-icon.png',
    searchIconClickHandler: jest.fn(),
    className: 'custom',
    name: 'search_input',
    placeHolder: 'Search for items',
    onEnterHandler: jest.fn()
  }

  it('renders correctly with default props', () => {
    renderWithChakra(<SearchInput {...baseProps} />)

    // Check if the input field is rendered with correct placeholder
    const input = screen.getByPlaceholderText('Search for items')
    expect(input).toBeInTheDocument()

    // Check if the search icon is rendered with correct src and alt attributes
    const searchIcon = screen.getByAltText('search_icon')
    expect(searchIcon).toBeInTheDocument()
    expect(searchIcon).toHaveAttribute('src', 'https://example.com/search-icon.png')
  })

  it('calls onChangeHandler when input value changes', () => {
    renderWithChakra(<SearchInput {...baseProps} />)

    const input = screen.getByPlaceholderText('Search for items')
    fireEvent.change(input, { target: { value: 'test' } })

    // Check if onChangeHandler is called with the correct input value
    expect(baseProps.onChangeHandler).toHaveBeenCalledTimes(1)
    expect(baseProps.onChangeHandler).toHaveBeenCalledWith(expect.any(Object)) // You can refine this assertion based on your implementation
  })

  it('calls onEnterHandler when Enter key is pressed', () => {
    renderWithChakra(<SearchInput {...baseProps} />)

    const input = screen.getByPlaceholderText('Search for items')
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })

    expect(baseProps.onEnterHandler).toHaveBeenCalledTimes(1)
  })

  it('calls searchIconClickHandler when search icon is clicked', () => {
    renderWithChakra(<SearchInput {...baseProps} />)

    const searchIcon = screen.getByAltText('search_icon')
    fireEvent.click(searchIcon)

    expect(baseProps.searchIconClickHandler).toHaveBeenCalledTimes(1)
  })

  it('renders with custom class name correctly', () => {
    renderWithChakra(<SearchInput {...baseProps} />)

    const container = screen.getByTestId('test-search-input')
    expect(container).toHaveClass('custom-search-input')
  })
})
