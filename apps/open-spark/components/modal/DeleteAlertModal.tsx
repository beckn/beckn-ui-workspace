import BottomModalScan from '@beckn-ui/common/src/components/BottomModal/BottomModalScan'
import { Typography } from '@beckn-ui/molecules'
import BecknButton from '@beckn-ui/molecules/src/components/button'
import { Box, Flex } from '@chakra-ui/react'
import React from 'react'
interface DeleteAlertModalProps {
  isOpen: boolean
  onClose: () => void
  handleConfirmDeleteDevice: () => void
  isLoading?: boolean
}

const DeleteAlertModal = (props: DeleteAlertModalProps) => {
  const { isOpen, onClose, handleConfirmDeleteDevice, isLoading } = props
  return (
    <Box>
      <BottomModalScan
        isOpen={isOpen}
        onClose={onClose}
        modalHeader="Attention"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDir="column"
          padding="0 20px 0 20px"
          gap="10px"
        >
          <Typography
            text="Are you sure you want to delete"
            fontSize="18px"
            fontWeight="400"
          />
          <Typography
            text="this item?"
            fontSize="18px"
            fontWeight="400"
            sx={{ marginBottom: '10px' }}
          />
          <BecknButton
            children="Yes I’m Sure"
            variant="solid"
            handleClick={handleConfirmDeleteDevice}
            isLoading={isLoading}
          />
          <BecknButton
            children="Cancel"
            variant="outline"
            color="#E93324"
            handleClick={onClose}
          />
        </Flex>
      </BottomModalScan>
    </Box>
  )
}

export default DeleteAlertModal
