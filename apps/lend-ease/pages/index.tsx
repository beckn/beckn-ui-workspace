import { Box, Flex, Image, Text } from '@chakra-ui/react'
import Carousel from '@components/carasoul/Carousel'
import profileIcon from '@public/images/bajaj-icon.svg'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import ShadowCardButton from '@components/buttonCard/ShadowCardButton'
import { buttonStyles, images } from '@components/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setNavigationType } from '@store/navigation-slice'
import Cookies from 'js-cookie'
import { AuthRootState } from '@store/auth-slice'
import { DegWalletDetails } from '@beckn-ui/common'
import { UserRootState } from '@store/user-slice'
import DetailsCard from '@beckn-ui/becknified-components/src/components/checkout/details-card'

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

  useEffect(() => {
    if (user && user?.deg_wallet) {
      setWalletDetails(user.deg_wallet)
    }

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
        justifyContent={'flex-end'}
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
            onClick={() => {}}
          />
        </Box>
        <Box></Box>
      </Flex>
      <Box>
        <Carousel images={images} />
        <Box
          padding={'10px'}
          mr={'10px'}
          ml="10px"
          mt="10px"
        >
          <Flex
            columnGap={'20px'}
            flexDirection="column"
          >
            <ShadowCardButton
              prefixIcon={<Image src="./images/svg8.svg" />}
              text="Loans"
              textStyle="start"
              postIcon={<MdOutlineKeyboardArrowRight />}
              handleClick={() => router.push('/loans')}
              dataTest="store_button"
              sx={buttonStyles}
            />
          </Flex>
          <Flex
            justifyContent={'space-between'}
            alignItems="center"
            mt="20px"
            mb="20px"
          >
            <Text
              fontSize={'17px'}
              fontWeight="600"
            >
              Loan Applications
            </Text>
            <Text
              cursor={'pointer'}
              fontSize={'14px'}
              fontWeight="600"
              color={'#0069B4'}
              onClick={() => {}}
            >
              See all
            </Text>
          </Flex>
          <Box
            className={'hideScroll'}
            // maxH="calc(100vh - 100px)"
            // overflowY={'scroll'}
          >
            <DetailsCard>
              <Flex
                mb="5px"
                justifyContent={'space-between'}
                alignItems="center"
              >
                <Text
                  fontSize={'12px'}
                  fontWeight="500"
                >
                  Battery Finance
                </Text>
                <Text
                  padding={'2px 4px'}
                  fontSize={'10px'}
                  color="#fff"
                  bg={'#51B651'}
                  borderRadius="4px"
                >
                  Approved
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                >
                  Applicants Name:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                >
                  Viraj K
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                >
                  Stage:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                >
                  Sanctioned
                </Text>
              </Flex>
              <Flex mb="5px">
                <Text
                  mr="4px"
                  fontSize={'10px'}
                  fontWeight="500"
                >
                  Placed at:
                </Text>
                <Text
                  fontWeight={'300'}
                  fontSize={'10px'}
                >
                  21st Jun 2021, 12:21pm
                </Text>
              </Flex>
            </DetailsCard>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
