import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import RideDetails from '@components/rideDetails/rideDetails'
import { useGetMyRideMutation } from '@services/RiderService'
import { RideDetailsProps } from '@lib/types/rideDetails'
import { RideData } from '@lib/types/ride'
import { rideStatusMap } from '@utils/ride-utils'
import { getCurrencyValue } from '@utils/rideSummary-utils'

const MyRides = () => {
  const country = localStorage.getItem('country')!
  const [currentTab, setCurrentTab] = useState<string>('All')
  const tabList = ['All', 'On-going', 'Completed']
  const [ridesData, setRidesData] = useState<RideData[]>([])
  const [getMyRide] = useGetMyRideMutation()

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getMyRide({}).unwrap()
        setRidesData(response.data.my_rides)
      } catch (error) {
        console.error('Failed to fetch rides:', error)
      }
    }

    fetchRides()
  }, [getMyRide])
  console.log(country)
  const myRidesHistory: RideDetailsProps[] = ridesData?.map((ride: any) => {
    return {
      orderId: ride.order_id.id,
      img: '/images/carImage.svg',
      riderName: `${ride.customer_id.first_name} ${ride.customer_id.last_name || ''}`.trim(),
      date: new Date(ride.updatedAt).toLocaleDateString(),
      time: new Date(ride.updatedAt).toLocaleTimeString(),
      fare: `${getCurrencyValue(country)}${ride.order_id.total_amount || 0}`,
      status: (rideStatusMap as any)[ride.state_value] || ''
    }
  })

  const filteredRides =
    currentTab === 'All' ? myRidesHistory : myRidesHistory.filter(ride => ride.status === currentTab)

  return (
    <Box
      mt="110px"
      padding="0 20px"
      maxH={'calc(100vh - 110px)'}
      overflowY="scroll"
      className="hideScroll"
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
                  {...ride}
                  key={ride.orderId}
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
