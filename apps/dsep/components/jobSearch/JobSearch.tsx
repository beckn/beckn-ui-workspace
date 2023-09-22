import React from 'react'
import SearchBar from '../header/SearchBar'
import JobsCard from './JobsCard'

import { Box } from '@chakra-ui/react'
import Router from 'next/router'

const JobSearch = () => {
  const handleJobsCard = () => {
    Router.push('/jobDetails')
  }
  return (
    <div>
      <Box className="job-search-bar">
        <SearchBar searchString={''} handleChange={() => {}} />
      </Box>
      <JobsCard
        handleJobsCard={handleJobsCard}
        position={'Senior UI Analyst'}
        companyName={'EMinds'}
        location={'Pune, Maharashtra'}
        platformName={'BuyZilla'}
      />
    </div>
  )
}

export default JobSearch
