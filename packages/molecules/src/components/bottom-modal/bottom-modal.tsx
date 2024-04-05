import React, { ReactNode } from 'react'
import {
  Flex,
  Modal,
  ModalBody,
  Text,
  ModalContent,
  Image,
  ModalOverlay,
  Divider,
  ModalCloseButton,
  Box
} from '@chakra-ui/react'
import crossIcon from '../../../public/images/Indicator.svg'
import { BottomModalProps } from './bottom-modal.types'
import Typography from '../typography'

const BottomModal: React.FC<BottomModalProps> = ({ onClose, isOpen, title, children, responsive = false }) => {
  return (
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
        bottom={{ base: '0', md: '50%' }}
        mb="0"
        borderRadius={{ base: '1.75rem 1.75rem 0 0', md: '1.75rem', lg: '1.75rem', xl: '1.75rem', '2xl': '1.75rem' }}
        maxW="sm"
      >
        <ModalCloseButton
          height={'unset'}
          pt={'5px'}
          margin={'0 auto'}
          position={'unset'}
        >
          <Image
            src={crossIcon}
            alt="Close Icon"
          />
        </ModalCloseButton>
        <Flex
          justifyContent={'space-between'}
          alignItems={'center'}
          padding={'15px 20px'}
        >
          <Typography
            text={title}
            variant="titleRegular"
          />
        </Flex>
        <Box>
          <Divider />
        </Box>

        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default BottomModal
