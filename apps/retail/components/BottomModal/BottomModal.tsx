import React from 'react'
import { Image, Box } from '@chakra-ui/react'
import { Transition } from '@headlessui/react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  partialClose?: boolean
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, partialClose }) => {
  return (
    <Transition
      show={isOpen}
      onClick={() => onClose()}
    >
      <Box
        position="fixed"
        zIndex="9999"
        inset="0"
        display="flex"
        alignItems="flex-end"
        justifyContent="center"
        padding={partialClose ? '0' : 'sm:p-0'}
      >
        <Transition.Child
          unmount={false}
          enter="transition-transform duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transition-transform duration-300"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
          style={{
            width: '100vw'
          }}
        >
          <Box
            width="full"
            px="4"
            pb="4"
            pt="2"
            mx="auto"
            bg="#F3F4F5"
            roundedTop="1rem"
            shadow="lg"
            overflow="hidden"
            className="sm:rounded-lg"
          >
            <Image
              src="/images/Indicator.svg"
              mx="auto"
              mb="3"
              alt="indicator"
            />
            {children}
          </Box>
        </Transition.Child>
      </Box>
    </Transition>
  )
}

export default Modal
