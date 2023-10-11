import React from 'react'
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ModalCloseButton
} from '@chakra-ui/react'

interface ConfirmationProps {
  reviewSubmitted: boolean
}

const Confirmation: React.FC<ConfirmationProps> = ({ reviewSubmitted }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const message = reviewSubmitted ? 'Success' : 'Failure'

  return (
    <>
      <Button onClick={onOpen}></Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{message}</ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Confirmation
