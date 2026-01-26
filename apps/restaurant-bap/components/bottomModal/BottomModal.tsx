import React, { ReactNode } from 'react'
import { Flex, Modal, ModalBody, ModalContent, ModalOverlay, Divider, Box, IconButton } from '@chakra-ui/react'
import { FiX } from 'react-icons/fi'

interface BottomModalProps {
  onClose: () => void
  isOpen: boolean
  title?: string
  children: ReactNode
  responsiveBottomGap?: string
  dataTest?: string
  divider?: 'SOLID' | 'DASHED'
  backgroundAccessControl?: boolean
}

const BottomModal: React.FC<BottomModalProps> = ({
  onClose,
  isOpen,
  title,
  children,
  responsiveBottomGap = '30',
  dataTest,
  divider = 'SOLID',
  backgroundAccessControl = false
}) => {
  return (
    <Modal
      isCentered
      onClose={onClose}
      isOpen={isOpen}
      scrollBehavior="outside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay
        zIndex={backgroundAccessControl ? 'unset' : '1'}
        background={backgroundAccessControl ? 'unset' : undefined}
        height={backgroundAccessControl ? '0px' : '100vh'}
      />
      <ModalContent
        position="fixed"
        bottom={{ base: '0', md: `${responsiveBottomGap}%` }}
        mb="0"
        borderRadius={{ base: '1.75rem 1.75rem 0 0', md: '1.75rem', lg: '1.75rem', xl: '1.75rem', '2xl': '1.75rem' }}
        maxW="sm"
        data-test={dataTest}
        containerProps={{
          zIndex: backgroundAccessControl ? 'unset' : undefined,
          height: backgroundAccessControl ? '0px !important' : undefined
        }}
      >
        {/* Close Button */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          pt="12px"
          pb="8px"
        >
          <IconButton
            aria-label="Close"
            icon={<FiX size="20px" />}
            variant="ghost"
            onClick={onClose}
            size="sm"
            data-test="close_button"
            color="gray.600"
            _hover={{ bg: 'gray.100' }}
          />
        </Box>

        {title && (
          <>
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
          </>
        )}

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
