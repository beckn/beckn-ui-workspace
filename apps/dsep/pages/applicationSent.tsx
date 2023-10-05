import { Box, Stack, Text } from '@chakra-ui/react'
import Router from 'next/router'
import React from 'react'
import Button from '../components/button/Button'
import ApplicationSent from '../components/jobApply/ApplicationSent'
import { useLanguage } from '../hooks/useLanguage'

const applicationSent = () => {
  const { t } = useLanguage()
  return (
    <div>
      <ApplicationSent
        confirmationText={
          <>
            <Text fontSize={'17px'} fontWeight={'600'} textAlign={'center'}>
              {t.applicationSubmitted}
            </Text>
            <Stack>
              <Text textAlign={'center'} marginTop={'8px'} marginBottom={'40px'} fontSize={'15px'} fontWeight="400">
                {t.appSubmitSpan1} <br />
                {t.appSubmitSpan2}
              </Text>
            </Stack>
          </>
        }
      />
      <Button
        buttonText={t.searchMoreJobs}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={() => {
          Router.push('/jobSearch')
        }}
      />
      <Button
        buttonText={t.goBackBtn}
        background={'transparent'}
        color={'rgba(var(--color-primary))'}
        isDisabled={false}
        handleOnClick={() => {
          Router.push('/homePage')
        }}
      />
    </div>
  )
}

export default applicationSent
