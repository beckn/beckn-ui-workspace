import React from 'react'
import { render } from '@testing-library/react'
import { ProductDescriptionPropModel } from '../../src/components/prouct-description/product-description.types'
import useResponsive from '../../src/hooks/useResponsive'
import ProductDescription from '../../src/components/prouct-description'

jest.mock('../../src/hooks/useResponsive')

describe('ProductDescription Component', () => {
  const baseProps: ProductDescriptionPropModel = {
    description: '<p>This is a product description.</p>',
    className: 'test-class'
  }

  it('renders the description correctly', () => {
    ;(useResponsive as jest.Mock).mockReturnValue({ isMobile: false, isTablet: false })

    const { container } = render(<ProductDescription {...baseProps} />)

    expect(container.querySelector('.test-class-product-description-container')).toBeInTheDocument()
    expect(container.querySelector('.test-class-product-description-container')?.innerHTML).toContain(
      baseProps.description
    )
  })

  it('applies correct styles for small screens', () => {
    ;(useResponsive as jest.Mock).mockReturnValue({ isMobile: true, isTablet: false })

    const { container } = render(<ProductDescription {...baseProps} />)

    const descriptionBox = container.querySelector('.test-class-product-description-container > div')
    expect(descriptionBox).toHaveStyle('padding: 5px 20px')
    expect(descriptionBox).toHaveStyle('border: 1px solid #e2e8f0')
    expect(descriptionBox).toHaveStyle('overflow-y: auto')
  })

  it('applies correct styles for larger screens', () => {
    ;(useResponsive as jest.Mock).mockReturnValue({ isMobile: false, isTablet: false })

    const { container } = render(<ProductDescription {...baseProps} />)

    const descriptionBox = container.querySelector('.test-class-product-description-container > div')
    expect(descriptionBox).toHaveStyle('padding: 5px 0')
    expect(descriptionBox).not.toHaveStyle('border: 1px solid #e2e8f0')
    expect(descriptionBox).toHaveStyle('overflow-y: hidden')
  })

  it('applies correct styles for tablet screens', () => {
    ;(useResponsive as jest.Mock).mockReturnValue({ isMobile: false, isTablet: true })

    const { container } = render(<ProductDescription {...baseProps} />)

    const descriptionBox = container.querySelector('.test-class-product-description-container > div')
    expect(descriptionBox).toHaveStyle('padding: 5px 20px')
    expect(descriptionBox).toHaveStyle('border: 1px solid #e2e8f0')
    expect(descriptionBox).toHaveStyle('overflow-y: auto')
  })
})
