import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React, { useState } from 'react'

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
              Retail Consumer
            </Text>{' '}
            experience for purchasing and renting out energy services
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
