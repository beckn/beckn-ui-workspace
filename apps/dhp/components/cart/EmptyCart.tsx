import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React from 'react'
import Styles from './EmptyCart.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'
import Router from 'next/router'

const EmptyCart: React.FC = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/homePage')
  }

  return (
    <Flex className={Styles.emptyCart_container}>
      <Box mb={'40px'} display={'flex'} justifyContent={'center'}>
        <Image src={'/images/cartEmptyIcon.png'} width={'306px'} height={'245px'} alt="cartEmpty" />
      </Box>
      <Text className={Styles.cartHeadingText}>{t.cartEmpty}</Text>
      <Text className={Styles.cartSpanText}>{t.emptyCartText1}</Text>
      <Text className={Styles.cartSpanText} mb="40px">
        {t.emptyCartText2}
      </Text>
      <Button
        buttonText={t.goBackBtn}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleGoBack}
      />
    </Flex>
  )
}

export default EmptyCart
