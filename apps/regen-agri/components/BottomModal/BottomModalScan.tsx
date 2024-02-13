import React from 'react'
import {
    Image,
    ModalOverlay,
    Modal,
    ModalContent,
    Box,
    ModalHeader,
    Divider,
    Flex,
} from '@chakra-ui/react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    partialClose?: boolean
    modalHeader?: string
}

const BottomModalScan: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    modalHeader,
}) => {
    return (
        <>
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
                    bottom="0px"
                    pb="20px"
                    borderRadius="1rem 1rem 0px 0px"
                    maxW="lg"
                >
                    <Flex
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        padding={'20px 24px'}
                    >
                        <ModalHeader
                            textAlign="left"
                            fontSize="17px"
                            fontWeight={'400'}
                            p={'unset'}
                            flex={'unset'}
                        >
                            {modalHeader}
                        </ModalHeader>
                        <Box onClick={onClose}>
                            <Image src="/images/crossIcon.svg" />
                        </Box>
                    </Flex>
                    <Divider mb={'20px'} />
                    {children}
                </ModalContent>
            </Modal>
        </>
    )
}

export default BottomModalScan
