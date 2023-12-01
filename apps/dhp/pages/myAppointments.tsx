import { Box } from '@chakra-ui/react'
import Router from 'next/router'
import React, { useState } from 'react'
import MyAppointments from '../components/orderHistory/MyAppointments'

const myAppointments = () => {
  const [myAppointmentsStatus, setMyAppointmentsStatus] = useState('Upcoming')

  const handleHistoryOrderDetails = () => {
    Router.push('/orderDetailsHistoryPage')
  }
  return (
    <Box
      className="hideScroll"
      maxH={'calc(100vh - 100px)'}
      overflowY="scroll"
    >
      <MyAppointments
        labName={'Gio Labs'}
        address={'Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016'}
        time={'21st Jun 2021, 3.30pm'}
        OrderId={'789171'}
        MyAppointmentsStatus={myAppointmentsStatus}
        handleHistoryOrderDetails={handleHistoryOrderDetails}
      />
    </Box>
  )
}

export default myAppointments
