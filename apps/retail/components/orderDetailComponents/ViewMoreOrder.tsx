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
import crossIcon from '../../public/images/crossIcon.svg'
import { useLanguage } from '../../hooks/useLanguage'
import { Item, QuantityDetails } from '@beckn-ui/common/lib/types'
import { currencyMap } from '@lib/config'
import { testIds } from '@shared/dataTestIds'

export interface ViewMoreOrderModalProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  items: Item[]
  orderId: string
  dataTest?: string
}

const ViewMoreOrderModal: React.FC<ViewMoreOrderModalProps> = props => {
  const { t } = useLanguage()
  console.log('Dank view', props.items)
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
        <ModalContent
          position="fixed"
          bottom="0px"
          mb="0"
          borderRadius="0.75rem 0.75rem 0px 0px"
          maxW="lg"
          data-test={props.dataTest}
        >
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            padding={'15px 20px'}
            fontSize={'17px'}
          >
            <Text data-test={testIds.orderDetailspage_orderId}>
              {t.orderId}: {props.orderId}
            </Text>
            <ModalCloseButton position={'unset'}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={crossIcon} />
            </ModalCloseButton>
          </Flex>
          <Box>
            <Divider />
          </Box>

          <ModalBody padding={'15px 20px'}>
            {props.items.map((item: Item) => {
              return (
                <Flex
                  key={item.id}
                  mb={'20px'}
                  justifyContent={'space-between'}
                >
                  <Box>
                    <Text data-test={testIds.item_title}>{item.name}</Text>
                    <Text
                      fontSize={'12px'}
                      fontWeight={'600'}
                      pt={'5px'}
                      data-test={testIds.item_quantity}
                    >
                      x {(item.quantity as QuantityDetails).selected.count}
                    </Text>
                  </Box>
                  <Typography
                    fontWeight={'600'}
                    dataTest={testIds.item_price}
                    text={`${(currencyMap as any)[item.price.currency]} ${item.price.value} `}
                  />
                </Flex>
              )
            })}

            <Button
              text="Close"
              dataTest={testIds.close}
              handleClick={props.onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ViewMoreOrderModal
