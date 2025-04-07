import Header from '@components/header/Header'
import LandingIframe from '@components/landingIframe/LandingIframe'
import Navbar from '@components/navbar/Navbar'
import React from 'react'

const FinancePage = () => {
  const retailUrl = process.env.NEXT_PUBLIC_OPEN_SPARK_LEND_EASE || ''

  return (
    <>
      <Header experienceTitle="Finance" />
      <LandingIframe
        url={retailUrl}
        title="Retail Experience"
      />
      <Navbar />
    </>
  )
}

export default FinancePage
