import Router, { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import JobDetailsPage from '../components/jobDetails/JobDetailsPage'
import { ParsedItemModel } from '../types/search.types'
import { fromBinary } from '../utilities/common-utils'

const JobDetails = () => {
  const [jobDetailsData, setJobDetailsData] = useState<null | ParsedItemModel>(null)
  const [encodedJobDetails, setEncodedJobDetails] = useState<string | string[] | undefined>('')

  useEffect(() => {
    if (!!jobDetailsData) {
      localStorage.removeItem('optionTags')
      localStorage.setItem('jobRoles', JSON.stringify({ name: jobDetailsData.item.name }))
      window.dispatchEvent(new Event('storage-optiontags'))
    }
  }, [jobDetailsData])

  useEffect(() => {
    const { jobDetails } = Router.query

    if (jobDetails) {
      setEncodedJobDetails(jobDetails)
      setJobDetailsData(JSON.parse(fromBinary(window.atob(jobDetails as string))))
    }
  }, [])

  if (!jobDetailsData || !encodedJobDetails) {
    return <></>
  }

  return (
    <div>
      <JobDetailsPage
        encodedJobDetails={encodedJobDetails}
        jobDetails={jobDetailsData as ParsedItemModel}
      />
    </div>
  )
}

export default JobDetails
