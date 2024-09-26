import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React from 'react'
import CartEmpty from '../public/images/cartEmptyIcon.svg'
import Styles from '../components/cart/EmptyCart.module.css'
import { useLanguage } from '../hooks/useLanguage'
import Router from 'next/router'
import Button from '../components/button/Button'

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
      >
        {t.npCourseFound}
      </Text>
      <Text className={Styles.cartSpanText}>{t.noCourseSubText}</Text>
      <Box mt={'40%'}>
        <Button
          buttonText={t.searchLearning}
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
