import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCardProps } from '../../src/components/product-card/product-card.types'
import ProductCard from '../../src/components/product-card'

jest.mock('../../src/components/product-price', () => ({
  __esModule: true,
  default: ({ price, currencyType }: { price: number; currencyType: string }) => (
    <div>{`Price: ${currencyType}${price}`}</div>
  )
}))

jest.mock('../../src/components/product-rating', () => ({
  __esModule: true,
  default: ({ ratingValue }: { ratingValue: string }) => <div>{`Rating: ${ratingValue}`}</div>
}))

const renderProductCardComponent = (props: ProductCardProps) => {
  return render(<ProductCard {...props} />)
}

describe('ProductCard', () => {
  const defaultProps: ProductCardProps = {
    product: {
      images: ['image1.jpg'],
      name: 'Product Name',
      source: 'Product Source',
      sourceText: 'Source Text',
      shortDesc: 'Short Description',
      price: '100',
      rating: '4.5',
      id: '11'
    },
    productInfoDataSource: {
      Color: 'Red',
      Size: 'L'
    },
    ComponentRenderer: null,
    productClickHandler: jest.fn(),
    dataSource: {},
    className: 'test-class',
    currency: 'INR'
  }

  it('should render the product card correctly', () => {
    renderProductCardComponent({ ...defaultProps })

    expect(screen.getByAltText('item_image')).toBeInTheDocument()
    expect(screen.getByText('Product Name')).toBeInTheDocument()
    expect(screen.getByText('Product Source :')).toBeInTheDocument()
    expect(screen.getByText('Source Text')).toBeInTheDocument()
    expect(screen.getByText('Short Description')).toBeInTheDocument()
    expect(screen.getByText('Price: INR100')).toBeInTheDocument()
    expect(screen.getByText('Rating: 4.5')).toBeInTheDocument()
  })

  it('should call productClickHandler on click', () => {
    const { container } = renderProductCardComponent({ ...defaultProps })

    const productCard = container.querySelector('.test-class-product_card_layout_container')
    fireEvent.click(productCard!)

    expect(defaultProps.productClickHandler).toHaveBeenCalledTimes(1)
  })

  it('should render custom component when ComponentRenderer is provided', () => {
    const CustomComponent = ({ dataSource }: { dataSource: any }) => (
      <div>{`Custom Component - ${dataSource.custom}`}</div>
    )
    const props: ProductCardProps = {
      ...defaultProps,
      ComponentRenderer: CustomComponent,
      dataSource: { custom: 'Custom Data' }
    }

    renderProductCardComponent({ ...props })

    expect(screen.getByText('Custom Component - Custom Data')).toBeInTheDocument()
  })

  it('should render product info data source correctly', () => {
    renderProductCardComponent({ ...defaultProps })

    expect(screen.getByText('Color:')).toBeInTheDocument()
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Size:')).toBeInTheDocument()
    expect(screen.getByText('L')).toBeInTheDocument()
  })

  it('should handle missing optional fields gracefully', () => {
    const props: ProductCardProps = {
      ...defaultProps,
      product: {
        ...defaultProps.product!,
        source: '',
        sourceText: '',
        rating: ''
      }
    }

    renderProductCardComponent({ ...props })

    expect(screen.queryByText('Product Source :')).not.toBeInTheDocument()
    expect(screen.queryByText('Source Text')).not.toBeInTheDocument()
    expect(screen.queryByText('Rating:')).not.toBeInTheDocument()
  })
})
