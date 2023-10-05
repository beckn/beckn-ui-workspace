import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React from 'react'
import CartEmpty from '../../../public/images/cartEmptyIcon.svg'
import Styles from './EmptyScholarship.module.css'
import Router from 'next/router'
import { useLanguage } from '../../../hooks/useLanguage'
import Button from '../../button/Button'

const EmptyScholarship: React.FC = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/scholarshipSearchPage')
  }

  return (
    <Flex className={Styles.emptyCart_container}>
      <Box mb={'40px'} display={'flex'} justifyContent={'center'}>
        <Image src={CartEmpty} width={'306px'} height={'245px'} alt="cartEmpty" />
      </Box>
      <Text className={Styles.cartHeadingText}>{t.noScholarship}</Text>
      <Text className={Styles.cartSpanText}>{t.noScholarshipText1}</Text>
      <Text className={Styles.cartSpanText} mb="40px">
        {t.noScholarshipText2}
      </Text>
      <Button
        buttonText={t.searchScholarships}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleGoBack}
      />
    </Flex>
  )
}

export default EmptyScholarship
