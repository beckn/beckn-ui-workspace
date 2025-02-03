import { Box } from '@chakra-ui/react'
import DeviceList from '@components/deviceList/DeviceList'
import { ROLE, ROUTE_TYPE } from '@lib/config'
import axios from '@services/axios'
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react'

const MyDers = () => {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL
  const bearerToken = Cookies.get('authToken')
  const [devices, setDevices] = useState<{ id: number; name: string; paired?: boolean }[]>([])

  const handleDeviceChange = (
    updatedDevices: React.SetStateAction<{ id: number; name: string; paired?: boolean }[]>
  ) => {
    setDevices(updatedDevices)
  }

  const fetchPairedData = async () => {
    try {
      const response = await axios.get(`${strapiUrl}${ROUTE_TYPE[ROLE.GENERAL]}/der`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
        withCredentials: true
      })

      const result = response.data
      const mappedDevices = result.map((item: { category: string; id: number }) => ({
        name: item.category,
        paired: true,
        id: item.id
      }))
      setDevices(mappedDevices)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  useEffect(() => {
    if (bearerToken && strapiUrl) {
      fetchPairedData()
    }
  }, [bearerToken, strapiUrl])

  return (
    <Box
      maxWidth={{ base: '100vw', md: '30rem', lg: '40rem' }}
      margin="calc(0rem + 0px) auto auto auto"
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
