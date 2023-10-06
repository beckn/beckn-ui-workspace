import React from 'react'
import { Icon } from '@chakra-ui/react'
import { MdStarRate } from 'react-icons/md'

export const renderStarsBasedOnRating = (rating: number) => {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const starColor = i <= rating ? '#ffc107' : 'gray.300'
    stars.push(<Icon as={MdStarRate} key={i} color={starColor} />)
  }
  return stars
}
