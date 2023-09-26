import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import MyJob from '../components/orderHistory/MyJob'

const myJobsOrderHistory = () => {
  const [myJobsStatus, setMyJobsStatus] = useState('Approved')
  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <MyJob
        heading={'Job Title - Company name'}
        time={'21st Jun 2021'}
        myJobsStatus={myJobsStatus}
        handleJobsStatus={() => {
          Router.push('/applyJobsPrefilled')
        }}
      />
    </Box>
  )
}

export default myJobsOrderHistory
