import React, { useEffect, useState } from 'react'
import { ConfirmationPage } from '@beckn-ui/becknified-components'
import { useRouter } from 'next/router'
import orderConfirmmark from '../public/images/orderConfirmmark.svg'
import { ParsedScholarshipData } from '../components/scholarship/scholarshipCard/Scholarship.types'
import { useLanguage } from '../hooks/useLanguage'
import { testIds } from '@shared/dataTestIds'

const scholarshipConfirmationPage = () => {
  const { t } = useLanguage()
  const [appliedScholarship, setAppliedScholarship] = useState<ParsedScholarshipData | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (localStorage) {
      const storedSelectedScholarship = localStorage.getItem('selectedScholarship')
      if (storedSelectedScholarship) {
        setAppliedScholarship(JSON.parse(storedSelectedScholarship))
      }
    }
  }, [])

  if (!appliedScholarship) {
    return <></>
  }

  return (
    <ConfirmationPage
      schema={{
        iconSrc: orderConfirmmark,
        successOrderMessage: t.applicationSubmitted,
        gratefulMessage: `${t.ScholarshipConfirmation} ${router.query.id} ${t.andRespond}`,
        buttons: [
          {
            text: t.gotoCart,
            handleClick: () => {
              router.push('/cart')
            },
            disabled: false,
            variant: 'solid',
            colorScheme: 'primary',
            dataTest: testIds.scholarshipConfirmation_cart
          }
        ]
      }}
    />
  )
}

export default scholarshipConfirmationPage
