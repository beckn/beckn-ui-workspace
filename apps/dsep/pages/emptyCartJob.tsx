import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React from 'react'
import CartEmpty from '../public/images/cartEmptyIcon.svg'
import Styles from '../components/cart/EmptyCart.module.css'
import { useLanguage } from '../hooks/useLanguage'
import Button from '../components/button/Button'
import Router from 'next/router'
import { testIds } from '@shared/dataTestIds'

const EmptyCartJob: React.FC = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/')
  }

  return (
    <Flex className={Styles.emptyCart_container}>
      <Box
        mb={'40px'}
        display={'flex'}
        justifyContent={'center'}
      >
        <Image
          data-test={testIds.cartpage_emptyImage}
          src={CartEmpty}
          width={'306px'}
          height={'245px'}
          alt="cartEmpty"
        />
      </Box>
      <Text
        fontSize={'15px'}
        fontWeight={600}
        textAlign={'center'}
        data-test={testIds.noJobs}
      >
        {t.noJobs}
      </Text>
      <Text
        className={Styles.cartSpanText}
        data-test={testIds.noJobSubText}
      >
        {t.noJobSubText}
      </Text>
      <Box mt={'40%'}>
        <Button
          dataTest={testIds.searchJobButton}
          buttonText={t.searchJob}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={false}
          handleOnClick={handleGoBack}
        />
      </Box>
    </Flex>
  )
}

export default EmptyCartJob
