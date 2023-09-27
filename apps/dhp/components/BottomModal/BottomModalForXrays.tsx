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
  Image
} from '@chakra-ui/react'
import React from 'react'
import ButtonComp from '../button/Button'
import crossIconHz from '../../public/images/crossIconHz.svg'
import { useLanguage } from '../../hooks/useLanguage'
import { generateAlphanumericID } from '../../utilities/orderDetails-utils'
import Router from 'next/router'

export interface BottomModalForXraysProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  items: any
  description: string
}

const BottomModalForXrays: React.FC<BottomModalForXraysProps> = props => {
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
        <ModalContent position="fixed" bottom="0px" mb="0" borderRadius="0.75rem 0.75rem 0px 0px" maxW="lg">
          <Box padding={'20px 20px 5px'}>
            <Text>{props.items}</Text>
            <ModalCloseButton
              position={'absolute'}
              display="flex"
              justifyContent={'center'}
              top="-10px"
              w={'100%'}
              _focusVisible={{ boxHhadow: 'unset' }}
            >
              <Image src={crossIconHz} />
            </ModalCloseButton>
          </Box>

          <Divider />

          <ModalBody padding={'15px 20px'}>
            <Box mb="20px" fontSize={'15px'}>
              <Text pb={'8px'}> {props.description}</Text>
            </Box>

            <ButtonComp
              buttonText={t.searchForLabs}
              background={'rgba(var(--color-primary))'}
              color={'rgba(var(--text-color))'}
              isDisabled={false}
              handleOnClick={() => {}}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default BottomModalForXrays
