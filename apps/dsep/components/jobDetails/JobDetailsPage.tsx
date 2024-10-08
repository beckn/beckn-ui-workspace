import React, { useEffect, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'
import Router from 'next/router'
import { JobDetailsPagePropsModel } from './JobDetails.types'
import { Typography } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

const JobDetailsPage: React.FC<JobDetailsPagePropsModel> = props => {
  const { t } = useLanguage()
  const { jobDetails, encodedJobDetails } = props
  const { item, providerName } = jobDetails
  const { name } = item

  return (
    <Box>
      <Flex
        alignItems={'center'}
        justifyContent={'center'}
        flexDir={'column'}
        gap={'10px'}
      >
        <Typography
          dataTest={testIds.job_details_name}
          text={name}
          fontSize={'17px'}
          fontWeight={'600'}
        />
        <Typography
          dataTest={testIds.job_details_provider_name}
          text={providerName}
          fontSize={'15px'}
        />
      </Flex>

      <Box
        data-test={testIds.job_details_description}
        padding="5px 10px"
        maxHeight="calc(100vh - 254px)"
        overflow="auto"
        className="mt-4 product_description_text border-2 border_radius_all hideScroll"
        mb={'20px'}
      >
        {jobDetails.item.long_desc}
      </Box>
      <Button
        dataTest={testIds.job_details_apply}
        buttonText={t.applyNow}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={() => {
          localStorage.setItem('selectCardHeaderText', JSON.stringify(jobDetails.item.name))
          Router.push(`/jobApply?jobDetails=${encodedJobDetails}`)
        }}
      />
    </Box>
  )
}

export default JobDetailsPage
