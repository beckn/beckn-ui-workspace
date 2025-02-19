import React from 'react'
import { Flex, Image, Stack, StackDivider, Box, CardBody } from '@chakra-ui/react'
import CallphoneIcon from '../../../public/images/CallphoneIcon.svg'
import locationIcon from '../../../public/images/locationIcon.svg'
import nameIcon from '../../../public/images/nameIcon.svg'
import { Typography } from '@beckn-ui/molecules'
import { Accordion } from '@beckn-ui/molecules'
import { ShippingDetailsProps } from './checkout.types'
import DetailsCard from './details-card'

const ShippingDetails: React.FC<ShippingDetailsProps> = props => {
  return (
    <>
      {props.noAccordion ? (
        <DetailsCard>
          <CardBody
            pt={'unset'}
            pb={'15px'}
            p="0"
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
                    src={CallphoneIcon}
                    alt={'CallphoneIcon'}
                    pr={'12px'}
                  />
                  <Typography
                    variant="subTitleRegular"
                    text={props.number.toString()}
                  />
                </Flex>
              </Stack>
            </Box>
          </CardBody>
        </DetailsCard>
      ) : (
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
                    src={CallphoneIcon}
                    alt={'CallphoneIcon'}
                    pr={'12px'}
                  />
                  <Typography
                    variant="subTitleRegular"
                    text={props.number.toString()}
                  />
                </Flex>
              </Stack>
            </Box>
          </CardBody>
        </Accordion>
      )}
    </>
  )
}

export default ShippingDetails
