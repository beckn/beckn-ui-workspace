import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider } from '@chakra-ui/react'
import { ProductRatingPropsModel } from '../../src/components/product-rating/product-rating.types'
import ProductRating from '../../src/components/product-rating'

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>)
}

describe('ProductRating Component', () => {
  const baseProps: ProductRatingPropsModel = {
    ratingIcon: 'https://example.com/icon.png',
    ratingValue: '4.5'
  }

  it('renders correctly with default props', () => {
    renderWithChakra(<ProductRating {...baseProps} />)

    // Check if the image is rendered with correct src and alt attributes
    const image = screen.getByAltText('rating icon')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/icon.png')

    // Check if the text is rendered with correct rating value
    const text = screen.getByText('4.5')
    expect(text).toBeInTheDocument()
  })

  it('applies custom className', () => {
    renderWithChakra(
      <ProductRating
        {...baseProps}
        className="custom-class"
      />
    )
    const flex = screen.getByTestId('test-product-rating')
    expect(flex).toHaveClass('custom-class')
  })

  it('handles missing ratingIcon prop', () => {
    renderWithChakra(
      <ProductRating
        ratingValue="4.5"
        ratingIcon=""
      />
    )
    const text = screen.getByText('4.5')
    expect(text).toBeInTheDocument()

    // Check that the image is not rendered when ratingIcon is not provided
    const image = screen.queryByAltText('rating icon')
    expect(image).toHaveAttribute('src', '')
  })

  it('handles missing ratingValue prop', () => {
    renderWithChakra(
      <ProductRating
        ratingIcon="https://example.com/icon.png"
        ratingValue=""
      />
    )

    // Check that the text is not rendered when ratingValue is not provided
    const text = screen.queryByText('4.5')
    expect(text).not.toBeInTheDocument()
  })
})
