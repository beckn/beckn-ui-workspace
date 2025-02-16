import React, { useState } from 'react'
import { Box, Text, Grid, Button, Flex, Circle, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const UpiScreen = () => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(''))
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()

  const handleNumberClick = (num: string) => {
    if (currentIndex < 4) {
      const newPin = [...pin]
      newPin[currentIndex] = num
      setPin(newPin)
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleDelete = () => {
    if (currentIndex > 0) {
      const newPin = [...pin]
      newPin[currentIndex - 1] = ''
      setPin(newPin)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = () => {
    if (currentIndex === 4) {
      console.log('PIN submitted:', pin.join(''))
      // Handle PIN submission
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="90vh"
      justifyContent="space-between"
      backgroundColor="#fff"
    >
      {/* Top Section */}
      <Box p={4}>
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          mb={6}
        >
          <Text
            cursor="pointer"
            onClick={() => router.back()}
          >
            Cancel
          </Text>
          <Image
            src="/images/Bitmap-2.svg"
            alt="UPI Logo"
            height="30px"
          />
        </Flex>

        {/* Bank Details */}
        <Box mb={8}>
          <Text
            fontSize="16px"
            fontWeight="500"
          >
            ICICI Bank
          </Text>
          <Text color="gray.500">XXXX3810</Text>
        </Box>

        <Box
          backgroundColor="#DEDEDE"
          p={4}
        >
          <Flex
            justify="space-between"
            mb={2}
          >
            <Text color="gray.500">To:</Text>
            <Text>Marie</Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="gray.500">Sending:</Text>
            <Text>10,000</Text>
          </Flex>
        </Box>
      </Box>

      {/* Middle Section - PIN Input */}
      <Box p={4}>
        <Text
          textAlign="center"
          mb={4}
          fontSize="16px"
        >
          Enter 4 digit UPI PIN
        </Text>
        <Flex
          justify="center"
          gap={4}
        >
          {pin.map((digit, index) => (
            <Circle
              key={index}
              size="40px"
              border="2px solid"
              borderColor={digit ? '#4398E8' : 'gray.300'}
              bg={digit ? '#4398E8' : 'white'}
            />
          ))}
        </Flex>
      </Box>

      {/* Bottom Section - Keypad */}
      <Grid
        backgroundColor="#DEDEDE"
        templateColumns="repeat(3, 1fr)"
        gap={2}
        p={4}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button
            key={num}
            h="60px"
            variant="outline"
            backgroundColor="#fff"
            onClick={() => handleNumberClick(num.toString())}
          >
            <Box>
              <Text fontSize="20px">{num}</Text>
              <Text
                fontSize="10px"
                color="black"
              >
                {num === 2
                  ? 'ABC'
                  : num === 3
                    ? 'DEF'
                    : num === 4
                      ? 'GHI'
                      : num === 5
                        ? 'JKL'
                        : num === 6
                          ? 'MNO'
                          : num === 7
                            ? 'PQRS'
                            : num === 8
                              ? 'TUV'
                              : num === 9
                                ? 'WXYZ'
                                : ''}
              </Text>
            </Box>
          </Button>
        ))}
        <Button
          textColor="black"
          backgroundColor="#fff"
          h="60px"
          variant="outline"
          onClick={handleDelete}
        >
          ✕
        </Button>
        <Button
          textColor="black"
          backgroundColor="#fff"
          h="60px"
          variant="outline"
          onClick={() => handleNumberClick('0')}
        >
          0
        </Button>
        <Button
          h="60px"
          variant="outline"
          backgroundColor="#fff"
          onClick={handleSubmit}
          isDisabled={currentIndex !== 4}
        >
          SUBMIT
        </Button>
      </Grid>
    </Box>
  )
}

export default UpiScreen
