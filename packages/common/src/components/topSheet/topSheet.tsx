import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  Box,
  Image,
  Text,
  Flex,
  Input,
  useTheme,
  Skeleton
} from '@chakra-ui/react'
import Styles from './topSheet.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { BiSolidUpArrow } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { IGeoLocationSearchPageRootState } from '@beckn-ui/common/lib/types'
import { toggleLocationSearchPageVisibility } from '@beckn-ui/common/src/store/geoMapLocationSearch-slice'
import { TopSheetComponentProps } from './topSheet.types'

const TopSheet: React.FC<TopSheetComponentProps> = ({
  currentAddress,
  currentLocationFetchError,
  loadingForCurrentAddress,
  t,
  searchPlaceholder = t('searchforlocation')
}) => {
  const theme = useTheme()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const dispatch = useDispatch()

  const isSearchPage = router.pathname === '/'

  const geoLocationSearchPageSelectedAddress = useSelector(
    (state: IGeoLocationSearchPageRootState) => state.geoLocationSearchPageUI.geoAddress
  )

  const bgColorOfSearchIcon = theme.colors.primary['100']

  const onFocusChange = () => {
    dispatch(toggleLocationSearchPageVisibility(true))
  }

  const renderAddressText = currentLocationFetchError || geoLocationSearchPageSelectedAddress || currentAddress || ''

  return (
    <Box className={isSearchPage ? Styles.searchTopSheetMargin : ''}>
      <Box
        className={Styles.topsheet_wrapper}
        padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          columnGap="10px"
          p="8px"
          pl="unset"
        >
          <Image src={'/images/setLocation.svg'} />
          <Box>
            <Text
              fontSize="12px"
              fontWeight={400}
            >
              {t('yourLocation')}
            </Text>
            <Flex alignItems="center">
              {loadingForCurrentAddress ? (
                <Skeleton
                  height="10px"
                  width="200px"
                />
              ) : (
                <>
                  <Text
                    maxWidth="200px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    pr="5px"
                    fontSize="12px"
                    fontWeight="500"
                    data-test="address"
                  >
                    {renderAddressText}
                  </Text>
                  <Image
                    onClick={onOpen}
                    pt="4px"
                    src="/images/downArrow.svg"
                  />
                </>
              )}
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior="outside"
        motionPreset="slideInBottom"
      >
        <ModalOverlay height="100vh" />
        <ModalContent
          position="fixed"
          top="85px"
          mb="0"
          borderRadius="0px 0px 1.75rem 1.75rem "
          maxW="lg"
          border={`2px solid ${theme.colors.primary}`}
          p="16px 24px"
          pb="25px"
        >
          <Box
            position="absolute"
            top="-12px"
            left="67%"
            color={bgColorOfSearchIcon}
          >
            <BiSolidUpArrow />
          </Box>
          <Box>
            <Text
              fontSize="12px"
              fontWeight="700"
              pb="6px"
            >
              {t('devicelocationisnotenabled')}
            </Text>
            <Text fontSize="12px">{t('accessToProvideLocation')}</Text>
            <Box
              position="relative"
              mt="20px"
            >
              <Image
                position="absolute"
                bottom="8px"
                src="/images/LocationIcon2.svg"
                width="24px"
              />
              <Input
                pl="30px"
                _active={{ outline: 'unset' }}
                _focusVisible={{ borderColor: 'unset' }}
                outline="unset"
                border="unset"
                borderRadius="unset"
                borderBottom="2px solid black"
                placeholder={searchPlaceholder}
                onChange={onFocusChange}
              />
              <Image
                position="absolute"
                right="0"
                bottom="8px"
                src="/images/SearchIcon1.svg"
                width="24px"
              />
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default TopSheet
