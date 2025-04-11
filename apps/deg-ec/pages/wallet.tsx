import LandingIframe from '@components/landingIframe/LandingIframe'
import { Box } from '@chakra-ui/react'
import React from 'react'
import Header from '@components/header/Header'
import Navbar from '@components/navbar/Navbar'

const WalletPage = () => {
  const walletUrl = process.env.NEXT_PUBLIC_OPEN_SPARK_WALLET || ''

  return (
    <Box>
      <Header experienceTitle="Wallet" />
      <LandingIframe
        url={walletUrl}
        title="Wallet Experience"
      />
      <Navbar />
    </Box>
  )
}

export default WalletPage
