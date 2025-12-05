import React, { useState } from 'react'
import SearchBar from '../header/SearchBar'
import { Box } from '@chakra-ui/react'
import { JobsSearchPropsModel } from './JobsSearch.types'
import { ProductCard } from '@beckn-ui/becknified-components'
import JobCardRenderer from './job-card-renderer'
import { useRouter } from 'next/router'

const JobSearch: React.FC<JobsSearchPropsModel> = props => {
  const router = useRouter()
  const { jobs, handleChange, searchvalue } = props
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')

  return (
    <div>
      <Box className="job-search-bar">
        <SearchBar
          handleChange={(text: string) => {
            setSearchKeyword(text)
            localStorage.removeItem('optionTags')
            localStorage.setItem(
              'optionTags',
              JSON.stringify({
                name: text
              })
            )
            window.dispatchEvent(new Event('storage-optiontags'))
          }}
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
