import React from 'react'
import { useRouter } from 'next/router'
import { useLanguage } from '../hooks/useLanguage'
import { Image, Flex, Box } from '@chakra-ui/react'
import { Button, Typography } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

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
        data-test={testIds.Mobility_cancle_ride_image}
      />
      <Typography
        text={'Ride Cancelled!'}
        fontSize="17px"
        fontWeight="600"
        style={{ marginBottom: '12px' }}
        dataTest={testIds.Mobility_cancle_ride_Cancelled_text}
      />
      <Typography
        text={'Your Ride has been cancelled,'}
        fontSize="15px"
        dataTest={testIds.Mobility_Your_Ride_has_been_cancelled_text}
      />
      <Typography
        text={'If you have paid already, it will get '}
        fontSize="15px"
        dataTest={testIds.Mobility_paid_already_text}
      />
      <Typography
        text={'refunded soon'}
        fontSize="15px"
        dataTest={testIds.Mobility_refunded_soon_text}
      />
      <Box
        mt={'80px'}
        w="100%"
      >
        <Button
          text="Go Back Home"
          dataTest={testIds.Mobility_Go_Back_Home}
          handleClick={() => router.push('/')}
          variant="solid"
        />
      </Box>
    </Flex>
  )
}

export default cancelRidePage
