import React from 'react'
import { Text, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import EmptyCartImg from '../../public/images/emptyCard.svg'
import { useLanguage } from '@hooks/useLanguage'
import { useRouter } from 'next/router'
import { testIds } from '@shared/dataTestIds'

const EmptyCart = () => {
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
          w={'160px'}
          margin="0 auto"
          src={EmptyCartImg}
          data-test={testIds.empty_order_image}
          pb={'20px'}
        />

        <Text
          as={Typography}
          text={t.emptyCardHeading}
          fontWeight="600"
          fontSize={'15px'}
          align={'center'}
          dataTest={testIds.emptyOrderHistoryText}
        />
        <Text
          as={Typography}
          text={t.emptyCardSubHeading}
          fontWeight="400"
          fontSize={'15px'}
          align={'center'}
          dataTest={testIds.noExistingWorkflowText}
        />
      </Flex>

      <BecknButton
        dataTest={testIds.emptyOrder_button}
        children="Added Battery "
        handleClick={() => router.push('/myStore')}
      />
    </Flex>
  )
}

export default EmptyCart
