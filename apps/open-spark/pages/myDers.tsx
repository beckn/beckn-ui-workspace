import { Box } from '@chakra-ui/react'
import DeviceList from '@components/deviceList/DeviceList'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import { RootState } from '@store/index'
import axios from 'axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const MyDers = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const { role } = useSelector((state: RootState) => state.auth)
  const bearerToken = Cookies.get('authToken')
  const [devices, setDevices] = useState([
    { name: 'Wifi', paired: true },
    { name: 'Orient electric Fan', paired: true },
    { name: 'Sony TV', paired: true },
    { name: 'OLA S1 Air Electric Scooter', paired: true },
    { name: 'Philips LED Light', paired: true },
    { name: 'Solar Panel', paired: true }
  ])

  const handleDeviceChange = (updatedDevices: React.SetStateAction<{ name: string; paired: boolean }[]>) => {
    setDevices(updatedDevices)
  }

  const fetchPairedData = async () => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[role!]}/der`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data.data
      console.log(result)

      if (role === ROLE.PRODUCER) {
        setDevices(result.production)
      } else if (role === ROLE.CONSUMER) {
        setDevices(result.consumption)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    if (role && bearerToken && strapiUrl) {
      fetchPairedData()
    }
  }, [role, bearerToken, strapiUrl])

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      backgroundColor="white"
    >
      <DeviceList
        initialDevices={devices}
        onDeviceChange={handleDeviceChange}
        fetchPairedData={fetchPairedData}
      />
    </Box>
  )
}

export default MyDers
