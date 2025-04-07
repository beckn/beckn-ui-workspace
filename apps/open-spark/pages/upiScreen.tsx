import React, { useState } from 'react'
import { Box, Text, Grid, Button, Flex, Circle, Image, Divider } from '@chakra-ui/react'
import Router, { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { DiscoveryRootState } from '@beckn-ui/common'
import { currencyFormat } from '@utils/general'
import ClearIcon from '../public/images/clearIcon.svg'

const UpiScreen = () => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(''))
  const [currentIndex, setCurrentIndex] = useState(0)
  const router = useRouter()
  const payableAmount = useSelector((state: any) => state.selectedEmi.emiDetails[0]?.payableAmount)
  const providerName = useSelector((state: DiscoveryRootState) => state.discovery.selectedProduct.providerName)

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
      Router.push('/retailOrderConfirmation')
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="calc(100vh - 46px)"
      justifyContent="space-between"
      backgroundColor="#fff"
      marginTop={'-50px'}
    >
      {/* Top Section */}
      <Box>
        <Text
          fontSize={'17px'}
          cursor="pointer"
          onClick={() => router.back()}
        >
          Cancel
        </Text>
        <Divider
          ml="-20px"
          mb="10px"
          mt="10px"
          w={'calc(100% + 40px)'}
        />

        {/* Bank Details */}
        <Flex
          justify="space-between"
          align="center"
          mb="2px"
        >
          <Box>
            <Text
              fontSize="14px"
              fontWeight="500"
            >
              ICICI Bank
            </Text>
            <Text color="gray.500">XXXX3810</Text>
          </Box>
          <Image
            src="/images/Bitmap-2.svg"
            alt="UPI Logo"
            height="30px"
          />
        </Flex>
        <Box
          backgroundColor="#DEDEDE"
          ml="-20px"
          mr="-20px"
          padding={'2px 20px'}
        >
          <Flex justify="space-between">
            <Text
              color="#837D7D"
              fontSize={'14px'}
              fontWeight="700"
            >
              To:
            </Text>
            <Text
              fontSize={'14px'}
              fontWeight="700"
              color="#837D7D"
            >
              {providerName}
            </Text>
          </Flex>
          <Flex justify="space-between">
            <Text
              color="#837D7D"
              fontSize={'14px'}
              fontWeight="700"
            >
              Sending:
            </Text>
            <Text
              color="#837D7D"
              fontSize={'14px'}
              fontWeight="700"
            >
              {`₹ ${currencyFormat(payableAmount)}`}
            </Text>
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
              size="30px"
              border="2px solid"
              borderColor={digit ? '#4398E8' : 'gray.300'}
              bg={digit ? '#4398E8' : 'white'}
            />
          ))}
        </Flex>
      </Box>

      {/* Bottom Section - Keypad */}
      <Grid
        backgroundColor="#B6B6B6"
        templateColumns="repeat(3, 1fr)"
        gap={2}
        p={4}
        ml="-20px"
        mr="-20px"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button
            key={num}
            h="46px"
            variant="outline"
            backgroundColor="#fff"
            cursor={'pointer'}
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
          <Image
            src={ClearIcon}
            alt="Clear"
          />
        </Button>
        <Button
          textColor="black"
          backgroundColor="#fff"
          h="60px"
          cursor={'pointer'}
          variant="outline"
          onClick={() => handleNumberClick('0')}
        >
          0
        </Button>
        <Button
          h="60px"
          cursor={'pointer'}
          variant="outline"
          color={'#000000'}
          background="#fff "
          opacity={'1 !important'}
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
