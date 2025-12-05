import React from 'react'
import { Modal, ModalOverlay, ModalContent, ModalBody, Button, Text, VStack } from '@chakra-ui/react'

interface OrderConfirmationModalProps {
  isOpen: boolean
  headerText: string
  subHeaderText: string
  onClose: () => void
  onRetry: () => void
  onGoTo?: {
    onClick: () => void
    text: string
  }
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  onGoTo,
  headerText,
  subHeaderText
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        maxW="90%"
        borderRadius="12px"
        p="20px"
      >
        <ModalBody>
          <VStack
            spacing={6}
            textAlign="center"
          >
            <Text
              fontSize="lg"
              fontWeight="bold"
            >
              {headerText}
            </Text>
            <Text color="gray.600">{subHeaderText}</Text>
            <VStack
              spacing={4}
              w="full"
            >
              <Button
                w="full"
                colorScheme="primary"
                onClick={() => {
                  onRetry()
                  onClose()
                }}
              >
                Retry Order
              </Button>
              {onGoTo && (
                <Button
                  w="full"
                  variant="outline"
                  colorScheme="primary"
                  onClick={onGoTo?.onClick}
                >
                  {onGoTo?.text}
                </Button>
              )}
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default OrderConfirmationModal
