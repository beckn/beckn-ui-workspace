import {
    Modal,
    ModalOverlay,
    ModalContent,
    Flex,
    ModalCloseButton,
    Divider,
    ModalBody,
    Box,
    Text,
    Image,
} from '@chakra-ui/react'
import React from 'react'
import ButtonComp from '../button/Button'
import crossIcon from '../../public/images/crossIcon.svg'
import { useLanguage } from '../../hooks/useLanguage'
import { generateAlphanumericID } from '../../utilities/orderDetails-utils'

export interface ViewMoreOrderModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
    items: any
    orderId: string
}

const ViewMoreOrderModal: React.FC<ViewMoreOrderModalProps> = (props) => {
    const { t } = useLanguage()
    return (
        <>
            <Modal
                isCentered
                onClose={props.onClose}
                isOpen={props.isOpen}
                scrollBehavior="outside"
                motionPreset="slideInBottom"
            >
                <ModalOverlay height="100vh" />
                <ModalContent
                    position="fixed"
                    bottom="0px"
                    mb="0"
                    borderRadius="0.75rem 0.75rem 0px 0px"
                    maxW="lg"
                >
                    <Flex
                        justifyContent={'space-between'}
                        alignItems={'center'}
                        padding={'15px 20px'}
                        fontSize={'17px'}
                    >
                        <Text>
                            {t.orderId}: {props.orderId}
                        </Text>
                        <ModalCloseButton position={'unset'}>
                            {/* eslint-disable-next-line jsx-a11y/alt-text */}
                            <Image src={crossIcon} />
                        </ModalCloseButton>
                    </Flex>
                    <Box>
                        <Divider />
                    </Box>

                    <ModalBody padding={'15px 20px'}>
                        {props.items.map((item: any) => {
                            return (
                                <Flex
                                    key={item.id}
                                    mb={'20px'}
                                    justifyContent={'space-between'}
                                >
                                    <Box>
                                        <Text>{item.descriptor.name}</Text>
                                        <Text
                                            fontSize={'12px'}
                                            fontWeight={'600'}
                                            pt={'5px'}
                                        >
                                            x {item.quantity.count}
                                        </Text>
                                    </Box>
                                    <Text
                                        fontSize={'15px'}
                                        fontWeight={'600'}
                                        color={'rgba(var(--color-primary))'}
                                    >
                                        {t.currencySymbol}
                                        {item.price.offered_value}
                                    </Text>
                                </Flex>
                            )
                        })}

                        <ButtonComp
                            buttonText={'Close'}
                            type={'solid'}
                            isDisabled={false}
                            handleOnClick={props.onClose}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ViewMoreOrderModal
