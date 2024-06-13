import React from 'react'
import { Typography } from '@beckn-ui/molecules'
import { Box, Stack, StackDivider, Flex, Image } from '@chakra-ui/react'

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
}

const ShippingBlock: React.FC<ShippingBlockProps> = ({ title, name, address, mobile, responsive }) => {
  return (
    <Box>
      {title && (
        <Box marginBottom="1rem">
          <Typography
            variant="subTitleRegular"
            fontSize="17px"
            text={title}
          />
        </Box>
      )}
      <Box
        pl={'14px'}
        pr={'11px'}
        pb={'11px'}
        pt={'6px'}
        boxShadow={{
          base: '0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
          md: '0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 8px 20px -5px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Stack
          divider={<StackDivider />}
          spacing="4"
        >
          <Flex alignItems={'center'}>
            <Image
              alt="name-icon"
              src={name.icon}
              pr={'12px'}
            />
            <Typography
              variant="subTitleRegular"
              text={name.text}
            />
          </Flex>
          <Flex alignItems={'center'}>
            <Image
              alt="location-icon"
              src={address.icon}
              pr={'12px'}
            />
            <Typography
              variant="subTitleRegular"
              text={address.text}
            />
          </Flex>
          <Flex alignItems={'center'}>
            <Image
              alt="call-icon"
              src={mobile.icon}
              pr={'12px'}
            />
            <Typography
              variant="subTitleRegular"
              text={mobile.text}
            />
          </Flex>
        </Stack>
      </Box>
    </Box>
  )
}

export default ShippingBlock
