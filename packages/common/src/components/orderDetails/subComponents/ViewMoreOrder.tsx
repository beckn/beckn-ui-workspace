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
import { Button, Typography } from '@beckn-ui/molecules'
import crossIcon from '../../../../public/images/crossIcon.svg'
import { Item, QuantityDetails } from '@beckn-ui/common/lib/types'

export interface ViewMoreOrderModalProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  items: Item[]
  orderId: string
  currencyMap: any
  t: (key: string) => string
}

const ViewMoreOrderModal: React.FC<ViewMoreOrderModalProps> = props => {
  const { isOpen, onClose, items, onOpen, orderId, t, currencyMap } = props
  console.log('Dank view', items)
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
              {t('orderId')}: {orderId}
            </Text>
            <ModalCloseButton position={'unset'}>
              <Image src={crossIcon} />
            </ModalCloseButton>
          </Flex>
          <Box>
            <Divider />
          </Box>

          <ModalBody padding={'15px 20px'}>
            {items.map((item: Item) => {
              return (
                <Flex
                  key={item.id}
                  mb={'20px'}
                  justifyContent={'space-between'}
                >
                  <Flex>
                    <Typography
                      style={{ maxWidth: '15rem' }}
                      text={item.name}
                    />
                    <Typography
                      fontWeight={'600'}
                      style={{ whiteSpace: 'nowrap', alignContent: 'center' }}
                      text={`x ${(item.quantity as QuantityDetails).selected.count}`}
                    />
                  </Flex>
                  <Typography
                    fontWeight={'600'}
                    style={{ whiteSpace: 'nowrap', alignContent: 'center' }}
                    text={`${(currencyMap as any)[item.price.currency]} ${item.price.value} `}
                  />
                </Flex>
              )
            })}

            <Button
              text="Close"
              handleClick={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewMoreOrderModal
