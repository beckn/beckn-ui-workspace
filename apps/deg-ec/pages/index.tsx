import { Box, Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'

const index = () => {
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
          maxW={'720px'}
          textAlign="center"
          position="relative"
          padding="10px"
          backdropFilter="blur(10px)"
          backgroundColor="#9D9D9D03"
          backdrop-filter="blur(69.5999984741211px)"
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
          <Text
            as={'span'}
            fontSize={'32px'}
            fontWeight="600"
          >
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
                src={'https://retail-dev.becknprotocol.io/'}
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
