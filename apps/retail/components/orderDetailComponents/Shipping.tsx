import React from 'react'
import { Typography } from '@beckn-ui/molecules'
import { Box, Stack, StackDivider, Flex } from '@chakra-ui/react'
import { testIds } from '@shared/dataTestIds'

export interface ShippingBlockProps {
  title?: string
  name: {
    icon: string
    text: string
  }
  address: {
    icon: string
    text: string
  }
  mobile: {
    icon: string
    text: string
  }
  responsive?: boolean
  dataTest?: string
}

const ShippingBlock: React.FC<ShippingBlockProps> = ({ title, name, address, mobile, dataTest }) => {
  return (
    <Box
      data-test={dataTest}
      padding={'10px 15px'}
    >
      <Box
        padding={'12px 14px'}
        bg={'#F0F0F0'}
        borderRadius={'5px'}
      >
        {title && (
          <Box marginBottom="0.5rem">
            <Typography
              variant="subTitleRegular"
              fontSize="12px"
              fontWeight="600"
              text={title}
            />
          </Box>
        )}
        <Stack
          divider={
            <StackDivider
              width={'unset'}
              border="0px solid #000000"
              opacity={0.2}
              margin={'15px -20px'}
            />
          }
          spacing="1"
        >
          <Flex flexDir={'column'}>
            <Typography
              variant="subTitleRegular"
              text={'Name'}
              fontSize={'12px'}
              fontWeight={'500'}
            />
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_name}
              text={name.text}
              fontSize={'12px'}
              fontWeight={'400'}
            />
          </Flex>
          <Flex flexDir={'column'}>
            <Typography
              variant="subTitleRegular"
              text={'Address'}
              fontSize={'12px'}
              fontWeight={'500'}
            />
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_address}
              text={address.text}
              fontSize={'12px'}
              fontWeight={'400'}
            />
          </Flex>
          <Flex flexDir={'column'}>
            <Typography
              variant="subTitleRegular"
              text={'Contact number'}
              fontSize={'12px'}
              fontWeight={'500'}
            />
            <Typography
              variant="subTitleRegular"
              dataTest={testIds.orderDetailspage_mobileNumber}
              text={mobile.text}
              fontSize={'12px'}
              fontWeight={'400'}
            />
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}

export default ShippingBlock
