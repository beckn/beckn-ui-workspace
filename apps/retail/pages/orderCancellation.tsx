import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import React from 'react'

const orderCancellation = () => {
  const { t } = useLanguage()
  const router = useRouter()
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <Flex
        justifyContent={'center'}
        alignItems={'center'}
        mb={'20px'}
      >
        <Flex
          mt={'45px'}
          flexDir={'column'}
          textAlign={'center'}
        >
          <Image
            src="/images/cancleHomeImg.svg"
            mb={'35px'}
          />
          <Text
            as={Typography}
            text={t.orderCancel}
            fontSize={'17px'}
            fontWeight={600}
          />
          <Text
            as={Typography}
            text={t.yourOrderHasBeencancel}
            fontSize={'15px'}
            fontWeight={400}
          />
          <Text
            as={Typography}
            text={t.ifYouPaid}
            fontSize={'15px'}
            fontWeight={400}
          />
          <Text
            as={Typography}
            text={t.refundedSoon}
            fontSize={'15px'}
            fontWeight={400}
          />
        </Flex>
      </Flex>
      <Box>
        <BecknButton
          children="Go Back Home"
          className="checkout_btn "
          handleClick={() => router.push('/')}
        />
        <BecknButton
          children="View Details"
          variant="outline"
          className="checkout_btn"
          handleClick={() => router.push('/orderDetails')}
        />
      </Box>
    </Box>
  )
}

export default orderCancellation
