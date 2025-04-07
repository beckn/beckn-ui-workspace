import LandingIframe from '@components/landingIframe/LandingIframe'
import { Box } from '@chakra-ui/react'
import React from 'react'
import Header from '@components/header/Header'
import Navbar from '@components/navbar/Navbar'

const RetailPage = () => {
  const retailUrl = process.env.NEXT_PUBLIC_OPEN_SPARK_RETAIL || ''

  return (
    <Box>
      <Header experienceTitle="Retail Consumer" />
      <LandingIframe
        url={retailUrl}
        title="Retail Experience"
      />
      <Navbar />
    </Box>
  )
}

export default RetailPage
