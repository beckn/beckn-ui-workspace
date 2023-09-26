import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import MyLearing from '../components/orderHistory/MyLearing'

const myLearningOrderHistory = () => {
  const [myLearningStatus, setMyLearningStatus] = useState('Approved')
  return (
    <Box className="hideScroll" maxH={'calc(100vh - 100px)'} overflowY="scroll">
      <MyLearing
        heading={'Extended Learning'}
        time={'21st Jun 2021, 3.30pm'}
        id={'789171'}
        myLearingStatus={myLearningStatus}
        handleViewCourses={() => {
          Router.push('/orderDetails')
        }}
      />
    </Box>
  )
}

export default myLearningOrderHistory
