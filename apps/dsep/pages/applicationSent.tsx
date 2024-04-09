import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import React from 'react'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'

const applicationSent = () => {
  const { t } = useLanguage()
  const router = useRouter()

  return (
    <ConfirmationPage
      schema={{
        iconSrc: orderConfirmmark,
        successOrderMessage: t.applicationSubmitted,
        gratefulMessage: t.jobApplicationConfirmation,
        buttons: [
          {
            text: t.searchMoreJobs,
            handleClick: () => {
              router.push('/jobSearch')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary'
          },
          {
            text: t.goBackBtn,
            handleClick: () => {
              router.push('/homePage')
            },
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary'
          }
        ]
      }}
    />
  )
}

export default applicationSent
