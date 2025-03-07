import { Avatar, Box, Flex, Image, Select } from '@chakra-ui/react'
import Carousel from '@components/carasoul/Carousel'
import profileIcon from '@public/images/user_profile.svg'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import { setNavigationType } from '@store/navigation-slice'
import Cookies from 'js-cookie'
import { AuthRootState } from '@store/auth-slice'
import { DegWalletDetails } from '@beckn-ui/common'
import { UserRootState } from '@store/user-slice'

const HomePage = () => {
  const bearerToken = Cookies.get('authToken')
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL

  const [isLoading, setIsLoading] = useState(false)
  const [walletDetails, setWalletDetails] = useState<DegWalletDetails>()
  const [modalType, setModalType] = useState<'wallet' | 'link' | 'otp' | 'alert' | null>(null)

  const router = useRouter()
  const { user } = useSelector((state: AuthRootState) => state.auth)
  const { shouldShowInitialAlert } = useSelector((state: UserRootState) => state.user)

  const handleModalOpen = (type: 'wallet' | 'link' | 'otp' | 'alert') => setModalType(type)
  const handleModalClose = () => setModalType(null)
  const dispatch = useDispatch()

  const handleNavigation = (type: 'MY_STORE' | 'RENT_AND_HIRE', pathname: string) => {
    dispatch(setNavigationType(type))
    router.push(pathname)
    // if (type === 'RENT_AND_HIRE') {
    //   router.push('/rentAndHire')
    // } else {
    //   router.push('/myStore')
    // }
  }

  useEffect(() => {
    if (user && user?.deg_wallet) {
      setWalletDetails(user.deg_wallet)
    }
    console.log(shouldShowInitialAlert)
    if (
      shouldShowInitialAlert &&
      user?.deg_wallet &&
      (!user?.deg_wallet.energy_assets_consent ||
        !user?.deg_wallet.energy_identities_consent ||
        !user?.deg_wallet.energy_transactions_consent)
    ) {
      setModalType('alert')
    }
  }, [user, shouldShowInitialAlert])

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
          <Avatar
            name={`${user?.agent?.first_name || ''} ${user?.agent?.last_name || ''}`}
            width="38px"
            height="38px"
            cursor={'pointer'}
            onClick={() => router.push('/profile')}
          />
        </Box>
        <Box>
          {user?.deg_wallet &&
          (user?.deg_wallet.energy_assets_consent ||
            user?.deg_wallet.energy_identities_consent ||
            user?.deg_wallet.energy_transactions_consent) ? (
            <Select
              variant="unstyled"
              placeholder={`/subj****${user?.deg_wallet.deg_wallet_id.slice(-4)}`}
              value=""
              style={{
                pointerEvents: 'none'
              }}
            />
          ) : (
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
          )}
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
              text="Marketplace"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => handleNavigation('MY_STORE', '/myStore')}
              dataTest="store_button"
              sx={buttonStyles}
            />
            <ShadowCardButton
              prefixIcon={<TbHexagonLetterO size={28} />}
              text="Battery Rental"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => handleNavigation('RENT_AND_HIRE', '/myStore')}
              dataTest="hire_button"
              sx={buttonStyles}
            />
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
