import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Text,
  Flex,
  Image,
  Box
} from '@chakra-ui/react'
import { ParsedItemModel } from '@beckn-ui/common/lib/types'
import FoodItemCard from '../foodItemCard/FoodItemCard'

interface ProviderItemsModalProps {
  isOpen: boolean
  onClose: () => void
  providerName: string
  providerImage?: string
  items: ParsedItemModel[]
  onItemClick: (item: ParsedItemModel) => void
  onAddToCart: (item: ParsedItemModel) => void
}

const ProviderItemsModal: React.FC<ProviderItemsModalProps> = ({
  isOpen,
  onClose,
  providerName,
  providerImage,
  items,
  onItemClick,
  onAddToCart
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        borderRadius="20px"
        mx="16px"
        maxH="90vh"
        overflow="hidden"
      >
        <ModalHeader
          borderBottom="1px solid"
          borderColor="gray.100"
          pb="16px"
          pt="20px"
          px="20px"
        >
          <Flex
            align="center"
            gap="12px"
          >
            <Box
              w="50px"
              h="50px"
              borderRadius="12px"
              overflow="hidden"
              bg="gray.100"
              flexShrink={0}
            >
              <Image
                src={providerImage || '/images/restaurant-placeholder.svg'}
                alt={providerName}
                w="100%"
                h="100%"
                objectFit="cover"
                fallbackSrc="/images/restaurant-placeholder.svg"
              />
            </Box>
            <Box
              flex="1"
              minW="0"
            >
              <Text
                fontSize="20px"
                fontWeight="700"
                color="gray.800"
                lineHeight="1.2"
                noOfLines={1}
              >
                {providerName}
              </Text>
              <Text
                fontSize="14px"
                color="gray.500"
                fontWeight="400"
                mt="6px"
                lineHeight="1.4"
              >
                {items.length} {items.length === 1 ? 'item' : 'items'} available
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton
          top="20px"
          right="20px"
        />

        <ModalBody
          py="20px"
          px="20px"
          overflowY="auto"
        >
          <VStack
            spacing="14px"
            align="stretch"
          >
            {items.map(item => {
              const currency = item.item.price.currency || 'INR'
              const price = item.item.price.value

              return (
                <FoodItemCard
                  key={item.id}
                  id={item.id}
                  name={item.item.name}
                  description={item.item.short_desc}
                  longDesc={item.item.long_desc}
                  soldBy={item.providerName}
                  price={price}
                  currency={currency === 'INR' ? '₹' : currency}
                  image={item.item.images?.[0]?.url}
                  onAddClick={() => onAddToCart(item)}
                  onItemClick={() => {
                    // onItemClick(item)
                    // onClose()
                  }}
                />
              )
            })}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ProviderItemsModal
