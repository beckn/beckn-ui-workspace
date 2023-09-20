import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'

import ApplicationSentImg from '../../public/images/ApplicationSentImg.svg'
import Styles from './JobApply.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'
import Router from 'next/router'

const ApplicationSent = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/homePage')
  }
  const handleSearchJobs = (): void => {
    Router.push('/jobSearch')
  }
  return (
    <Flex className={Styles.applicationSent_container}>
      <Box mb={'43px'} display={'flex'} justifyContent={'center'}>
        <Image src={ApplicationSentImg} width={'190px'} height={'170px'} alt="Application Sent" />
      </Box>
      <Text className={Styles.appHeadingText}>{t.appSubmitText}</Text>
      <Text className={Styles.appSpanText}>{t.appSubmitSpan}</Text>
      <Button
        buttonText={t.searchMoreJobs}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={handleSearchJobs}
      />

      <Button
        buttonText={t.goBackBtn}
        background={'#FBFCFF'}
        color={'rgba(var(--color-primary))'}
        isDisabled={false}
        handleOnClick={handleGoBack}
      />
    </Flex>
  )
}

export default ApplicationSent
