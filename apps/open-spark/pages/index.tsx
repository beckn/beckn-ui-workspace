import { Box, Flex, Image } from '@chakra-ui/react'
import Carousel from '@components/carasoul/Carousel'
import profileIcon from '@public/images/user_profile.svg'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { TiShoppingCart } from 'react-icons/ti'
import { TbHexagonLetterO } from 'react-icons/tb'
import { SlEnergy } from 'react-icons/sl'
import { TbCertificate } from 'react-icons/tb'
import { Typography } from '@beckn-ui/molecules'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import OpenWalletBottomModal from '@components/modal/OpenWalletBottomModal'
import { buttonStyles, images } from '@components/constant'

const HomePage = () => {
  const router = useRouter()
  const [modalType, setModalType] = useState<'wallet' | 'link' | 'otp' | 'alert' | null>(null)

  const handleModalOpen = (type: 'wallet' | 'link' | 'otp' | 'alert') => setModalType(type)
  const handleModalClose = () => setModalType(null)

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
            handleClick={() => handleModalOpen('wallet')}
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
              handleClick={() => router.push('/rentAndHire')}
              dataTest="hire_button"
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
      <OpenWalletBottomModal
        modalType={modalType}
        setModalType={setModalType}
        onClose={handleModalClose}
      />
    </Box>
  )
}

export default HomePage
