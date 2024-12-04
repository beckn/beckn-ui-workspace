import { Box } from '@chakra-ui/react'
import DeviceList from '@components/deviceList/DeviceList'
import React, { useState } from 'react'

const MyDers = () => {
  const [devices, setDevices] = useState([
    { name: 'Wifi', paired: true },
    { name: 'Orient electric Fan', paired: true },
    { name: 'Sony TV', paired: true },
    { name: 'OLA S1 Air Electric Scooter', paired: true },
    { name: 'Philips LED Light', paired: true },
    { name: 'Solar Panel', paired: true }
  ])

  const [nearbyDevices, setNearbyDevices] = useState([{ name: 'Light', paired: false }])

  const handleDeviceChange = (
    updatedDevices: React.SetStateAction<{ name: string; paired: boolean }[]>,
    updatedNearbyDevices: React.SetStateAction<{ name: string; paired: boolean }[]>
  ) => {
    setDevices(updatedDevices)
    setNearbyDevices(updatedNearbyDevices)
  }

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      backgroundColor="white"
    >
      <DeviceList
        initialDevices={devices}
        initialNearbyDevices={nearbyDevices}
        onDeviceChange={handleDeviceChange}
      />
    </Box>
  )
}

export default MyDers
