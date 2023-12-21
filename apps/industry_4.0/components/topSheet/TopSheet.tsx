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
  Button,
  useTheme
} from '@chakra-ui/react'
import style from './TopSheet.module.css'
import { useLanguage } from '../../hooks/useLanguage'
import { useDispatch, useSelector } from 'react-redux'
import { IGeoLocationSearchPageRootState } from '../../lib/types/geoLocationSearchPage'
import { toggleLocationSearchPageVisibility } from '../../store/geoMapLocationSearch-slice'
import { MdMyLocation } from 'react-icons/md'

interface TopSheetPropsModel {
  currentAddress: string
  loadingForCurrentAddress: boolean
}

const TopSheet: React.FC<TopSheetPropsModel> = props => {
  const theme = useTheme()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t } = useLanguage()
  const dispatch = useDispatch()
  const bgColorOfSearchIcon = theme.colors.primary['100']

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
      <Box className={style.top_Sheet_Wrapper}>
        <Box>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            columnGap={'10px'}
            p={'8px'}
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
                <Image
                  onClick={onOpen}
                  pt={'4px'}
                  src="/images/downArrow.svg"
                />
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
            <Box>
              <Image
                position={'absolute'}
                top={'-12px'}
                left={'30%'}
                src="/images/uparrow.svg"
              />
            </Box>
            <Box>
              <Text
                fontSize={'12px'}
                fontWeight={'700'}
                pb={'6px'}
              >
                {t.devicelocationisnotenabled}
              </Text>
              <Text fontSize={'12px'}>{t.accessToProvideLocation}</Text>
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
              <Box
                textAlign={'center'}
                pt={'20px'}
                fontSize="12px"
              >
                {t.or}
              </Box>
              <Button
                onClick={() => alert('button clicked')}
                p={'25px 40px'}
                borderRadius={'12px'}
                background={bgColorOfSearchIcon}
                color={'#FFFFFF'}
                ml={'55px'}
                mt={5}
              >
                <Flex
                  flexDir={'row'}
                  justifyContent={'space-around'}
                  alignItems={'center'}
                >
                  <MdMyLocation size={20} />
                  <Text
                    ml={3}
                    color={'#FFFFFF'}
                  >
                    {t.enableLocation}
                  </Text>
                </Flex>
              </Button>
            </Box>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  )
}

export default TopSheet
