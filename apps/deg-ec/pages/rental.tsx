import Header from '@components/header/Header'
import LandingIframe from '@components/landingIframe/LandingIframe'
import Navbar from '@components/navbar/Navbar'
import React from 'react'

const RentalPage = () => {
  const retailUrl = process.env.NEXT_PUBLIC_OPEN_SPARK_RENTAL || ''

  return (
    <>
      <Header experienceTitle="Rental" />
      <LandingIframe
        url={retailUrl}
        title="Retail Experience"
      />
      <Navbar />
    </>
  )
}

export default RentalPage
