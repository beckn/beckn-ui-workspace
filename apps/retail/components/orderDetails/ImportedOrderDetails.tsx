import { Box, Flex, useDisclosure, Text, Image } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import BottomModalScan from '@components/BottomModal/BottomModalScan'
import BecknButton from '@beckn-ui/molecules/src/components/button/Button'
import Typography from '@beckn-ui/molecules/src/components/typography/typography'
import { ImportOrderModel } from '@beckn-ui/common/lib/types'

interface OrderDetailsProps {
  backOnImportedOrder: (newValue: boolean) => void
  importedOrderObject: ImportOrderModel
}

const OrderDetails: FC<OrderDetailsProps> = ({ backOnImportedOrder, importedOrderObject }) => {
  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true })
  const { t, locale } = useLanguage()

  const handleBackOnImportedOrder = () => {
    backOnImportedOrder(false)
  }

  const importedtObjectOrder = importedOrderObject.items[0]
  const itemData = importedtObjectOrder
  const orderId = importedtObjectOrder.id
  const createdAtTimeline = importedOrderObject.payments[0].time.timestamp
  console.log(importedtObjectOrder)
  const totalPrice = itemData.price.value
  const noOfTravellers = itemData.quantity.selected.count
  const providerName = importedOrderObject.provider.descriptor.name

  const getFormattedDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const options: Object = { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric' }
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date)
    return formattedDate
  }

  return (
    <>
      <BottomModalScan
        isOpen={isOpen}
        onClose={onClose}
        modalHeader={'Order details'}
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
              src={itemData.descriptor.images[0].url}
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
              text={getFormattedDate(createdAtTimeline)}
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
              text={noOfTravellers.toString()}
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
              text={`₹${Number(totalPrice) * noOfTravellers}`}
            />
          </Flex>
          <BecknButton
            children={t.goBack}
            disabled={false}
            dataTest="go-back"
            handleClick={handleBackOnImportedOrder}
          />
        </Box>
      </BottomModalScan>
    </>
  )
}

export default OrderDetails
