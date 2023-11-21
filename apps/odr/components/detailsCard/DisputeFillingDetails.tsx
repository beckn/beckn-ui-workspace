import React from 'react'
import { Flex, Image, Text, Stack, StackDivider, Box, CardBody } from '@chakra-ui/react'
import nameIcon from '../../public/images/attached.svg'
import Accordion from '../accordion/Accordion'
import Card from '../card/Card'
import DetailsCard from './DetailsCard'

export interface DisputeBillingDetailsProps {
  accordionHeader: string
}
const DisputeFillingDetails: React.FC<DisputeBillingDetailsProps> = props => {
  return (
    <DetailsCard>
      <Stack
        divider={<StackDivider />}
        spacing="4"
      >
        <Flex alignItems={'center'}>
          <Image
            src={nameIcon}
            pr={'12px'}
          />
          <Text fontSize={'15px'}>Dispute details added</Text>
        </Flex>
      </Stack>
    </DetailsCard>
  )
}

export default DisputeFillingDetails
