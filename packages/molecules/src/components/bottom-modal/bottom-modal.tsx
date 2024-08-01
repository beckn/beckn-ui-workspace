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

const BottomModal: React.FC<BottomModalProps> = ({
  onClose,
  isOpen,
  title,
  children,
  responsive = false,
  responsiveBottomGap = '30',
  dataTest,
  overlay = true,
  divider = 'SOLID'
}) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="outside"
      motionPreset="slideInBottom"
    >
      {overlay && <ModalOverlay height="100vh" />}
      <ModalContent
        position="fixed"
        bottom={{ base: '0', md: `${responsiveBottomGap}%` }}
        mb="0"
        borderRadius={{ base: '1.75rem 1.75rem 0 0', md: '1.75rem', lg: '1.75rem', xl: '1.75rem', '2xl': '1.75rem' }}
        maxW="sm"
        data-test={dataTest}
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
          <Box
            fontSize={'17px'}
            fontWeight="400"
            w={'100%'}
          >
            {title!}
          </Box>
        </Flex>

        <Box>
          {divider === 'SOLID' && <Divider />}
          {divider === 'DASHED' && (
            <Divider
              borderBottomWidth="0px"
              padding={'4px'}
              backgroundImage="linear-gradient(to right, #00000033 0 50%, transparent 50% 100%)"
              backgroundRepeat={'repeat no-repeat'}
              backgroundSize="6% 1px"
            />
          )}
        </Box>

        <ModalBody
          maxHeight={'calc(100vh - 10rem)'}
          overflow={'auto'}
        >
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default BottomModal
