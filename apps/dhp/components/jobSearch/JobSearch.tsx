import React from 'react'
import SearchBar from '../header/SearchBar'
import JobsCard from './JobsCard'

import { Box } from '@chakra-ui/react'
import { JobInfo, JobsSearchPropsModel } from './JobsSearch.types'
import { getTransformedDataFromJobsResponse } from './JobsCard.utils'

const JobSearch: React.FC<JobsSearchPropsModel> = props => {
  const transformedData: JobInfo[] = getTransformedDataFromJobsResponse(props.jobs)

  return (
    <div>
      <Box className="job-search-bar">
        <SearchBar searchString={''} handleChange={() => {}} />
      </Box>
      {transformedData.map((data, idx) => (
        <JobsCard key={idx} job={data} />
      ))}
    </div>
  )
}

export default JobSearch
