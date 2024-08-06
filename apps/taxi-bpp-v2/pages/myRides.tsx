import { DetailCard } from '@beckn-ui/becknified-components'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useState } from 'react'
import RideDetails from '@components/rideDetails/rideDetails'

const rides = [
  {
    id: 1,
    img: '/images/carImage.svg',
    riderName: 'Shaniwar Wada',
    date: '15 Jul',
    time: '6:45pm',
    fare: '₹249.00',
    status: 'Completed'
  },
  {
    id: 2,
    img: '/images/carImage.svg',
    riderName: 'Pune Station',
    date: '16 Jul',
    time: '7:00pm',
    fare: '₹300.00',
    status: 'On-going'
  },
  {
    id: 3,
    img: '/images/carImage.svg',
    riderName: 'Sinhagad Fort',
    date: '17 Jul',
    time: '5:00pm',
    fare: '₹500.00',
    status: 'Completed'
  }
  // Add more rides as needed
]

const MyRides = () => {
  const [currentTab, setCurrentTab] = useState('All')
  const tabList = ['All', 'On-going', 'Completed']

  const filteredRides = currentTab === 'All' ? rides : rides.filter(ride => ride.status === currentTab)

  return (
    <Box
      mt="110px"
      padding="0 20px"
    >
      <Tabs
        variant="soft-rounded"
        colorScheme="primary"
        onChange={index => setCurrentTab(tabList[index])}
      >
        <TabList>
          {tabList.map((status, index) => (
            <Tab
              key={index}
              m="0px 0px 24px"
              fontSize={tabList[index] === currentTab ? '15px' : '14px'}
              fontWeight="400"
              p={'10px 24px'}
              color="#000000"
            >
              {status}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {tabList.map((status, index) => (
            <TabPanel
              key={index}
              padding={'unset'}
            >
              {filteredRides.map(ride => (
                <RideDetails
                  img={ride.img}
                  riderName={ride.riderName}
                  date={ride.date}
                  time={ride.time}
                  fare={ride.fare}
                  status={ride.status}
                />
              ))}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default MyRides
