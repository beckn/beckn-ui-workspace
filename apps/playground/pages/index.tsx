import { Box, Image, Input } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../hooks/useLanguage'
import LoginIcon from '../public/images/LoginIcon.svg'
import style from '../components/detailsCard/ShippingForm.module.css'
import Button from '../components/button/Button'
import Router from 'next/router'
import { Accordion, Loader } from '@beckn-ui/molecules/src/components'
// import { BecknLogin } from '@beckn-ui/becknified-components'
import Signin from '@components/signIn/SignIn'

const MobileLogin = () => {
  useEffect(() => {
    localStorage.clear()
  }, [])

  return (
    <Box padding={'0 21px'}>
      {/* <Signin /> */}
      <Accordion accordionHeader={'my name'}>
        <h1>Ujjwal</h1>
        <p>This is my name</p>
      </Accordion>
    </Box>
  )
}

export default MobileLogin
