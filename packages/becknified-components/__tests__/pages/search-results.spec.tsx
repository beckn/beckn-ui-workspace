import React from 'react'
import { render, screen } from '@testing-library/react'
import { SearchResultsProps } from '../../src/pages/search-results/search-results.types'
import SearchResults from '../../src/pages/search-results'

// Mock the components imported in SearchResults
jest.mock('../../src/components/product-list', () => ({
  __esModule: true,
  default: jest.fn(() => <div>ProductList</div>)
}))

jest.mock('@beckn-ui/molecules', () => ({
  Loader: jest.fn(() => <div>Loading...</div>)
}))

const renderProductDetailPageComponent = (props: SearchResultsProps) => {
  render(<SearchResults {...props} />)
}

describe('SearchResults component', () => {
  const mockProps: SearchResultsProps = {
    schema: {
      productList: [
        { id: '1', name: 'Product 1', images: [], price: '10' },
        { id: '2', name: 'Product 2', images: [], price: '20' }
      ],
      productCard: {
        productCardRenderer: jest.fn(),
        productClickHandler: jest.fn(),
        productInfoDataSource: jest.fn()
      },
      loader: { color: 'blue' }
    },
    isLoading: false
  }

  it('renders ProductList with correct props when not loading', () => {
    renderProductDetailPageComponent({ ...mockProps })
    expect(screen.getByText('ProductList')).toBeInTheDocument()
    expect(screen.queryByText('Loading...')).toBeNull()
  })

  it('renders Loader when isLoading is true', () => {
    const propsWithLoading = { ...mockProps, isLoading: true }
    renderProductDetailPageComponent({ ...propsWithLoading })
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('ProductList')).toBeNull()
  })

  it('passes correct props to ProductList when not loading', () => {
    renderProductDetailPageComponent({ ...mockProps })
    const productListComponent = require('../../src/components/product-list').default
    expect(productListComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        CustomInfoComponentForProductCard: mockProps.schema.productCard.productCardRenderer,
        productClickHandler: mockProps.schema.productCard.productClickHandler,
        productInfoDataSource: mockProps.schema.productCard.productInfoDataSource,
        productList: mockProps.schema.productList
      }),
      {}
    )
  })

  it('renders correctly without productCard', () => {
    const propsWithoutProductCard: SearchResultsProps = {
      ...mockProps,
      schema: { ...mockProps.schema }
    }
    renderProductDetailPageComponent({ ...propsWithoutProductCard })
    expect(screen.getByText('ProductList')).toBeInTheDocument()
  })

  it('renders correctly without productList', () => {
    const propsWithoutProductList = {
      ...mockProps,
      schema: { ...mockProps.schema, productList: [] }
    }
    renderProductDetailPageComponent({ ...propsWithoutProductList })
    expect(screen.getByText('ProductList')).toBeInTheDocument()
  })
})
