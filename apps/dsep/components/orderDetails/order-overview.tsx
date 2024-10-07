import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image, useDisclosure } from '@chakra-ui/react'
import React, { FC } from 'react'
import ThreeDots from '../../public/images/threeDots.svg'
import { useLanguage } from '../../hooks/useLanguage'
import { StatusData } from '../../lib/types/status.types'
import ViewMoreOrderModal from './ViewMoreOrderModal'
import { testIds } from '@shared/dataTestIds'

interface OrderOverviewPropsModel {
  statusResPerBpp: StatusData
  handleMenuDotsClick: () => void
}
const OrderOverview: FC<OrderOverviewPropsModel> = props => {
  const { t } = useLanguage()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { statusResPerBpp, handleMenuDotsClick } = props
  const {
    context,
    message: {
      order: { id, items, fulfillments }
    }
  } = statusResPerBpp
  const {
    state: {
      descriptor: { short_desc }
    }
  } = fulfillments[0]
  const totalItemsInAnOrder = items.length
  return (
    <DetailCard>
      <Flex
        mb={'15px'}
        fontSize={'17px'}
        alignItems={'center'}
        justifyContent={'space-between'}
        data-test={testIds.orderDetailspage_orderId_container}
      >
        <Typography
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap'
          }}
          fontWeight={'600'}
          fontSize={'17px'}
          text={`${t.orderId}: ${id}`}
          variant={'subTitleRegular'}
          dataTest={testIds.orderDetailspage_orderId}
        />
        <Image
          onClick={handleMenuDotsClick}
          src={ThreeDots}
          alt="icon-to-open-menu-modal"
          data-test={testIds.orderDetailspage_otherOptions}
        />
      </Flex>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Flex>
          <Box w={['128px', '180px', 'unset']}>
            <Typography
              style={{
                textOverflow: 'ellipsis',

                overflow: 'hidden',
                whiteSpace: 'nowrap'
              }}
              text={items[0].name}
              dataTest={testIds.orderDetailspage_orderSummaryItemName}
              variant={'subTitleRegular'}
            />
          </Box>
          {totalItemsInAnOrder > 1 && (
            <Typography
              onClick={onOpen}
              style={{
                paddingLeft: '5px'
              }}
              color="rgba(var(--color-primary))"
              fontWeight="600"
              text={`+${totalItemsInAnOrder - 1}`}
              variant={'subTitleRegular'}
              dataTest={testIds.orderDetailspage_orderSummaryTotalItems}
            />
          )}
        </Flex>
        <Typography
          fontWeight="600"
          text={short_desc}
          color={'#FDC025'}
          dataTest={testIds.orderDetailspage_orderStatus}
          variant={'subTitleRegular'}
        />
      </Flex>
      <ViewMoreOrderModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        items={items}
        orderId={id}
        dataTest={testIds.orderDetailspage_viewMoreOrders}
      />
    </DetailCard>
  )
}

export default OrderOverview
