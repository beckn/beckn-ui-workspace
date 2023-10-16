import { Box, Divider, Flex, useDisclosure, Text, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModal from '../BottomModal'
import Button from '../button/Button'

interface OrderDetailsProps {
  backOnImportedOrder: (newValue: boolean) => void
  importedOrderObject: any
}

const OrderDetails: FC<OrderDetailsProps> = ({ backOnImportedOrder, importedOrderObject }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t, locale } = useLanguage()

  const handleBackOnImportedOrder = () => {
    backOnImportedOrder(false)
  }

  const importedtObjectOrder = importedOrderObject.message.order
  const itemData = importedtObjectOrder.item[0]
  const orderId = importedtObjectOrder.id
  const createdAtTimeline = importedtObjectOrder.created_at
  const totalPrice = itemData.price.value
  const providerName = importedtObjectOrder.provider.descriptor.name

  return (
    <>
      <BottomModal isOpen={isOpen} onClose={onClose} modalHeader={t('orderDetails')}>
        <Box p={'0px 20px'}>
          <Box position={'relative'} width={'335px'} height={'142px'}>
            <Image width={'100%'} height={'100%'} alt="item-image" src={itemData.descriptor.images[0]} />
          </Box>
          <Flex pt={'20px'} pb={'25px'} fontSize={'15px'} justifyContent="space-between" alignItems={'center'}>
            <Text width={'50%'}>{itemData.descriptor.name}</Text>
            <Text pr={'2px'}>
              {t('orderId')}
              <span style={{ fontWeight: '600' }}>:{orderId}</span>
            </Text>
          </Flex>
          <Text textAlign={'center'} fontSize={'15px'} fontWeight="600" pb={'20px'}>
            {providerName}
          </Text>
          <Flex fontSize={'15px'} justifyContent={'space-between'} alignItems={'center'} pb={'20px'}>
            <Text>{t('bookedon')}</Text>
            <Text>{createdAtTimeline}</Text>
          </Flex>
          <Flex fontSize={'15px'} justifyContent={'space-between'} alignItems={'center'} pb={'20px'}>
            <Text>{t('noofTravellers')}</Text>
            <Text>01</Text>
          </Flex>
          <Flex fontSize={'15px'} pb={'25px'} justifyContent={'space-between'} alignItems={'center'}>
            <Text>{t('totalPrice')}</Text>
            <Text>₹{totalPrice}</Text>
          </Flex>

          <Button
            buttonText={t('goBack')}
            background={'rgba(var(--text-color))'}
            color={'rgba(var(--color-primary))'}
            isDisabled={false}
            handleOnClick={handleBackOnImportedOrder}
          ></Button>
        </Box>
      </BottomModal>
    </>
  )
}

export default OrderDetails
