import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Product, ProductListProps } from '../../src/components/types'
import ProductList from '../../src/components/product-list'

// Mock components
jest.mock('../../src/components/sort', () => (props: any) => (
  <div data-testid="sort-component">
    <button
      data-testid="sort-all"
      id="all"
      onClick={props.onChangeSelectedBtn}
    >
      All
    </button>
    <button
      data-testid="sort-expensive"
      id="expensive"
      onClick={props.onChangeSelectedBtn}
    >
      Expensive
    </button>
    <button
      data-testid="sort-cheapest"
      id="cheapest"
      onClick={props.onChangeSelectedBtn}
    >
      Cheapest
    </button>
  </div>
))

jest.mock('../../src/components/product-card', () => (props: any) => (
  <div data-testid="product-card">{props.product.name}</div>
))

// Mock data
const productList: Product[] = [
  { id: '1', name: 'Product 1', price: '100', images: [] },
  { id: '2', name: 'Product 2', price: '200', images: [] },
  { id: '3', name: 'Product 3', price: '150', images: [] }
]

const mockProps: ProductListProps = {
  productList: productList,
  productClickHandler: jest.fn(),
  CustomInfoComponentForProductCard: jest.fn(),
  productInfoDataSource: jest.fn()
}

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderProductListComponent = (props: ProductListProps) => {
  return render(
    <ChakraProvider theme={theme}>
      <ProductList {...props} />
    </ChakraProvider>
  )
}

describe('ProductList Component', () => {
  it('renders correctly with product list', () => {
    renderProductListComponent({ ...mockProps })

    expect(screen.getByTestId('sort-component')).toBeInTheDocument()
    expect(screen.getAllByTestId('product-card')).toHaveLength(productList.length)
  })

  it('renders "No Data found" when productList is empty', () => {
    renderProductListComponent({ ...mockProps, productList: [] })

    expect(screen.getByText('No Data found')).toBeInTheDocument()
  })

  it('sorts products by "Expensive" when the respective button is clicked', () => {
    renderProductListComponent({ ...mockProps })

    fireEvent.click(screen.getByTestId('sort-expensive'))

    const renderedProducts = screen.getAllByTestId('product-card')
    expect(renderedProducts[0]).toHaveTextContent('Product 2')
    expect(renderedProducts[1]).toHaveTextContent('Product 3')
    expect(renderedProducts[2]).toHaveTextContent('Product 1')
  })

  it('sorts products by "Cheapest" when the respective button is clicked', () => {
    renderProductListComponent({ ...mockProps })

    fireEvent.click(screen.getByTestId('sort-cheapest'))

    const renderedProducts = screen.getAllByTestId('product-card')
    expect(renderedProducts[0]).toHaveTextContent('Product 1')
    expect(renderedProducts[1]).toHaveTextContent('Product 3')
    expect(renderedProducts[2]).toHaveTextContent('Product 2')
  })

  it('displays all products when "All" sort button is clicked', () => {
    renderProductListComponent({ ...mockProps })

    fireEvent.click(screen.getByTestId('sort-all'))

    const renderedProducts = screen.getAllByTestId('product-card')
    expect(renderedProducts[0]).toHaveTextContent('Product 1')
    expect(renderedProducts[1]).toHaveTextContent('Product 2')
    expect(renderedProducts[2]).toHaveTextContent('Product 3')
  })
})
