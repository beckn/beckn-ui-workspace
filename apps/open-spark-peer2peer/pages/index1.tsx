import { Box, Flex, Image } from '@chakra-ui/react'
import Carousel from '@components/carasoul/Carousel'
import profileIcon from '@public/images/user_profile.svg'
import { useRouter } from 'next/router'
import React from 'react'
import { TiShoppingCart } from 'react-icons/ti'
import { TbHexagonLetterO } from 'react-icons/tb'
import { SlEnergy } from 'react-icons/sl'
import { TbCertificate } from 'react-icons/tb'
import { Typography } from '@beckn-ui/molecules'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'

const images = [
  {
    src: '/images/homePage.svg',
    text: 'home page'
  },
  {
    src: '/images/homePage1.png',
    text: 'home page'
  },
  {
    src: '/images/homePage2.png',
    text: 'home page'
  }
]
const buttonStyles = {
  width: '100%',
  height: '54px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  px: '15px',
  py: '20px',
  margin: '10px',
  borderRadius: 'lg',
  background: 'white',
  boxShadow: '0px 10px 14px 0px #0000001A',
  _hover: { bg: 'gray.50' },
  _active: { bg: 'gray.100' }
}
const HomePage = () => {
  const router = useRouter()
  return (
    <Box
      backgroundColor="white"
      className="hideScroll"
      maxH={'calc(100vh - 10px)'}
      overflowY="scroll"
      ml={'-20px'}
      mr={'-20px'}
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        mt={'20px'}
        mb={'15px'}
        pl={'20px'}
        pr={'20px'}
      >
        <Box>
          <Image
            src={profileIcon}
            alt="profileIcon"
            onClick={() => router.push('/profile')}
          />
        </Box>
        <Box>
          <BecknButton
            text="Connect Wallet"
            handleClick={() => router.push('/profile')}
            sx={{
              width: '93px',
              height: '30px',
              fontSize: '10px',
              fontWeight: '400',
              padding: '10px',
              borderRadius: '6px',
              mb: 'unset'
            }}
          />
        </Box>
      </Flex>
      <Box>
        <Carousel images={images} />
        <Box
          padding={'10px'}
          mr={'20px'}
        >
          <Typography
            text={'Explore'}
            fontSize="17px"
            fontWeight="600"
            sx={{ m: '10px' }}
          />

          <Flex
            columnGap={'20px'}
            flexDirection="column"
          >
            <ShadowCardButton
              prefixIcon={<TiShoppingCart size={28} />}
              text="My Store"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => router.push('/myStore')}
              dataTest="store_button"
              sx={buttonStyles}
            />

            <ShadowCardButton
              prefixIcon={<TbHexagonLetterO size={28} />}
              text="Hire and Rent Services"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => router.push('/hire')}
              dataTest="store_button"
              sx={buttonStyles}
            />
            {/* <ShadowCardButton
              prefixIcon={<SlEnergy size={28} />}
              text="Peer to Peer Energy Trading"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => router.push('/peerToPeer')}
              dataTest="store_button"
              sx={buttonStyles}
            /> */}
            {/* <ShadowCardButton
              prefixIcon={<TbCertificate size={28} />}
              text="Loans & Subsidies"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => router.push('/loanAndSubsidies')}
              dataTest="store_button"
              sx={buttonStyles}
            /> */}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
