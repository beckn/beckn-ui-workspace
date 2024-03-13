import { Box, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'

export interface StarRatingProps {
  rating: number
  setRating: (rating: number) => void
  count?: number
  size?: number
  transition: string
  ratingText: string
}

const StarRating: React.FC<StarRatingProps> = props => {
  const [hover, setHover] = useState<number | null>(null)

  return (
    <Box mb="20px">
      <Text pb={'5px'}>{props.ratingText}</Text>
      <Box display={'flex'}>
        {[...Array(props.count || 5)].map((star, index) => {
          const ratingValue = index + 1
          return (
            <label
              key={index}
              style={{
                color: ratingValue <= (hover || props.rating) ? '#ffc107' : '#e4e5e9'
              }}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            >
              <input
                type="radio"
                name="rating"
                onChange={() => props.setRating(ratingValue)}
                value={ratingValue}
                style={{ display: 'none' }}
              />
              <FaStar
                cursor="pointer"
                size={props.size || 20}
                //  transition="color 200ms"
              />
            </label>
          )
        })}
      </Box>
    </Box>
  )
}
export default StarRating
