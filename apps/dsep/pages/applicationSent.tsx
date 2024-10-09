import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import React from 'react'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { useLanguage } from '../hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

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
            colorScheme: 'primary',
            dataTest: testIds.jobSubmitted_viewNewJob
          },
          {
            text: t.goBackBtn,
            handleClick: () => {
              router.push('/')
            },
            disabled: false,
            variant: 'outline',
            colorScheme: 'primary',
            dataTest: testIds.jobSubmitted_viewToHomePage
          }
        ]
      }}
    />
  )
}

export default applicationSent
