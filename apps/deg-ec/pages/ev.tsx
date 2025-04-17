import LandingIframe from '@components/landingIframe/LandingIframe'
import { Box } from '@chakra-ui/react'
import React from 'react'
import Header from '@components/header/Header'
import Navbar from '@components/navbar/Navbar'

const EvChargingPage = () => {
  const evChargingUrl = process.env.NEXT_PUBLIC_EV_CHARGING || ''

  return (
    <Box>
      <Header experienceTitle="EV Charging" />
      <LandingIframe
        url={evChargingUrl}
        title="EV Charging Experience"
      />
      <Navbar />
    </Box>
  )
}

export default EvChargingPage
