import React from 'react'
import { render, screen } from '@testing-library/react'
import { ChakraProvider, useBreakpoint } from '@chakra-ui/react'
import { ProductSummaryPropsModel } from '../../src/components/product-summary/product-summary.types'
import ProductSummary from '../../src/components/product-summary'

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useBreakpoint: jest.fn()
}))

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)
}

describe('ProductSummary Component', () => {
  const baseProps: ProductSummaryPropsModel = {
    imageSrc: 'https://example.com/product.jpg',
    name: 'Product Name',
    itemForRenderer: {},
    className: 'custom',
    secondaryCTAs: [{ text: 'Secondary CTA', handleClick: jest.fn() }],
    secondaryDescription: 'This is a secondary description',
    starRating: { rating: 4, setRating: jest.fn(), starCount: 1 },
    productCta: {
      counterTitle: 'Primary CTA',
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
      counter: 0,
      cta: {},
      currency: 'USD',
      totalPrice: '100'
    }
  }

  it('renders correctly with default props', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    renderWithChakra(<ProductSummary {...baseProps} />)

    const image = screen.getByAltText('product_img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/product.jpg')

    const name = screen.getByText('Product Name')
    expect(name).toBeInTheDocument()

    const description = screen.getByText('This is a secondary description')
    expect(description).toBeInTheDocument()

    const secondaryCta = screen.getByText('Secondary CTA')
    expect(secondaryCta).toBeInTheDocument()

    const primaryCta = screen.getByText('Primary CTA')
    expect(primaryCta).toBeInTheDocument()
  })

  it('renders custom class name correctly', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    renderWithChakra(<ProductSummary {...baseProps} />)

    const container = screen.getByTestId('test-product-summary')
    expect(container).toHaveClass('custom-product_summary_container')
  })

  it('renders custom renderer when provided', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    const CustomRenderer = () => <div>Custom Renderer</div>
    renderWithChakra(
      <ProductSummary
        {...baseProps}
        ProductSummaryRenderer={CustomRenderer}
      />
    )

    // Check if the custom renderer is used
    expect(screen.getByText('Custom Renderer')).toBeInTheDocument()
  })

  it('renders without secondary description if not provided', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    const { secondaryDescription, ...propsWithoutDescription } = baseProps
    renderWithChakra(<ProductSummary {...propsWithoutDescription} />)

    expect(screen.queryByText('This is a secondary description')).not.toBeInTheDocument()
  })

  it('renders without secondary CTA if not provided', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    const { secondaryCTAs, ...propsWithoutCTAs } = baseProps
    renderWithChakra(<ProductSummary {...propsWithoutCTAs} />)

    expect(screen.queryByText('Secondary CTA')).not.toBeInTheDocument()
  })

  it('renders without primary CTA if not provided', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    const { productCta, ...propsWithoutProductCta } = baseProps
    renderWithChakra(<ProductSummary {...propsWithoutProductCta} />)

    expect(screen.queryByText('Primary CTA')).not.toBeInTheDocument()
  })

  it('renders without star rating if not provided', () => {
    ;(useBreakpoint as jest.Mock).mockReturnValue('lg')
    const { starRating, ...propsWithoutStarRating } = baseProps
    renderWithChakra(<ProductSummary {...propsWithoutStarRating} />)

    expect(screen.queryByRole('img', { name: /star/i })).not.toBeInTheDocument()
  })
})
