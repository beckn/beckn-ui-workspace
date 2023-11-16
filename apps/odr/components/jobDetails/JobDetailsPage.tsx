import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import Button from '../button/Button'
import Router from 'next/router'
import { JobDetailsPagePropsModel } from './JobDetails.types'

const JobDetailsPage: React.FC<JobDetailsPagePropsModel> = props => {
  const { t } = useLanguage()
  const { jobDetails, encodedJobDetails } = props

  return (
    <Box>
      <Text fontSize={'17px'} fontWeight="600" textAlign={'center'} pb="10px">
        {jobDetails.jobRole}
      </Text>
      <Text fontSize={'15px'} textAlign={'center'}>
        {jobDetails.companyName}
      </Text>
      <Box
        className="mt-4 product_description_text border-2 border_radius_all hideScroll"
        mb={'20px'}
        style={{
          padding: '5px 10px',
          maxHeight: 'calc(100vh - 254px)',
          overflow: 'auto'
        }}
      >
        {jobDetails.jobDescription}
      </Box>
      <Button
        buttonText={t.applyNow}
        background={'rgba(var(--color-primary))'}
        color={'rgba(var(--text-color))'}
        isDisabled={false}
        handleOnClick={() => {
          Router.push(`/jobApply?jobDetails=${encodedJobDetails}`)
        }}
      />
    </Box>
  )
}

export default JobDetailsPage
