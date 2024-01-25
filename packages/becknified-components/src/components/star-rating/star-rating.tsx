import { Typography } from '@beckn-ui/molecules'
import { Box, Input, Text, useTheme } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { StarRatingProps } from './star-rating.types'

/**
 * `StarRating` Component
 *
 * Displays a star-based rating system. It can be used to show a static rating or
 * to capture user input for a rating.
 *
 * The component relies on the Chakra UI for styling.
 *
 * @component
 * @example
 * <StarRating
 *   rating={3.5}
 *   ratingText="User Rating"
 *   setRating={handleRatingChange}
 *   size={25}
 *   starCount={5}
 * />
 */

const StarRating: React.FC<StarRatingProps> = props => {
  const { rating = 0, ratingText = '', setRating, size = 20, starCount = 5 } = props
  const [hover, setHover] = useState<number | null>(null)
  const theme = useTheme()

  const primaryColor = theme.colors.primary['100']

  return (
    <Box mb="20px">
      <Text
        as={Typography}
        fontSize={'15px'}
        fontWeight={400}
        text={ratingText}
      />

      <Box display={'flex'}>
        {[...Array(starCount)].map((star, index) => {
          const ratingValue = index + 1
          return (
            <label
              key={index}
              style={{
                color: ratingValue <= (hover || rating) ? primaryColor : '#e4e5e9'
              }}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            >
              <Input
                type="radio"
                name="rating"
                onChange={() => setRating(ratingValue)}
                value={ratingValue}
                style={{
                  display: 'none'
                }}
              />
              <FaStar
                cursor="pointer"
                size={size}
              />
            </label>
          )
        })}
      </Box>
    </Box>
  )
}
export default StarRating
