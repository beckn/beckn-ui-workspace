import { Box, Button, Image, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import React from 'react'

interface ImageProps {
  src: string
  text: string
}

interface CarouselProps {
  images: ImageProps[]
  width?: string
  height?: string
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [images.length])
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <Box
      position="relative"
      mx="auto"
      overflow="hidden"
      minW={'375px'}
      minH={'220px'}
    >
      {images.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', width: '100%', height: '100%' }}
        >
          <Image
            src={image.src}
            alt={image.text}
            objectFit="cover"
            width={'100%'}
            height={'100%'}
          />
        </motion.div>
      ))}

      <Flex
        justify="center"
        position="absolute"
        bottom="10px"
        width="100%"
      >
        {images.map((_, index) => (
          <Button
            key={index}
            onClick={() => goToSlide(index)}
            bg={currentIndex === index ? 'white' : 'gray.500'}
            borderRadius={currentIndex === index ? '10px' : '50px'}
            width={currentIndex === index ? '32px' : '12px'}
            height={currentIndex === index ? '10px' : '12px'}
            bgColor={currentIndex === index ? '#A19D9D' : '#FFFFFF'}
            mx={1}
            p={0}
            minWidth="auto"
            _hover={{ bg: 'gray.300' }}
          />
        ))}
      </Flex>
    </Box>
  )
}

export default Carousel
