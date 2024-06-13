import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { SearchInputOnSearchResultsPageProps } from '../../src/components/searchInputOnSearchResultsPage/SearchInputOnSearchResultsPage.types'
import SearchInputOnSearchResultsPage from '../../src/components/searchInputOnSearchResultsPage'

describe('SearchInputOnSearchResultsPage Component', () => {
  const baseProps: SearchInputOnSearchResultsPageProps = {
    handleSubmit: jest.fn(),
    searchText: '',
    setSearchText: jest.fn()
  }

  it('renders correctly with default props', () => {
    render(<SearchInputOnSearchResultsPage {...baseProps} />)

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement
    expect(input).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('calls setSearchText when input value changes', () => {
    render(<SearchInputOnSearchResultsPage {...baseProps} />)

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })

    expect(baseProps.setSearchText).toHaveBeenCalledTimes(1)
    expect(baseProps.setSearchText).toHaveBeenCalledWith('test')
  })

  it('calls handleSubmit when Enter key is pressed', () => {
    render(<SearchInputOnSearchResultsPage {...baseProps} />)

    const input = screen.getByPlaceholderText('Search') as HTMLInputElement
    fireEvent.keyDown(input, { key: 'Enter', keyCode: 13 })

    expect(baseProps.handleSubmit).toHaveBeenCalledTimes(1)
  })
})
