import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Landing = () => {
  const router = useRouter()
  const [iframeUrl, setIframeUrl] = useState('')

  useEffect(() => {
    const { url } = router.query
    if (url && typeof url === 'string') {
      setIframeUrl(decodeURIComponent(url))
    }
  }, [router.query])

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
          cursor="pointer"
          onClick={() => router.push('/home')}
        />
        <Box
          maxW={'720px'}
          textAlign="center"
          position="relative"
          padding="10px 20px"
          backdropFilter="blur(10px)"
          backgroundColor="#9D9D9D03"
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
            {iframeUrl && (
              <iframe
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
            )}
          </div>
        </div>
      </div>
      <Box
        w={'50px'}
        h="104px"
        boxShadow="16px 17px 22px 23px #00000008"
        borderRadius={'50px'}
        bg="#fff"
        p="6px"
        position={'absolute'}
        right="60px"
        top={'calc(50vh - 25px)'}
        display="flex"
        justifyContent={'center'}
        alignItems="center"
        flexDirection={'column'}
      >
        <Image
          src="/images/homeIcon.svg"
          alt=""
          cursor={'pointer'}
          onClick={() => router.push('/home')}
        />
        <Divider />
        <Image
          src="/images/exitIcon.svg"
          alt=""
          cursor={'pointer'}
          onClick={() => router.push('/')}
        />
      </Box>
    </Box>
  )
}

export default Landing
