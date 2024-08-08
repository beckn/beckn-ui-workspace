import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { Image, Flex, Box } from '@chakra-ui/react'
import { Button, Typography } from '@beckn-ui/molecules'

const cancelRidePage = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <Flex
      flexDirection={'column'}
      alignItems="center"
      mt={'110px'}
      p="0 20px"
    >
      <Image
        src="/images/orderConfirm.svg"
        alt="cancelIcon"
        mb={'20px'}
      />
      <Typography
        text={'Ride Cancelled!'}
        fontSize="17px"
        fontWeight="600"
        style={{ marginBottom: '12px' }}
      />
      <Typography
        text={'Your Ride has been cancelled,'}
        fontSize="15px"
      />
      <Typography
        text={'If you have paid already, it will get '}
        fontSize="15px"
      />
      <Typography
        text={'refunded soon'}
        fontSize="15px"
      />
      <Box
        mt={'80px'}
        w="100%"
      >
        <Button
          text="Go Back Home"
          handleClick={() => router.push('/')}
          variant="solid"
        />
      </Box>
    </Flex>
  )
}

export default cancelRidePage
