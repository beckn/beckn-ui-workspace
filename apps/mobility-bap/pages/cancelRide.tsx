import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { Image, Flex, Box } from '@chakra-ui/react'
import { Button, Typography } from '@beckn-ui/molecules'

const cancelRide = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <Flex
      flexDirection={'column'}
      alignItems="center"
      mt={'30px'}
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
      <Box mt={'60px'}>
        <Button
          text="Go Back Home"
          handleClick={() => router.push('/')}
          variant="solid"
        />
        <Button
          text="Book Another Ride"
          handleClick={() => router.push('/')}
          variant="outline"
        />
      </Box>
    </Flex>
  )
}

export default cancelRide
