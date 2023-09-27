import React from 'react'
import { Box, Image, Flex, Text } from '@chakra-ui/react'

interface ImageCardProps {
  image: string
  text: string
  onClick: () => void
  isActive: boolean
}

const ImageCard: React.FC<ImageCardProps> = ({ image, text, onClick, isActive }) => {
  return (
    <Box
      onClick={onClick}
      boxShadow="0px 10px 24px 0px rgba(0, 0, 0, 0.10)"
      width={'105px'}
      p="18px"
      bg={isActive ? 'rgba(var(--color-primary))' : 'transparent'}
      borderRadius="6px"
    >
      <Flex alignItems={'center'} flexDirection="column" fontSize={'15px'}>
        <Image src={image} alt="displayed image" width={35} height={35} pb="5px" />
        <Text fontSize={'15px'} className={`text-sm text-center ${isActive ? 'text-white' : 'text-black'}`}>
          {text}
        </Text>
      </Flex>
    </Box>
  )
}

export default ImageCard
