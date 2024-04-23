import { Box, Flex, useDisclosure, Text, Image } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'

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
  const noOfTravellers = itemData.quantity.count
  const providerName = importedtObjectOrder.provider.descriptor.name

  return (
    <>
      <BottomModalScan
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={t.orderDetails}
      >
        <Box p={'0px 20px'}>
          <Box
            position={'relative'}
            width={'335px'}
            height={'142px'}
          >
            <Image
              width={'100%'}
              height={'100%'}
              alt="item-image"
              src={itemData.descriptor.images[0]}
            />
          </Box>
          <Flex
            pt={'20px'}
            pb={'25px'}
            fontSize={'15px'}
            justifyContent="space-between"
            alignItems={'center'}
          >
            <Typography
              variant="subTitleRegular"
              text={itemData.descriptor.name}
            />
            <Text pr={'2px'}>
              {t.orderId}
              <span style={{ fontWeight: '600' }}>:{orderId}</span>
            </Text>
          </Flex>
          <Typography
            variant="subTitleRegular"
            text={providerName}
          />

          <Flex
            fontSize={'15px'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pb={'20px'}
          >
            <Typography
              variant="subTitleRegular"
              text={t.bookedon}
            />
            <Typography
              variant="subTitleRegular"
              text={createdAtTimeline}
            />
          </Flex>
          <Flex
            fontSize={'15px'}
            justifyContent={'space-between'}
            alignItems={'center'}
            pb={'20px'}
          >
            <Typography
              variant="subTitleRegular"
              text={t.noofTravellers}
            />
            <Typography
              variant="subTitleRegular"
              text={noOfTravellers}
            />
          </Flex>
          <Flex
            fontSize={'15px'}
            pb={'25px'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              variant="subTitleRegular"
              text={t.totalPrice}
            />
            <Typography
              variant="subTitleRegular"
              text={`₹${totalPrice}`}
            />
          </Flex>
          <BecknButton
            children={t.goBack}
            disabled={false}
            handleClick={handleBackOnImportedOrder}
          />
        </Box>
      </BottomModalScan>
    </>
  )
}

export default OrderDetails