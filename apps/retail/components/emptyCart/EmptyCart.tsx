import { Box } from '@chakra-ui/react'
import React from 'react'
import Router from 'next/router'
import { useLanguage } from '@hooks/useLanguage'

const EmptyCart: React.FC = () => {
  const { t } = useLanguage()
  const handleGoBack = (): void => {
    Router.push('/')
  }

  return <></>
}

export default EmptyCart
