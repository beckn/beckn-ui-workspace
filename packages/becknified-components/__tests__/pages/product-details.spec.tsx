import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductDetailsPagePropsModel } from '../../src/pages/product-detail/product-detail.types'
import ProductDetailPage from '../../src/pages/product-detail/product-detail'

// Mock the components imported in ProductDetailPage
jest.mock('../../src/components', () => ({
  ProductDescription: jest.fn(({ description }) => <div>{description}</div>),
  ProductSummary: jest.fn(({ name }) => <div>{name}</div>)
}))

const renderProductDetailPageComponent = (props: ProductDetailsPagePropsModel) => {
  return render(<ProductDetailPage {...props} />)
}

describe('ProductDetailPage component', () => {
  const mockProps: ProductDetailsPagePropsModel = {
    schema: {
      buttons: [
        { text: 'Button 1', handleClick: jest.fn() },
        { text: 'Button 2', handleClick: jest.fn() }
      ],
      productDescription: { description: 'This is a product description' },
      productSummary: { name: 'product_summary', imageSrc: '' }
    }
  }

  it('renders ProductSummary with correct props', () => {
    renderProductDetailPageComponent({ ...mockProps })

    expect(screen.getByText('product_summary')).toBeInTheDocument()
  })

  it('renders ProductDescription when provided', () => {
    renderProductDetailPageComponent({ ...mockProps })

    expect(screen.getByText('This is a product description')).toBeInTheDocument()
  })

  it('does not render ProductDescription when not provided', () => {
    const propsWithoutDescription: ProductDetailsPagePropsModel = {
      ...mockProps,
      schema: {
        ...mockProps.schema,
        productDescription: { description: '' },
        productSummary: { name: '', imageSrc: '' }
      }
    }
    renderProductDetailPageComponent({ ...propsWithoutDescription })
    expect(screen.queryByText('This is a product description')).toBeNull()
  })

  it('renders the correct number of buttons', () => {
    renderProductDetailPageComponent({ ...mockProps })
    expect(screen.getByText('Button 1')).toBeInTheDocument()
    expect(screen.getByText('Button 2')).toBeInTheDocument()
  })

  it('calls handleClick when buttons are clicked', () => {
    renderProductDetailPageComponent({ ...mockProps })
    const button1 = screen.getByText('Button 1')
    const button2 = screen.getByText('Button 2')

    fireEvent.click(button1)
    fireEvent.click(button2)

    expect(mockProps.schema.buttons?.[0].handleClick).toHaveBeenCalled()
    expect(mockProps.schema.buttons?.[1].handleClick).toHaveBeenCalled()
  })

  it('renders correctly with no buttons', () => {
    const propsWithoutButtons = {
      ...mockProps,
      schema: {
        ...mockProps.schema,
        buttons: []
      }
    }
    renderProductDetailPageComponent({ ...propsWithoutButtons })
    expect(screen.queryByRole('button')).toBeNull()
  })
})
