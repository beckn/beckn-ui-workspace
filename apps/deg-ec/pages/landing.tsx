import { Box, Flex, Image, Text, Button } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

const index = () => {
  const [iframeUrl, setIframeUrl] = useState('https://spark.becknprotocol.io')

  React.useEffect(() => {
    // Get URL from query parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlFromQuery = urlParams.get('url')

    if (urlFromQuery) {
      setIframeUrl(urlFromQuery)
    }
  }, [])

  // useEffect(() => {
  //   const countryData = {
  //     country: {
  //       name: 'United States',
  //       code: 'USA'
  //     }
  //   }
  //   Cookies.set('country_code', JSON.stringify(countryData), {
  //     path: '/',
  //     sameSite: 'strict'
  //   })
  // }, [])

  // const countryCookie = Cookies.get('country') // Gets the URL-encoded string

  // const decodedCookie = countryCookie ? decodeURIComponent(countryCookie) : ''

  // // const countryData = JSON.parse(decodedCookie)

  // console.log(decodedCookie)

  return (
    <Box p="60px">
      <Flex
        alignItems={'center'}
        justifyContent="space-between"
        mb="30px"
      >
        <Image
          src="/images/logo.svg"
          alt=""
        />
        <Box
          maxW={'50rem'}
          textAlign="center"
          position="relative"
          padding="10px 20px"
          backdropFilter="blur(10px)"
          backgroundColor="#9D9D9D03"
          backdrop-filter="blur(69.5999984741211px)"
        >
          <Text
            as={'span'}
            fontSize={'32px'}
            fontWeight="600"
          >
            <Text
              as={'span'}
              fontSize={'32px'}
              fontWeight="600"
              background="linear-gradient(90.13deg, #E99060 2.76%, #A77CA5 38.62%)"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              Rental
            </Text>{' '}
            experience for discovering and renting energy related equipments
          </Text>
        </Box>
        <Text w={'130px'}></Text>
      </Flex>

      <div className="smartphone-wrapper">
        <div className="smartphone">
          <div className="content">
            <>
              <iframe
                //@ts-ignore
                //   ref={iframeRef}
                className="ChooseExpIframe"
                allow="clipboard-read; clipboard-write; geolocation; camera; fullscreen"
                src={iframeUrl}
                frameBorder="0"
                allowFullScreen
                scrolling={'no'}
                width={'100%'}
                height={'100%'}
                style={{ borderRadius: '36px' }}
                loading="eager"
              />
            </>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default index
