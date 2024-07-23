/* eslint-disable jsx-a11y/alt-text */
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
  ChakraProvider,
  Input,
  useTheme,
  Skeleton
} from '@chakra-ui/react'
import style from './TopSheet.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState } from '../../lib/types/geoLocationSearchPage'
import { BiSolidUpArrow } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { toggleLocationSearchPageVisibility } from '@beckn-ui/common'

interface TopSheetPropsModel {
  currentAddress: string
  loadingForCurrentAddress?: boolean
  currentLocationFetchError?: string
}

const TopSheet: React.FC<TopSheetPropsModel> = props => {
  const { currentAddress, currentLocationFetchError, loadingForCurrentAddress } = props
  const theme = useTheme()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const bgColorOfSearchIcon = theme.colors.primary['100']
  const isSearchPage = router.pathname === '/'

  const geoLocationSearchPageSelectedAddress = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoAddress
  })

  const onFocusChange = () => {
    dispatch(toggleLocationSearchPageVisibility(true))
  }

  const renderAddresstext = currentLocationFetchError || geoLocationSearchPageSelectedAddress || currentAddress || ''

  return (
    // <ChakraProvider theme={theme}>
    <Box className={isSearchPage ? style.searchTopSheetMargin : style.top_Sheet_Wrapper}>
      <Box
        className={style.topsheet_wrapper}
        padding={['0 20px', '0 20px', '0 20px', '0 10rem']}
      >
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          columnGap={'10px'}
          p={'8px'}
          pl="unset"
        >
          <Image src={'/images/setLocation.svg'} />

          <Box>
            <Text
              fontSize={'12px'}
              fontWeight={400}
            >
              {t.yourLocation}
            </Text>
            <Flex alignItems={'center'}>
              {loadingForCurrentAddress ? (
                <Skeleton
                  height={'10px'}
                  width={'200px'}
                />
              ) : (
                <>
                  <Text
                    maxWidth={'200px'}
                    overflow={'hidden'}
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    pr={'5px'}
                    fontSize={'12px'}
                    fontWeight={'500'}
                  >
                    {renderAddresstext}
                  </Text>
                  <Image
                    onClick={onOpen}
                    pt={'4px'}
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
        // trapFocus={false}
      >
        <ModalOverlay height="100vh" />

        <ModalContent
          position="fixed"
          top="85px"
          mb="0"
          borderRadius="0px 0px 1.75rem 1.75rem "
          maxW="lg"
          border={`2px solid ${'color.primary'}`}
          p={'16px 24px'}
          pb={'25px'}
        >
          <Box
            position={'absolute'}
            top={'-12px'}
            left={'67%'}
            color={bgColorOfSearchIcon}
          >
            <BiSolidUpArrow />
          </Box>
          <Box>
            <Text
              fontSize={'14px'}
              fontWeight={'600'}
              pb={'6px'}
            >
              {t.devicelocationisnotenabled}
            </Text>
            <Text
              fontSize={'14px'}
              fontWeight={400}
            >
              {t.accessToProvideLocation}
            </Text>
            <Box
              position={'relative'}
              mt="20px"
            >
              <Image
                position={'absolute'}
                bottom={'8px'}
                src="/images/LocationIcon2.svg"
                width={'24px'}
              />
              <Input
                pl="30px"
                _active={{
                  outline: 'unset'
                }}
                _focusVisible={{
                  borderColor: 'unset'
                }}
                outline="unset"
                border="unset"
                borderRadius={'unset'}
                borderBottom={'2px solid black'}
                placeholder={t.searchforlocation}
                onChange={onFocusChange}
              />
              <Image
                position={'absolute'}
                right="0"
                bottom={'8px'}
                src="/images/SearchIcon1.svg"
                width={'24px'}
              />
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
    // </ChakraProvider>
  )
}

export default TopSheet
