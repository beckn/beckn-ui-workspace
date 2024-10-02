import React from 'react'
import { useLanguage } from '@hooks/useLanguage'
import beckenFooter from '@public/images/becknicon.svg'
import { Box, Flex, Image } from '@chakra-ui/react'
import { Typography } from '@beckn-ui/molecules'
import Footer from '@components/footer'
import ClickableCard from '@components/ClickableCard'
import chatIcon from '@public/images/chat_icon.svg'
import energyIcon from '@public/images/energy-icon.svg'
import becknGeminiIcon from '@public/images/beckn_gemini.svg'
import becknOnixIcon from '@public/images/beckn_onix.svg'
import becknGridIcon from '@public/images/uei-logo.D.svg'

const LandingPage = () => {
  const { t } = useLanguage()

  const handleOnCardClick = (e: React.MouseEvent, navigateTo: 'beckn-bot' | 'beckn-grid-connect') => {
    if (navigateTo === 'beckn-grid-connect') {
      const url = '/homePage'
      const uniqueUrl = `${url}?_=${new Date().getTime()}`
      window.location.replace(uniqueUrl)
    }
    if (navigateTo === 'beckn-bot') {
      const url = 'https://wa.me/916364334426?text=Hi'
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    e.preventDefault()
  }

  return (
    <>
      <Box
        backgroundColor={'#212121'}
        width={'100vw'}
        height={'100vh'}
        display={'flex'}
        flexDirection={'column'}
        gap={'0.5rem'}
      >
        <Box
          className="text-wrapper-innr"
          display={'flex'}
          flexDirection={'column'}
          padding="2rem 1rem 1rem 1rem"
          gap={{ base: '0.5rem', md: '1.5rem' }}
          position={'absolute'}
          right={{ base: 'calc(100vw - 100%)', md: 'calc(100vw - 80%)' }}
          left={{ base: 'calc(100vw - 100%)', md: 'calc(100vw - 80%)' }}
        >
          <Typography
            className="responsive"
            color="#C7C7C7"
            fontFamily="Noto Serif"
            fontWeight="300"
            // style={{
            //   lineHeight: '26px',
            //   width: '16rem'
            // }}
            sx={{
              lineHeight: { base: '26px', md: '26px' },
              width: { base: '16rem', md: '100%' },
              fontSize: { base: '24px', md: '34px' }
            }}
            text="Want to contribute to a cleaner greener future?"
          />
          {/* <Typography
            className="responsive"
            color="#C7C7C7"
            fontFamily="Noto Serif"
            fontWeight="300"
            // style={{
            //   lineHeight: '26px',
            //   width: '18rem'
            // }}
            sx={{
              lineHeight: { base: '26px', md: '26px' },
              width: { base: '18rem', md: '100%' },
              fontSize: { base: '24px', md: '34px' }
            }}
            text="Got surplus energy to sell?"
          /> */}
          <Typography
            className="responsive"
            color="#fff"
            fontFamily="Noto Serif"
            fontWeight="600"
            fontStyle="italic"
            sx={{
              lineHeight: { base: '26px', md: '26px' },
              width: { base: '9rem', md: '100%' },
              fontSize: { base: '24px', md: '34px' }
            }}
            text="Become a green warrior"
          />
          <Typography
            className="responsive"
            color="#C7C7C7"
            fontFamily="Noto Serif"
            fontWeight="300"
            sx={{
              lineHeight: { base: '26px', md: '26px' },
              width: { base: '8rem', md: '100%' },
              fontSize: { base: '24px', md: '34px' }
            }}
            text="with"
          />
          <Image
            src={becknGridIcon}
            alt="beckn_grid_icon"
            width={'12.8rem'}
          />
          <Typography
            className="responsive last-text"
            color="#C7C7C7"
            fontWeight="300"
            sx={{
              lineHeight: { base: '16px', md: '16px' },
              width: { base: '16rem', md: '100%' },
              fontSize: { base: '14px', md: '18px' }
            }}
            text="A directory of interconnected platforms that enable energy trades"
          />
          {/* <Box
            width={'11.4rem'}
            height={'10rem'}
            top="5rem"
            left="11rem"
            position={'absolute'}
            backgroundImage="/images/graph.svg"
            backgroundSize="cover"
            backgroundPosition="center"
          ></Box> */}
          <Box
            width={{ base: '11.4rem', md: '19.4rem' }}
            height={{ base: '10rem', md: '17rem' }}
            top={{ base: '5rem', md: '2rem' }}
            right={{ base: '0', md: '0' }}
            position="absolute"
            backgroundImage="/images/graph.svg"
            backgroundSize="cover"
            backgroundPosition="center"
          ></Box>
        </Box>
        <Box
          backgroundColor="#fff"
          position={'absolute'}
          bottom={'0'}
          right={{ base: 'calc(100vw - 100%)', md: 'calc(100vw - 82%)' }}
          left={{ base: 'calc(100vw - 100%)', md: 'calc(100vw - 82%)' }}
          padding={'1rem'}
          margin={'0 1rem'}
          borderRadius={'14px 14px 0px 0px'}
        >
          <Typography
            text="Choose from any of the below apps to trade"
            fontSize="16px"
            fontWeight="400"
            style={{
              width: '14rem',
              lineHeight: '19.98px',
              marginBottom: '2rem'
            }}
          />
          <Flex
            flexDirection={'column'}
            gap={'1rem'}
          >
            <ClickableCard
              headerIcon={chatIcon}
              title="Talk to Lisa"
              description="Lisa is an AI agent that helps prosumers and consumers execute peer-to-peer energy trades"
              backgroundColor="#D9F2E5"
              isNew={true}
              footerIcon={becknGeminiIcon}
              handleOnClick={e => handleOnCardClick(e, 'beckn-bot')}
            />

            <ClickableCard
              headerIcon={energyIcon}
              title="Open Spark"
              description="Open Spark is an energy Trading App that allows you to purchase locally produced energy"
              backgroundColor="#D9E5F8"
              footerIcon={becknOnixIcon}
              handleOnClick={e => handleOnCardClick(e, 'beckn-grid-connect')}
            />
          </Flex>
          <Footer
            logoSrc={beckenFooter}
            prefixText={'A'}
            postfixText={'protocol demonstration'}
          />
        </Box>
      </Box>
    </>
  )
}

export default LandingPage
