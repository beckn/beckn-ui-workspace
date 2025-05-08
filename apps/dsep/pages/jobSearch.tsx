import LoaderWithMessage from '@beckn-ui/molecules/src/components/LoaderWithMessage/loader-with-message'
import { Box } from '@chakra-ui/react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import JobSearch from '../components/jobSearch/JobSearch'
import { useLanguage } from '../hooks/useLanguage'
import axios from '../services/axios'
import { ParsedItemModel, SearchResponseModel } from '../types/search.types'
import { getParsedSearchlist } from '../utilities/search-utils'

const jobSearch = () => {
  const router = useRouter()
  const [jobs, setJobs] = useState<ParsedItemModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchKeyword, setSearchKeyword] = useState(router.query?.searchTerm || '')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const { t } = useLanguage()

  const searchPayload = {
    context: {
      domain: 'dsep:jobs'
    },
    searchString: searchKeyword
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

  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 104px)'}
      overflowY="scroll"
    >
      <JobSearch jobs={jobs} />
    </Box>
  )
}

export default jobSearch
