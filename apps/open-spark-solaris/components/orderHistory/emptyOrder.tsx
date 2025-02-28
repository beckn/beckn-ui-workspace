import React from 'react'
import { Text, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import orderHistoreyPageIcon from '../../public/images/orderHistory-1.svg'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { testIds } from '@shared/dataTestIds'

const EmptyOrder = () => {
  const { t } = useLanguage()
  const router = useRouter()
  return (
    <Flex
      pt={'29px'}
      direction={'column'}
      align={'center'}
      gap={'6px'}
    >
      <Flex
        direction={'column'}
        mb={'20px'}
        gap={'6px'}
      >
        <Image
          src={orderHistoreyPageIcon}
          data-test={testIds.empty_order_image}
        />

        <Text
          as={Typography}
          text={'Nothing to show right now!'}
          fontWeight="600"
          fontSize={'15px'}
          align={'center'}
          dataTest={testIds.emptyOrderHistoryText}
        />
      </Flex>

      <BecknButton
        text="Go back home"
        dataTest={testIds.emptyOrder_button}
        children=""
        handleClick={() => router.push('/')}
      />
    </Flex>
  )
}

export default EmptyOrder
