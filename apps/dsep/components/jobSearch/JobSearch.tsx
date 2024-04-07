import React from 'react'
import SearchBar from '../header/SearchBar'
import { Box } from '@chakra-ui/react'
import { JobsSearchPropsModel } from './JobsSearch.types'
import { ProductCard } from '@beckn-ui/becknified-components'
import JobCardRenderer from './job-card-renderer'

const JobSearch: React.FC<JobsSearchPropsModel> = props => {
  const { jobs, handleChange, searchvalue } = props

  return (
    <div>
      <Box className="job-search-bar">
        <SearchBar
          handleChange={() => {}}
          searchString={searchvalue}
        />
      </Box>
      {jobs.map(data => (
        <ProductCard
          key={data.item.id}
          ComponentRenderer={JobCardRenderer}
          dataSource={data}
        />
      ))}
    </div>
  )
}

export default JobSearch
