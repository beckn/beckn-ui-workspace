import React from 'react'
import { Text, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import orderHistoreyPageIcon from '../../public/images/orderHistoryPageIcon.svg'
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
          text={t.emptyOrderHistoryText}
          fontWeight="600"
          fontSize={'15px'}
          align={'center'}
          dataTest={testIds.emptyOrderHistoryText}
        />
        <Text
          as={Typography}
          text={t.noExistingWorkflowText}
          fontWeight="400"
          fontSize={'15px'}
          align={'center'}
          dataTest={testIds.noExistingWorkflowText}
        />
      </Flex>

      <BecknButton
        children="Go Back Home"
        handleClick={() => router.push('/')}
        dataTest={testIds.emptyOrder_button}
      />
    </Flex>
  )
}

export default EmptyOrder
