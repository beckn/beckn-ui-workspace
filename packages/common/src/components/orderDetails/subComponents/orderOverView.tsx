import React from 'react'
import { DetailCard } from '@beckn-ui/becknified-components'
import { Typography } from '@beckn-ui/molecules'
import { Box, Flex, Image } from '@chakra-ui/react'
import { formatTimestamp } from '../../../utils'
import { OrderOverViewProps } from '../orderDetails.types'

const OrderOverView = (props: OrderOverViewProps) => {
  const { t, orderData } = props

  return (
    <>
      <Box
        pb="15px"
        pt="20px"
      >
        <Typography
          variant="subTitleRegular"
          text={t('orderOverview')}
          fontSize="17px"
        />
      </Box>

      <DetailCard>
        <Flex>
          <Image
            mr={'15px'}
            height={['60px', '80px', '80px', '80px']}
            w={['40px', '80px', '80px', '80px']}
            src={orderData.url}
            alt="product image"
          />
          <Box w={'100%'}>
            <Box
              pt={'unset'}
              pb={4}
            >
              <Typography
                variant="subTitleSemibold"
                text={orderData.name}
              />
            </Box>

            <Flex
              pt={'unset'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <Typography
                variant="subTitleRegular"
                text={t('placedAt')}
              />
              <Typography
                variant="subTitleRegular"
                text={formatTimestamp(orderData.createdAt!)}
              />
            </Flex>
          </Box>
        </Flex>
      </DetailCard>
    </>
  )
}

export default OrderOverView
