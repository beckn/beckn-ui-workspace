import { Box, Divider, Flex, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Landing = () => {
  const router = useRouter()
  const [iframeUrl, setIframeUrl] = useState('')
  const [pageText, setPageText] = useState('')

  useEffect(() => {
    const { url, title } = router.query
    if (url && typeof url === 'string') {
      setIframeUrl(decodeURIComponent(url))
    }

    if (title && typeof title === 'string') {
      const decodedTitle = decodeURIComponent(title)
      switch (decodedTitle) {
        case 'Retail Experience':
          setPageText(' Consumer experience for purchasing and renting out energy services')
          break
        case 'Rental Experience':
          setPageText(' experience for discovering and renting energy related equipments')
          break
        case 'Wallet Experience':
          setPageText(' experience for securely storing all your assets, transactions and documentation in one place')
          break
        case 'Finance Experience':
          setPageText(' experience for bankers to monitor and manage loan requests')
          break
        case 'P2P Energy Trading':
          setPageText(' Energy Trading experience to trade excess energy directly with peers in real time')
          break
        case 'EV Charging':
          setPageText(' Charging experience for managing and monitoring charging stations')
          break
        default:
          setPageText('')
      }
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
          maxW={'880px'}
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
              {router.query.title && typeof router.query.title === 'string'
                ? decodeURIComponent(router.query.title).split(' ')[0]
                : ''}
            </Text>{' '}
            {pageText}
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
