import React, { useEffect, useState } from 'react'
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
    Skeleton,
} from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { useLanguage } from '../../hooks/useLanguage'
import { IGeoLocationSearchPageRootState } from '../../lib/types/geoLocationSearchPage'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLocationSearchPageVisibility } from '../../store/geoMapLocationSearch-slice'
import { useRouter } from 'next/router'

const theme = extendTheme({
    components: {
        Modal: {
            baseStyle: {
                overlay: {
                    top: '98px',
                },
            },
        },
    },
})

interface TopSheetPropsModel {
    currentAddress: string
    loadingForCurrentAddress?: boolean
    currentLocationFetchError?: string
}

const TopSheet: React.FC<TopSheetPropsModel> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { t } = useLanguage()
    const router = useRouter()

    const dispatch = useDispatch()
    const {
        currentAddress = '',
        currentLocationFetchError,
        loadingForCurrentAddress,
    } = props

    const geoLocationSearchPageSelectedAddress = useSelector(
        (state: IGeoLocationSearchPageRootState) => {
            return state.geoLocationSearchPageUI.geoAddress
        }
    )

    const onFocusChange = () => {
        dispatch(toggleLocationSearchPageVisibility(true))
    }
    const renderAddresstext =
        currentLocationFetchError ||
        geoLocationSearchPageSelectedAddress ||
        currentAddress ||
        ''

    return (
        <ChakraProvider theme={theme}>
            <Box
                boxShadow="0px 4px 20px 0px rgba(0, 0, 0, 0.08)"
                padding={'14px'}
            >
                <Box>
                    <Flex alignItems={'center'}>
                        <Image
                            pr={'6px'}
                            src={'/images/LocationIcon1.svg'}
                            alt="locationMarker icon"
                        />

                        <Box>
                            <Text fontSize={'12px'}>{t.yourLocation}</Text>
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
                                            alt="icon-for-opening-topsheet"
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
                        top="90px"
                        mb="0"
                        borderRadius="0px 0px 1.75rem 1.75rem "
                        maxW="lg"
                        border={`2px solid ${'rgba(var(--color-primary))'}`}
                        p={'16px 24px'}
                        pb={'25px'}
                    >
                        <Box>
                            <Image
                                position={'absolute'}
                                top={'-12px'}
                                left={'30%'}
                                src="/images/UpArrow.svg"
                                alt="up arrow"
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
                            <Text fontSize={'12px'}>
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
                                    alt="back arrow"
                                />
                                <Input
                                    pl="30px"
                                    _active={{ outline: 'unset' }}
                                    _focusVisible={{ borderColor: 'unset' }}
                                    outline="unset"
                                    border="unset"
                                    borderRadius={'unset'}
                                    borderBottom={'2px solid black'}
                                    placeholder={t.searchForLocation}
                                    onChange={onFocusChange}
                                />

                                <Image
                                    position={'absolute'}
                                    right="0"
                                    bottom={'8px'}
                                    src="/images/SearchIcon1.svg"
                                    width={'24px'}
                                    alt="search arrow"
                                />
                            </Box>
                        </Box>
                    </ModalContent>
                </Modal>
            </Box>
        </ChakraProvider>
    )
}

export default TopSheet
