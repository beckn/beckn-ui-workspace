/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Box,
  Image,
  Text,
  Flex,
  ChakraProvider,
  Input
} from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import style from './TopSheet.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState } from '../../lib/types/geoLocationSearchPage'
import { toggleLocationSearchPageVisibility } from '../../store/geoMapLocationSearch-slice'

const theme = extendTheme({
  components: {
    Modal: {
      baseStyle: {
        overlay: {
          top: '98px'
        }
      }
    }
  }
})

interface TopSheetPropsModel {
  currentAddress: string
}

const TopSheet: React.FC<TopSheetPropsModel> = props => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t, locale } = useLanguage()
  const dispatch = useDispatch()

  const geoLocationSearchPageSelectedAddress = useSelector((state: IGeoLocationSearchPageRootState) => {
    return state.geoLocationSearchPageUI.geoAddress
  })

  const onFocusChange = () => {
    dispatch(toggleLocationSearchPageVisibility(true))
  }

  if (!props.currentAddress && !geoLocationSearchPageSelectedAddress) {
    return <></>
  }

  return (
    <ChakraProvider theme={theme}>
      <Box boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.08)" margin={'-25px -25px 0px -25px'} padding={'14px'}>
        <Box>
          <Flex alignItems={'center'}>
            <Image pr={'6px'} src={'/images/LocationIcon1.svg'} />

            <Box>
              <Text fontSize={'12px'}>{t('yourLocation')}</Text>
              <Flex alignItems={'center'}>
                <Text
                  maxWidth={'200px'}
                  overflow={'hidden'}
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                  pr={'5px'}
                  fontSize={'12px'}
                  fontWeight={'500'}
                >
                  {geoLocationSearchPageSelectedAddress ? geoLocationSearchPageSelectedAddress : props.currentAddress}
                </Text>
                <Image onClick={onOpen} pt={'4px'} src="/images/DownArrow.svg" />
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
            top="90px"
            mb="0"
            borderRadius="0px 0px 1.75rem 1.75rem "
            maxW="lg"
            border={`2px solid ${'rgba(var(--color-primary))'}`}
            p={'16px 24px'}
            pb={'25px'}
          >
            <Box>
              <Image position={'absolute'} top={'-12px'} left={'30%'} src="/images/UpArrow.svg" />
            </Box>
            <Box>
              <Text fontSize={'12px'} fontWeight={'700'} pb={'6px'}>
                {t('devicelocationisnotenabled')}
              </Text>
              <Text fontSize={'12px'}>{t('accessToProvideLocation')}</Text>
              <Box position={'relative'} mt="20px">
                <Image position={'absolute'} bottom={'8px'} src="/images/LocationIcon2.svg" width={'24px'} />
                <Input
                  pl="30px"
                  _active={{ outline: 'unset' }}
                  _focusVisible={{ borderColor: 'unset' }}
                  outline="unset"
                  border="unset"
                  borderRadius={'unset'}
                  borderBottom={'2px solid black'}
                  placeholder={t('searchforlocation')}
                  onChange={onFocusChange}
                />
                <Image position={'absolute'} right="0" bottom={'8px'} src="/images/SearchIcon1.svg" width={'24px'} />
              </Box>
              {/* <Box textAlign={"center"} pt={"20px"} fontSize="12px">
                {t("or")}
              </Box>
              <Box textAlign={"center"} pt={"20px"} fontSize="12px">
                {t("enableLocation")}
              </Box> */}
            </Box>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  )
}

export default TopSheet
