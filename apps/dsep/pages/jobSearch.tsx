import axios from 'axios'
import React, { useEffect, useState } from 'react'
import JobSearch from '../components/jobSearch/JobSearch'
import { JobResponse } from '../components/jobSearch/JobsSearch.types'
import Loader from '../components/loader/Loader'

const searchPayload = {
  loggedInUserEmail: 'sugguna.rajesh70@gmail.com',
  title: {
    key: 'Engineer'
  },
  company: {
    name: '',
    locations: [
      {
        city: ''
      }
    ]
  },
  skills: [
    {
      name: '',
      code: ''
    }
  ]
}

const jobSearch = () => {
  const [jobs, setJobs] = useState<JobResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const apiUrl = process.env.NEXT_PUBLIC_DSEP_URL

  const fetchJobs = () => {
    axios
      .post(`${apiUrl}/job/search`, searchPayload)
      .then(res => {
        const jobResponse = res.data
        setJobs(jobResponse)
        setIsLoading(false)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  if (isLoading) {
    return <Loader loadingText="Searching for jobs" />
  }

  return (
    <div>
      <JobSearch jobs={jobs} />
    </div>
  )
}

export default jobSearch
