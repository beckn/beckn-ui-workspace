import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React from 'react'
import CartEmpty from '../../public/images/cartEmptyIcon.svg'
import Styles from './EmptyCart.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'
import Router from 'next/router'

const EmptyCart: React.FC = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/search/?searchTerm=courses')
  }

  return (
    <Flex className={Styles.emptyCart_container}>
      <Box mb={'40px'} display={'flex'} justifyContent={'center'}>
        <Image src={CartEmpty} width={'306px'} height={'245px'} alt="cartEmpty" />
      </Box>
      <Text className={Styles.cartHeadingText}>{t.noCourse}</Text>
      <Text className={Styles.cartSpanText}>{t.noCouseSubText}</Text>
      <Box mt={'40%'}>
        <Button
          buttonText={t.searchCourses}
          background={'rgba(var(--color-primary))'}
          color={'rgba(var(--text-color))'}
          isDisabled={false}
          handleOnClick={handleGoBack}
        />
      </Box>
    </Flex>
  )
}

export default EmptyCart
