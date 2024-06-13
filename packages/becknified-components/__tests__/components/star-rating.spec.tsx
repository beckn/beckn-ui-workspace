import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { StarRatingProps } from '../../src/components/types'
import StarRating from '../../src/components/star-rating/star-rating'
import { ChakraProvider } from '@chakra-ui/react'

const theme = {
  colors: { primary: { '100': '#3182ce' }, secondary: { '100': '#3182ee' } }
}

const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider theme={theme}>{ui}</ChakraProvider>)
}

describe('StarRating Component', () => {
  const baseProps: StarRatingProps = {
    rating: 3.5,
    ratingText: 'User Rating',
    setRating: jest.fn(),
    size: 20,
    starCount: 5
  }

  it('renders correctly with default props', () => {
    renderWithChakra(<StarRating {...baseProps} />)

    const ratingText = screen.getByText('User Rating')
    expect(ratingText).toBeInTheDocument()

    const stars = screen.getAllByTestId('test-rating-radio')
    expect(stars.length).toBe(5)

    const filledStars = screen.getAllByTestId('test-rating-radio')

    expect(filledStars.length).toBe(5)
  })

  it('calls setRating when a star is clicked', () => {
    renderWithChakra(<StarRating {...baseProps} />)

    const fourthStar = screen.getAllByTestId('test-rating-radio')[3]
    fireEvent.click(fourthStar)

    expect(baseProps.setRating).toHaveBeenCalledTimes(1)
    expect(baseProps.setRating).toHaveBeenCalledWith(4)
  })

  it('changes star color on hover', () => {
    renderWithChakra(<StarRating {...baseProps} />)

    const secondStar = screen.getAllByTestId('test-rating-radio')[1].parentElement!
    fireEvent.mouseEnter(secondStar)

    expect(secondStar).toHaveStyle(`color: ${theme.colors.primary['100']}`)

    fireEvent.mouseLeave(secondStar)

    expect(secondStar).toHaveStyle('color: #3182ce')
  })
})
