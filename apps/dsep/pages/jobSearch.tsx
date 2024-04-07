import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Box } from '@chakra-ui/react'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import JobSearch from '../components/jobSearch/JobSearch'
import { useLanguage } from '../hooks/useLanguage'
import { ParsedItemModel, SearchResponseModel } from '../types/search.types'
import { getParsedSearchlist } from '../utilities/search-utils'

const jobSearch = () => {
  const [jobs, setJobs] = useState<ParsedItemModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { t } = useLanguage()

  const searchPayload = {
    context: {
      domain: 'dsep:jobs'
    },
    searchString: 'Developer'
  }

  const fetchJobs = () => {
    axios
      .post(`${apiUrl}/search`, searchPayload)
      .then(res => {
        const jobResponse = getParsedSearchlist(res.data.data as SearchResponseModel[])

        setJobs(jobResponse)
        setIsLoading(false)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  if (isLoading) {
    return (
      <Box
        display={'grid'}
        height={'calc(100vh - 300px)'}
        alignContent={'center'}
      >
        <LoaderWithMessage
          loadingText={t.categoryLoadPrimary}
          loadingSubText={t.jobSearchLoaderText}
        />
      </Box>
    )
  }

  return <JobSearch jobs={jobs} />
}

export default jobSearch
