import React from 'react'
import { Flex, Image, Stack, StackDivider, Box, CardBody } from '@chakra-ui/react'
import MeterIcon from '@public/images/meter.svg'
import locationIcon from '@public/images/locationIcon.svg'
import nameIcon from '@public/images/nameIcon.svg'
import { Typography } from '@beckn-ui/molecules'
import { Accordion } from '@beckn-ui/molecules'
import { ShippingDetailsProps } from './checkout.types'

const ShippingDetails: React.FC<ShippingDetailsProps> = props => {
  return (
    <Accordion accordionHeader={props.title}>
      <CardBody
        pt={'unset'}
        pb={'15px'}
      >
        <Box>
          <Stack
            divider={<StackDivider />}
            spacing="4"
          >
            <Flex alignItems={'center'}>
              <Image
                src={nameIcon}
                alt={'nameIcon'}
                pr={'12px'}
              />
              <Typography
                variant="subTitleRegular"
                text={props.name}
              />
            </Flex>
            <Flex alignItems={'center'}>
              <Image
                src={locationIcon}
                alt={'locationIcon'}
                pr={'12px'}
              />
              <Typography
                variant="subTitleRegular"
                text={props.location}
              />
            </Flex>
            <Flex alignItems={'center'}>
              <Image
                src={MeterIcon}
                alt={'CallphoneIcon'}
                pr={'12px'}
              />
              <Typography
                variant="subTitleRegular"
                text={props.meterNumber.toString()}
              />
            </Flex>
          </Stack>
        </Box>
      </CardBody>
    </Accordion>
  )
}

export default ShippingDetails
