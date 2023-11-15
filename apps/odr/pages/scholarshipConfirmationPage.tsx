import { Box, Stack, Text } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from '../components/button/Button'
import ConfirmOrder from '../components/confirmOrder/ConfirmOrder'
import { ParsedScholarshipData } from '../components/scholarship/scholarshipCard/Scholarship.types'
import { useLanguage } from '../hooks/useLanguage'

const scholarshipConfirmationPage = () => {
  const { t } = useLanguage()
  const [appliedScholarship, setAppliedScholarship] = useState<ParsedScholarshipData | null>(null)

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
    <Box>
      <ConfirmOrder
        confirmationText={
          <>
            <Text fontSize={'17px'} fontWeight={'600'} textAlign={'center'}>
              {t.applicationSubmitted}
            </Text>
            <Stack>
              <Text textAlign={'center'} marginTop={'8px'} marginBottom={'40px'} fontSize={'15px'} fontWeight="400">
                {t.confirmText1} <br />
                {t.confirmText2} <span style={{ fontWeight: '600' }}>{appliedScholarship.id}</span> {t.confirmText3}
                <br />
                {t.confirmText4}
              </Text>
            </Stack>
          </>
        }
      />
      <Button
        buttonText={t.gotoCart}
        background={'transparent'}
        color={'rgba(var(--color-primary))'}
        isDisabled={false}
        handleOnClick={() => {
          Router.push('/cart')
        }}
      />
    </Box>
  )
}

export default scholarshipConfirmationPage
