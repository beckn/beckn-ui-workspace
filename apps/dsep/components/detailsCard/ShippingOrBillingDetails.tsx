import React from 'react'
import { Flex, Image, Text, Stack, StackDivider, Box, CardBody, useTheme } from '@chakra-ui/react'
import CallphoneIcon from '../../public/images/CallphoneIcon.svg'
import locationIcon from '../../public/images/locationIcon.svg'
import nameIcon from '../../public/images/nameIcon.svg'
import Accordion from '../accordion/Accordion'
import { DetailCard } from '@beckn-ui/becknified-components'
import { useLanguage } from '../../hooks/useLanguage'
import { Typography } from '@beckn-ui/molecules'
import { testIds } from '@shared/dataTestIds'

export interface ShippingOrBillingDetailsProps {
  name: string
  location: string
  number: number | string
  handleEditClick: () => void
  dataTest?: string
}

const ShippingOrBillingDetails: React.FC<ShippingOrBillingDetailsProps> = props => {
  const { t } = useLanguage()
  const theme = useTheme()
  const color = theme.colors.primary[100]

  return (
    <DetailCard>
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        pb="10px"
        data-test={props.dataTest}
      >
        <Box
          fontWeight={600}
          fontSize={'17px'}
        >
          {t.billing}
        </Box>
        <Box
          cursor={'pointer'}
          onClick={props.handleEditClick}
          data-test={testIds.edit_button_Text}
        >
          <Typography
            color={color}
            variant="subTextSemibold"
            text={t.edit}
          />
        </Box>
      </Flex>
      <Box>
        <Stack
          divider={<StackDivider />}
          spacing="4"
        >
          <Flex alignItems={'center'}>
            <Image
              alt="name-icon"
              src={nameIcon}
              pr={'12px'}
            />
            <Text
              fontSize={'15px'}
              data-test={testIds.orderDetailspage_name}
            >
              {props.name}
            </Text>
          </Flex>
          <Flex alignItems={'center'}>
            <Image
              alt="location-icon"
              src={locationIcon}
              pr={'12px'}
            />
            <Text
              fontSize={'15px'}
              data-test={testIds.orderDetailspage_address}
            >
              {props.location}
            </Text>
          </Flex>
          <Flex alignItems={'center'}>
            <Image
              alt="call-icon"
              src={CallphoneIcon}
              pr={'12px'}
            />
            <Text
              fontSize={'15px'}
              data-test={testIds.orderDetailspage_mobileNumber}
            >
              {props.number}
            </Text>
          </Flex>
        </Stack>
      </Box>
    </DetailCard>
  )
}

export default ShippingOrBillingDetails
